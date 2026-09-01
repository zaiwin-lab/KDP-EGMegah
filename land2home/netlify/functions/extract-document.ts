import type Anthropic from '@anthropic-ai/sdk';
import type { Config } from '@netlify/functions';
import { MODEL, client, firstText, json, notConfigured, parseJsonObject } from './_anthropic';

/* Reads a member's uploaded document and proposes values for the form.
   Everything it returns is a suggestion: the member confirms each value,
   and a KOBIS or KPSM officer verifies the document itself. Nothing that
   comes out of here is ever treated as verified. */

interface Field {
  field: string;
  label: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  conflicts_with?: string;
  accepted?: boolean;
}

const FIELDS_BY_KIND: Record<string, string[]> = {
  ic: ['full_name', 'ic_number', 'address_line1', 'postcode'],
  membership_card: ['membership_no', 'full_name'],
  land_title: ['title_no', 'lot_no', 'district', 'area_sq_ft'],
  income_proof: ['employer', 'monthly_income'],
};

const SYSTEM = `You read scanned documents for a Malaysian home-building portal and propose form values.

You never verify anything. Your output is always a suggestion a person will confirm.

Return a single JSON object, nothing else:
{"fields":[{"field":"<key>","label":"<short human label>","value":"<value or empty string>","confidence":"high|medium|low"}],"notes":["<short plain-language note>"]}

Rules:
- Only use the field keys you are asked for. Use an empty string when a value is not legible.
- confidence "low" whenever the scan is poor, the value is ambiguous, or a unit conversion was involved.
- Put a note on anything a member should double check: converted areas, cropped edges, handwriting, expired dates.
- Notes are plain language, one short sentence each, addressed to the member.
- Never invent a value that is not visible in the document.`;

export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const anthropic = client();
  if (!anthropic) return notConfigured();

  let body: {
    kind?: string;
    fileName?: string;
    /* Base64 image or PDF, when the deployment forwards the file itself. */
    media?: { type: 'image' | 'pdf'; media_type: string; data: string };
    known?: Record<string, string | undefined>;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const wanted = FIELDS_BY_KIND[body.kind ?? ''];
  if (!wanted) return json({ fields: [], notes: [] });

  /* Without the file bytes there is nothing to read. Say so rather than
     inventing values; the browser falls back to its local engine. */
  if (!body.media) return json({ error: 'no_document_supplied' }, 422);

  const content: Anthropic.ContentBlockParam[] =
    body.media.type === 'pdf'
      ? [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: body.media.data } },
          { type: 'text', text: prompt(body.kind!, wanted, body.fileName) },
        ]
      : [
          { type: 'image', source: { type: 'base64', media_type: body.media.media_type as 'image/png', data: body.media.data } },
          { type: 'text', text: prompt(body.kind!, wanted, body.fileName) },
        ];

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      output_config: { effort: 'low' },
      system: SYSTEM,
      messages: [{ role: 'user', content }],
    });
    if (message.stop_reason === 'refusal') return json({ error: 'declined' }, 422);

    const parsed = parseJsonObject<{ fields: Field[]; notes: string[] }>(firstText(message));
    if (!parsed?.fields) return json({ error: 'unreadable_response' }, 502);

    /* Flag disagreements with what the profile already holds, and mark
       conflicting values so the member has to make the call. */
    const known = body.known ?? {};
    const fields = parsed.fields
      .filter((f) => wanted.includes(f.field))
      .map((f) => {
        const existing = known[f.field];
        const conflict = existing && f.value && existing.trim() !== f.value.trim() ? existing : undefined;
        return { ...f, conflicts_with: conflict, accepted: !conflict && f.confidence === 'high' };
      });

    return json({ fields, notes: Array.isArray(parsed.notes) ? parsed.notes.slice(0, 5) : [] });
  } catch (error) {
    console.error('extract-document failed', error);
    return json({ error: 'assistant_unavailable' }, 502);
  }
};

const prompt = (kind: string, wanted: string[], fileName?: string) =>
  `Document type: ${kind}. File name: ${fileName ?? 'unknown'}.\nRead these fields: ${wanted.join(', ')}.`;

export const config: Config = { path: '/.netlify/functions/extract-document' };
