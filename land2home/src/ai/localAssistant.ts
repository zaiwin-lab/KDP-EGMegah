import type { DocumentKind, DocumentRecord, ExtractedField, HouseTypeKey, LandParcel, MemberProfile } from '@/lib/types';
import { HOUSE_TYPES } from '@/lib/houseTypes';
import { myr, sqft } from '@/lib/format';

/* The assistant runs locally by default so the portal works with no API key
   and no network. When ANTHROPIC_API_KEY is configured on the server, the
   Netlify functions in netlify/functions/ take over and these become the
   fallback. Neither path is ever allowed to decide anything: extraction is
   confirmed by the member, and verification stays with a human officer. */

/* ── Plain-language explanations of form questions ─────────────── */

const EXPLANATIONS: Record<string, string> = {
  membership_no:
    'This is the number on your KPSM membership record. KPSM uses it to confirm you are a member in good standing. If you cannot find it, your coordinator can look it up for you.',
  ic_number:
    'Your identity card number, exactly as printed on your IC. It is used to confirm who you are and is stored securely.',
  title_no:
    'The reference printed at the top of your land title document. It tells the land office exactly which piece of land you mean.',
  lot_no:
    'The lot number for your land, for example "Lot 2214". It usually appears on your title and on the land office plan.',
  tenure:
    'The kind of ownership your land is under. Native title, mixed zone, leasehold and freehold each have different rules about who can build. If you are unsure, choose what your title says at the top, or leave it and your coordinator will confirm it.',
  ownership:
    'Whether the land is in your name alone, shared with someone else, or held by the family. If it is shared, the other owners will also need to agree before building starts.',
  area_sq_ft:
    'Roughly how big your land is, in square feet. An approximate figure is fine here. The exact area is taken from your title during verification.',
  road_access:
    'Whether a vehicle can currently reach the land. This affects how materials are delivered and is checked again during the site visit.',
  monthly_income:
    'Your regular monthly income before deductions. KPSM uses it to work out which financing options are open to you. It is not a credit check.',
  household_size:
    'How many people will live in the house, including children. It helps us suggest a house size that fits your family.',
  budget_band:
    'The range you are comfortable spending in total. This is a guide, not a commitment. The real price is fixed only after EGMH visits your land and issues a quotation.',
  financing_route:
    'How you plan to pay for the build. Choosing the KPSM facility means KPSM manages the staged payments to EGMH on your behalf.',
  target_start:
    'Roughly when you would like building to start. Weather and approvals can shift this, so an approximate month is enough.',
  custom_brief:
    'Describe the house you have in mind in your own words. Number of rooms, anything unusual about the site, or a plan you already have. There is no wrong way to write this.',
};

export function explainQuestion(field: string): string {
  return (
    EXPLANATIONS[field] ??
    'Answer as best you can. Nothing here is final, everything saves as you go, and your coordinator checks it with you before it is used.'
  );
}

/* ── House type recommendation (the member still chooses) ───────── */

export interface Recommendation {
  suggested: HouseTypeKey;
  reasons: string[];
  cautions: string[];
}

export function recommendHouseType(input: {
  household_size?: number;
  monthly_income?: number;
  land_area?: number;
  budget_band?: string;
}): Recommendation {
  const { household_size = 4, land_area = 0, budget_band } = input;
  const reasons: string[] = [];
  const cautions: string[] = [];

  let suggested: HouseTypeKey = 'B';
  if (household_size <= 3) suggested = 'A';
  else if (household_size >= 6) suggested = 'C';

  const budgetCeiling = budget_band ? parseBudgetCeiling(budget_band) : null;
  if (budgetCeiling) {
    const affordable = [...HOUSE_TYPES]
      .filter((h) => h.indicative_price && h.indicative_price <= budgetCeiling)
      .sort((a, b) => (b.indicative_price ?? 0) - (a.indicative_price ?? 0))[0];
    if (affordable && affordable.key !== suggested) {
      const suggestedType = HOUSE_TYPES.find((h) => h.key === suggested);
      if ((suggestedType?.indicative_price ?? 0) > budgetCeiling) {
        cautions.push(
          `${suggestedType?.name} is usually around ${myr(suggestedType?.indicative_price ?? null)}, which sits above the range you gave. ${affordable.name} fits inside it.`,
        );
        suggested = affordable.key;
      }
    }
  }

  const chosen = HOUSE_TYPES.find((h) => h.key === suggested);
  reasons.push(`A household of ${household_size} usually fits ${chosen?.name} comfortably.`);
  if (chosen?.indicative_price) {
    reasons.push(`The indicative price is around ${myr(chosen.indicative_price)}, before your site is assessed.`);
  }

  if (land_area && chosen && land_area < chosen.min_land_sq_ft) {
    cautions.push(
      `Your land is about ${sqft(land_area)}. ${chosen.name} normally needs at least ${sqft(chosen.min_land_sq_ft)} once setbacks are allowed for. EGMH will confirm this on the site visit.`,
    );
  } else if (land_area && chosen) {
    reasons.push(`Your land at ${sqft(land_area)} has room for this plan with the usual setbacks.`);
  }

  cautions.push('This is a suggestion based on what you have entered. The choice is yours, and you can change it before the contract is signed.');

  return { suggested, reasons, cautions };
}

function parseBudgetCeiling(band: string): number | null {
  const numbers = band.replace(/,/g, '').match(/\d{4,}/g);
  if (!numbers?.length) return null;
  return Math.max(...numbers.map(Number));
}

/* ── Missing document summary ──────────────────────────────────── */

const REQUIRED_BY_STAGE: Record<string, { kind: DocumentKind; label: string }[]> = {
  land: [
    { kind: 'ic', label: 'Identity card' },
    { kind: 'membership_card', label: 'KPSM membership record' },
    { kind: 'land_title', label: 'Land title' },
  ],
  home: [],
  plan: [
    { kind: 'income_proof', label: 'Income confirmation' },
    { kind: 'consent_form', label: 'Signed consent form' },
  ],
  build: [],
  inspection: [],
  keys: [],
};

export interface DocumentGap {
  kind: DocumentKind;
  label: string;
  reason: 'missing' | 'expiring' | 'rejected';
  note: string;
}

/* A document that is on file and still valid is never asked for again. */
export function documentGaps(documents: DocumentRecord[], stage: string): DocumentGap[] {
  const required = REQUIRED_BY_STAGE[stage] ?? [];
  const gaps: DocumentGap[] = [];

  for (const req of required) {
    const held = documents.filter((d) => d.kind === req.kind);
    const valid = held.find(
      (d) => d.status === 'verified' && (!d.valid_until || new Date(d.valid_until).getTime() > Date.now()),
    );
    if (!valid) {
      const rejected = held.find((d) => d.status === 'rejected');
      gaps.push({
        kind: req.kind,
        label: req.label,
        reason: rejected ? 'rejected' : 'missing',
        note: rejected
          ? 'The copy on file could not be read. A clearer photo or scan is needed.'
          : 'Not on file yet.',
      });
      continue;
    }
    if (valid.valid_until && new Date(valid.valid_until).getTime() < Date.now() + 60 * 86400000) {
      gaps.push({
        kind: req.kind,
        label: req.label,
        reason: 'expiring',
        note: `On file and accepted, but expires on ${valid.valid_until}.`,
      });
    }
  }
  return gaps;
}

/* ── Document extraction (demo OCR) ────────────────────────────── */

/* Produces candidate values with a confidence flag and marks anything that
   disagrees with the profile. Nothing here is treated as verified: the
   member confirms each value, and an officer verifies the document itself. */
export function extractFields(
  kind: DocumentKind,
  fileName: string,
  profile: MemberProfile | null,
  land: LandParcel | null,
): { fields: ExtractedField[]; notes: string[] } {
  const notes: string[] = [];
  const fields: ExtractedField[] = [];
  const lowQuality = /photo|img_|whatsapp|scan0/i.test(fileName);

  const add = (
    field: string,
    label: string,
    value: string,
    confidence: ExtractedField['confidence'],
    existing?: string,
  ) => {
    const conflict = existing && value && existing.trim() && existing.trim() !== value.trim() ? existing : undefined;
    fields.push({ field, label, value, confidence: lowQuality && confidence === 'high' ? 'medium' : confidence, accepted: !conflict, conflicts_with: conflict });
  };

  switch (kind) {
    case 'ic':
      add('full_name', 'Full name', profile?.full_name ?? '', 'high', profile?.full_name);
      add('ic_number', 'Identity card number', profile?.ic_number ?? '', 'high', profile?.ic_number);
      add('address_line1', 'Address on the card', profile?.address_line1 ?? '', 'medium', profile?.address_line1);
      add('postcode', 'Postcode', profile?.postcode ?? '', 'medium', profile?.postcode);
      break;
    case 'membership_card':
      add('membership_no', 'Membership number', profile?.membership_no ?? '', 'high', profile?.membership_no);
      add('full_name', 'Name on the record', profile?.full_name ?? '', 'high', profile?.full_name);
      break;
    case 'land_title':
      add('title_no', 'Title number', land?.title_no ?? '', 'high', land?.title_no);
      add('lot_no', 'Lot number', land?.lot_no ?? '', 'high', land?.lot_no);
      add('district', 'District', land?.district ?? '', 'high', land?.district);
      add('area_sq_ft', 'Land area (sq ft)', land ? String(land.area_sq_ft) : '', 'low', land ? String(land.area_sq_ft) : undefined);
      notes.push('The land area on a title is often written in hectares or acres. Please check the converted figure before you accept it.');
      break;
    case 'income_proof':
      add('employer', 'Employer', profile?.employer ?? '', 'medium', profile?.employer);
      add('monthly_income', 'Monthly income (RM)', profile?.monthly_income ? String(profile.monthly_income) : '', 'medium', profile?.monthly_income ? String(profile.monthly_income) : undefined);
      break;
    default:
      notes.push('No fields were read from this document. It has been filed against your profile and a KOBIS officer will check it.');
  }

  if (lowQuality) {
    notes.push('This looks like a phone photograph. Some values were read with lower certainty, so please check each one.');
  }
  if (fields.some((f) => !f.value)) {
    notes.push('Some fields could not be read at all. Please type them in yourself.');
  }

  return { fields, notes };
}

/* ── Technical → plain language ────────────────────────────────── */

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bsuperstructure\b/gi, 'main house structure'],
  [/\bsubstructure\b/gi, 'foundation'],
  [/\bRC\b/g, 'reinforced concrete'],
  [/\bformwork\b/gi, 'temporary moulds'],
  [/\bstruck\b/gi, 'taken down'],
  [/\bscreed(ing)?\b/gi, 'floor levelling'],
  [/\bsetting out\b/gi, 'marking the house position on the ground'],
  [/\bhoarding\b/gi, 'site fencing'],
  [/\bblinding\b/gi, 'a thin concrete base layer'],
  [/\btruss(es)?\b/gi, 'roof frame'],
  [/\bwall plate\b/gi, 'the beam the roof sits on'],
  [/\bfair-faced\b/gi, 'smooth finished'],
  [/\bM&E\b/g, 'wiring and plumbing'],
  [/\bpractical completion\b/gi, 'the house being finished'],
  [/\bdefects liability period\b/gi, 'the period when EGMH still fixes faults free of charge'],
  [/\bcertified at (\d+)%/gi, 'checked and confirmed at $1% complete'],
  [/\bcast\b/gi, 'poured and set'],
];

/* A readable fallback when the server-side assistant is unavailable.
   EGMH always sees and can edit the result before it is published. */
export function simplifyTechnical(input: {
  work_completed: string;
  current_work: string;
  next_activity: string;
  expected_next_date: string;
  delay_reason?: string;
}): string {
  const soften = (text: string) =>
    REPLACEMENTS.reduce((acc, [pattern, plain]) => acc.replace(pattern, plain), text).trim();

  const parts: string[] = [];
  if (input.work_completed) {
    const done = soften(input.work_completed).replace(/\.$/, '');
    parts.push(`${capitalise(done)}.`);
  }
  if (input.current_work) {
    parts.push(`Right now the team is working on ${lower(soften(input.current_work)).replace(/\.$/, '')}.`);
  }
  if (input.next_activity) {
    const when = input.expected_next_date ? `, expected around ${input.expected_next_date}` : '';
    parts.push(`Next comes ${lower(soften(input.next_activity)).replace(/\.$/, '')}${when}.`);
  }
  if (input.delay_reason) {
    parts.push(soften(input.delay_reason));
  }
  return parts.join(' ');
}

const capitalise = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const lower = (s: string) => (s ? s[0].toLowerCase() + s.slice(1) : s);
