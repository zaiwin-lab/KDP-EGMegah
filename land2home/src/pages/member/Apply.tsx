import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import {
  Assurance, Badge, Button, EmptyState, FieldShell, Icon, Input, Panel, Select, Textarea,
} from '@/components/ui';
import { ExtractionReview } from '@/components/ExtractionReview';
import { extractFromDocument } from '@/ai/client';
import { documentGaps, explainQuestion, recommendHouseType } from '@/ai/localAssistant';
import { HOUSE_TYPES } from '@/lib/houseTypes';
import { myr, shortDate, sqft } from '@/lib/format';
import { cn } from '@/lib/cn';
import type { Application, ExtractedField, HouseTypeKey, LandParcel } from '@/lib/types';

const STEPS = [
  { n: 1, title: 'About you', blurb: 'Confirm what we already hold.' },
  { n: 2, title: 'Your land', blurb: 'Where the house will stand.' },
  { n: 3, title: 'Your home', blurb: 'Choose a plan.' },
  { n: 4, title: 'Paying for it', blurb: 'Budget and financing.' },
  { n: 5, title: 'Documents', blurb: 'Only what is missing.' },
  { n: 6, title: 'Check and send', blurb: 'A summary before you commit.' },
];

const BUDGET_BANDS = [
  'Under RM 180,000',
  'RM 180,000 – RM 220,000',
  'RM 200,000 – RM 260,000',
  'RM 260,000 – RM 340,000',
  'Above RM 340,000',
  'I am not sure yet',
];

export default function Apply() {
  const { profile, land, application, documents, actor, refresh, mode } = usePortal();
  const repo = useRepo();

  const [step, setStep] = useState(application?.last_step ?? 1);
  const [appDraft, setAppDraft] = useState<Partial<Application>>({});
  const [landDraft, setLandDraft] = useState<Partial<LandParcel>>({});
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [explaining, setExplaining] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  /* The demonstration member already has an approved application, so the
     form would otherwise never be reachable. This opens it read-only-ish
     for the demo, clearly labelled, without faking a second application. */
  const [previewForm, setPreviewForm] = useState(false);
  const saveTimer = useRef<number | null>(null);

  const app = useMemo(() => ({ ...application, ...appDraft }) as Application, [application, appDraft]);
  const parcel = useMemo(() => ({ ...land, ...landDraft }) as LandParcel, [land, landDraft]);

  /* Auto-save: every change is written back a moment after typing stops,
     so a member can close the tab and pick up exactly where they were. */
  const queueSave = useCallback(
    (patch: Partial<Application>, landPatch?: Partial<LandParcel>) => {
      /* Previewing must not write over the real application. */
      if (!profile || previewForm) return;
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(async () => {
        await repo.saveApplication(profile.id, patch);
        if (landPatch && Object.keys(landPatch).length) {
          await repo.saveLand(profile.id, landPatch, actor);
        }
        setSavedAt(new Date());
      }, 700);
    },
    [profile, repo, actor, previewForm],
  );

  useEffect(() => () => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
  }, []);

  const setApp = <K extends keyof Application>(key: K, value: Application[K]) => {
    const patch = { ...appDraft, [key]: value };
    setAppDraft(patch);
    queueSave(patch, landDraft);
  };

  const setLand = <K extends keyof LandParcel>(key: K, value: LandParcel[K]) => {
    const patch = { ...landDraft, [key]: value };
    setLandDraft(patch);
    queueSave(appDraft, patch);
  };

  const goto = async (next: number) => {
    setStep(next);
    if (profile && !previewForm) await repo.saveApplication(profile.id, { ...appDraft, last_step: next });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!profile) return null;

  /* A member with a live application does not get a second one by accident. */
  if (application && application.status !== 'draft' && !previewForm) {
    return (
      <>
        <PageHead title="Your application" />
        <Panel className="border-forest-600/30">
          <div className="flex items-start gap-3 border-b border-line px-5 py-4">
            <Icon name="check" className="mt-0.5 text-ok" />
            <div>
              <p className="font-semibold text-ink">
                You already have an application with us — reference {application.reference}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                Sent on {shortDate(application.submitted_at)}. Starting a second one would duplicate your
                file and slow everything down, so we have kept you on this one.
              </p>
            </div>
          </div>
          <div className="px-5 py-5">
            <Summary app={application} parcel={land} profile={profile} />
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to="/app/journey"
                className="inline-flex h-11 items-center rounded-xl bg-forest-800 px-5 text-[0.9375rem] font-semibold text-forest-50 hover:bg-forest-700"
              >
                See where it has reached
              </Link>
              <Link
                to="/app/profile"
                className="inline-flex h-11 items-center rounded-xl border border-line-2 px-5 text-[0.9375rem] font-semibold text-ink hover:border-forest-600"
              >
                Change my details
              </Link>
              {mode === 'demo' && (
                <Button variant="ghost" onClick={() => setPreviewForm(true)}>
                  Open the application form (demonstration)
                </Button>
              )}
            </div>
          </div>
        </Panel>
      </>
    );
  }

  const recommendation = recommendHouseType({
    household_size: profile.household_size,
    monthly_income: profile.monthly_income,
    land_area: parcel?.area_sq_ft,
    budget_band: app?.budget_band,
  });

  return (
    <>
      {previewForm && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-500/40 bg-gold-100/60 px-5 py-4">
          <p className="text-sm leading-relaxed text-ink">
            You are looking at the application form for demonstration. Your real application
            ({application?.reference}) is unaffected, and nothing here will be submitted.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setPreviewForm(false)}>
            Back to my application
          </Button>
        </div>
      )}

      <PageHead
        title="Your application"
        lead="Six short sections. Everything saves as you go, so you can stop at any point and come back."
        action={
          savedAt && (
            <p className="flex items-center gap-2 text-sm text-ink-2">
              <Icon name="check" size={16} className="text-ok" />
              Saved {savedAt.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )
        }
      />

      <div className="grid gap-5 lg:grid-cols-[15rem_1fr]">
        <nav aria-label="Application sections">
          <ol className="space-y-1">
            {STEPS.map((s) => {
              const active = s.n === step;
              const done = s.n < step;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => void goto(s.n)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                      active ? 'bg-forest-100' : 'hover:bg-forest-50',
                    )}
                    aria-current={active ? 'step' : undefined}
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-2xs font-bold',
                        done ? 'bg-forest-800 text-forest-50' : active ? 'bg-gold-500 text-forest-950' : 'bg-forest-100 text-ink-3',
                      )}
                    >
                      {done ? <Icon name="check" size={12} /> : s.n}
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block text-sm font-semibold', active ? 'text-ink' : done ? 'text-ink' : 'text-ink-2')}>
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[0.8125rem] text-ink-2">{s.blurb}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div>
          {step === 1 && (
            <Section
              title="About you"
              intro="We already hold all of this from your membership record. Check it is still right — you will not be asked for it again."
            >
              <dl className="divide-y divide-line rounded-xl border border-line">
                <Held label="Name" value={profile.full_name} />
                <Held label="Identity card" value={profile.ic_number} />
                <Held label="KPSM membership" value={profile.membership_no} verified={profile.membership_status === 'verified'} />
                <Held label="Phone" value={profile.phone} />
                <Held label="Email" value={profile.email} />
                <Held label="Household" value={profile.household_size ? `${profile.household_size} people` : '—'} />
                <Held label="Co-applicant" value={profile.co_applicant_name ?? 'None'} />
              </dl>
              <p className="mt-4 text-sm text-ink-2">
                Something wrong?{' '}
                <Link to="/app/profile" className="font-semibold text-forest-800 underline underline-offset-4">
                  Change it in my details
                </Link>{' '}
                and it updates everywhere.
              </p>
            </Section>
          )}

          {step === 2 && (
            <Section title="Your land" intro="Tell us about the land you want to build on. If you have the title to hand, upload it and we will read most of this for you.">
              <LandStep
                parcel={parcel}
                onChange={setLand}
                explaining={explaining}
                setExplaining={setExplaining}
                onExtract={async (fields) => {
                  if (previewForm) return;
                  const patch: Partial<LandParcel> = {};
                  for (const f of fields) {
                    if (!f.accepted || !f.value.trim()) continue;
                    if (f.field === 'title_no') patch.title_no = f.value;
                    if (f.field === 'lot_no') patch.lot_no = f.value;
                    if (f.field === 'district') patch.district = f.value;
                    if (f.field === 'area_sq_ft') patch.area_sq_ft = Number(f.value) || undefined;
                  }
                  if (Object.keys(patch).length) {
                    setLandDraft((prev) => ({ ...prev, ...patch }));
                    await repo.saveLand(profile.id, patch, actor);
                    await refresh();
                  }
                }}
              />
            </Section>
          )}

          {step === 3 && (
            <Section title="Your home" intro="Pick the plan that fits your family and your land. Nothing is fixed until you sign a contract, and you can change your mind before then.">
              <div className="rounded-xl border border-gold-500/40 bg-gold-100/50 p-5">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <Icon name="sparkle" size={17} className="text-gold-700" />
                  Based on what you have told us, {HOUSE_TYPES.find((h) => h.key === recommendation.suggested)?.name} looks like the closest fit
                </p>
                <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-ink-2">
                  {recommendation.reasons.map((r) => (
                    <li key={r} className="flex gap-2"><Icon name="check" size={15} className="mt-0.5 text-forest-600" />{r}</li>
                  ))}
                  {recommendation.cautions.map((c) => (
                    <li key={c} className="flex gap-2"><Icon name="info" size={15} className="mt-0.5 text-warn" />{c}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {HOUSE_TYPES.map((house) => {
                  const selected = app?.house_type === house.key;
                  const suggested = recommendation.suggested === house.key;
                  return (
                    <button
                      key={house.key}
                      type="button"
                      onClick={() => setApp('house_type', house.key as HouseTypeKey)}
                      className={cn(
                        'overflow-hidden rounded-2xl border text-left transition-[border-color,box-shadow]',
                        selected ? 'border-forest-700 shadow-mid ring-1 ring-forest-700' : 'border-line hover:border-forest-600',
                      )}
                      aria-pressed={selected}
                    >
                      <span className="relative block aspect-[16/10] overflow-hidden">
                        <img src={house.image} alt={house.image_alt} loading="lazy" className="h-full w-full object-cover" />
                        <span className="absolute left-3 top-3 rounded-full bg-onyx/75 px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.12em] text-gold-200 backdrop-blur-sm">
                          {house.series}
                        </span>
                      </span>
                      <span className="block p-5">
                        <span className="flex items-start justify-between gap-2">
                          <span className="font-display text-xl text-ink">{house.name}</span>
                          {selected ? (
                            <Badge tone="ok"><Icon name="check" size={13} /> Chosen</Badge>
                          ) : suggested ? (
                            <Badge tone="gold">Suggested</Badge>
                          ) : null}
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-ink-2">{house.tagline}</span>
                        <span className="mt-3 block text-sm text-ink-2">
                          {house.built_up_sq_ft ? `${sqft(house.built_up_sq_ft)} · ${house.bedrooms} bedrooms` : 'Sized around your plan'}
                        </span>
                        <span className="mt-1 block tnum font-semibold text-forest-800">
                          {house.indicative_price ? `from ${myr(house.indicative_price)}` : 'Priced after the site visit'}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Conditional: only a custom choice asks for a brief. */}
              {app?.house_type === 'CUSTOM' && (
                <div className="mt-5">
                  <FieldShell
                    label="Describe the house you have in mind"
                    htmlFor="brief"
                    required
                    action={<Explain field="custom_brief" explaining={explaining} setExplaining={setExplaining} />}
                    hint={explaining === 'custom_brief' ? explainQuestion('custom_brief') : undefined}
                  >
                    <Textarea
                      id="brief"
                      value={app.custom_brief ?? ''}
                      onChange={(e) => setApp('custom_brief', e.target.value)}
                      placeholder="For example: three bedrooms on one level, a wide veranda, and a workshop at the back."
                    />
                  </FieldShell>
                </div>
              )}
            </Section>
          )}

          {step === 4 && (
            <Section title="Paying for it" intro="A guide, not a commitment. The real price is fixed only after EGMH has visited your land.">
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldShell
                  label="What are you comfortable spending in total?"
                  htmlFor="budget"
                  required
                  action={<Explain field="budget_band" explaining={explaining} setExplaining={setExplaining} />}
                  hint={explaining === 'budget_band' ? explainQuestion('budget_band') : undefined}
                >
                  <Select id="budget" value={app?.budget_band ?? ''} onChange={(e) => setApp('budget_band', e.target.value)}>
                    <option value="">Choose a range</option>
                    {BUDGET_BANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </Select>
                </FieldShell>

                <FieldShell
                  label="How do you plan to pay?"
                  htmlFor="financing"
                  required
                  action={<Explain field="financing_route" explaining={explaining} setExplaining={setExplaining} />}
                  hint={explaining === 'financing_route' ? explainQuestion('financing_route') : undefined}
                >
                  <Select
                    id="financing"
                    value={app?.financing_route ?? ''}
                    onChange={(e) => setApp('financing_route', e.target.value as Application['financing_route'])}
                  >
                    <option value="">Choose one</option>
                    <option value="kpsm_facility">Through the KPSM facility</option>
                    <option value="bank">A bank loan</option>
                    <option value="self_funded">My own funds</option>
                    <option value="undecided">I have not decided</option>
                  </Select>
                </FieldShell>

                <FieldShell
                  label="Roughly when would you like to start?"
                  htmlFor="start"
                  action={<Explain field="target_start" explaining={explaining} setExplaining={setExplaining} />}
                  hint={explaining === 'target_start' ? explainQuestion('target_start') : undefined}
                >
                  <Input id="start" type="month" value={(app?.target_start ?? '').slice(0, 7)} onChange={(e) => setApp('target_start', `${e.target.value}-01`)} />
                </FieldShell>
              </div>

              {/* Conditional: only the KPSM route needs income confirmation. */}
              {app?.financing_route === 'kpsm_facility' && (
                <div className="mt-5 rounded-xl bg-forest-50 p-5">
                  <p className="font-semibold text-ink">Because you chose the KPSM facility</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">
                    KPSM will need a current income confirmation. You already have one on file
                    {documents.find((d) => d.kind === 'income_proof')?.valid_until
                      ? `, valid until ${shortDate(documents.find((d) => d.kind === 'income_proof')?.valid_until)}`
                      : ''}
                    , so there is nothing to upload right now.
                  </p>
                </div>
              )}

              {app?.financing_route === 'bank' && (
                <div className="mt-5 rounded-xl bg-forest-50 p-5">
                  <p className="font-semibold text-ink">Because you chose a bank loan</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">
                    Your coordinator will send you the documents your bank usually asks for. You do not need
                    to arrange anything before the site visit.
                  </p>
                </div>
              )}
            </Section>
          )}

          {step === 5 && (
            <Section title="Documents" intro="Only what is actually missing. Anything already on file and still valid is not asked for again.">
              <DocumentStep />
            </Section>
          )}

          {step === 6 && (
            <Section title="Check and send" intro="Read this through. Once you send it, KOBIS picks it up and arranges your site visit.">
              <Summary app={app} parcel={parcel} profile={profile} />

              <div className="mt-5">
                <Assurance icon="person">
                  Sending this does not commit you to building. It asks EGMH to visit your land and give you
                  a written price. You decide what happens after that.
                </Assurance>
              </div>

              <Button
                className="mt-5"
                size="lg"
                loading={submitting}
                disabled={!app?.house_type || previewForm}
                onClick={async () => {
                  setSubmitting(true);
                  try {
                    if (application) await repo.submitApplication(application.id, actor);
                    await refresh();
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                Send my application
              </Button>
              {previewForm ? (
                <p className="mt-2 text-sm text-ink-2">Submitting is switched off while you are previewing the form.</p>
              ) : !app?.house_type ? (
                <p className="mt-2 text-sm text-warn">Choose a home in section 3 first.</p>
              ) : null}
            </Section>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={() => void goto(Math.max(1, step - 1))} disabled={step === 1}>
              Back
            </Button>
            {step < 6 && (
              <Button onClick={() => void goto(Math.min(6, step + 1))}>
                Continue
                <Icon name="arrow" size={17} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <Panel>
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-2">{intro}</p>
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
    </Panel>
  );
}

function Held({ label, value, verified }: { label: string; value: string; verified?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3">
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="flex items-center gap-2 font-semibold text-ink">
        {value}
        {verified && <Badge tone="ok"><Icon name="check" size={12} /> Verified</Badge>}
      </dd>
    </div>
  );
}

function Explain({
  field,
  explaining,
  setExplaining,
}: {
  field: string;
  explaining: string | null;
  setExplaining: (v: string | null) => void;
}) {
  const open = explaining === field;
  return (
    <button
      type="button"
      onClick={() => setExplaining(open ? null : field)}
      className="text-sm font-semibold text-forest-800 underline decoration-forest-600/30 underline-offset-4 hover:decoration-forest-600"
      aria-expanded={open}
    >
      {open ? 'Hide' : 'What does this mean?'}
    </button>
  );
}

function LandStep({
  parcel,
  onChange,
  explaining,
  setExplaining,
  onExtract,
}: {
  parcel: LandParcel;
  onChange: <K extends keyof LandParcel>(key: K, value: LandParcel[K]) => void;
  explaining: string | null;
  setExplaining: (v: string | null) => void;
  onExtract: (fields: ExtractedField[]) => Promise<void>;
}) {
  const { profile, land } = usePortal();
  const [pending, setPending] = useState<{ fields: ExtractedField[]; notes: string[]; source: 'assisted' | 'local' } | null>(null);
  const [busy, setBusy] = useState(false);

  const locked = parcel?.verification_status === 'verified';

  return (
    <div className="space-y-5">
      {locked && (
        <div className="flex items-start gap-2.5 rounded-xl bg-ok-bg p-4">
          <Icon name="check" className="mt-0.5 text-ok" />
          <p className="text-sm leading-relaxed text-ink">
            Your land has already been verified against the land office record, so these details are locked.
            Ask your coordinator if something needs changing.
          </p>
        </div>
      )}

      {!locked && (
        <FieldShell label="Upload your land title" htmlFor="title-file" hint="We will read the title number, lot and district from it and show you what we found.">
          <input
            id="title-file"
            type="file"
            accept="image/*,application/pdf"
            disabled={busy}
            className="field file:mr-3 file:rounded-lg file:border-0 file:bg-forest-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-forest-800"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              setBusy(true);
              try {
                const result = await extractFromDocument({ kind: 'land_title', fileName: file.name, profile, land });
                setPending(result);
              } finally {
                setBusy(false);
              }
            }}
          />
        </FieldShell>
      )}

      {busy && <p className="text-sm font-semibold text-ink-2">Reading your title…</p>}

      {pending && (
        <ExtractionReview
          fields={pending.fields}
          notes={pending.notes}
          source={pending.source}
          onDiscard={() => setPending(null)}
          onConfirm={async (fields) => {
            await onExtract(fields);
            setPending(null);
          }}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldShell
          label="Title number"
          htmlFor="title_no"
          required
          action={<Explain field="title_no" explaining={explaining} setExplaining={setExplaining} />}
          hint={explaining === 'title_no' ? explainQuestion('title_no') : undefined}
        >
          <Input id="title_no" value={parcel?.title_no ?? ''} disabled={locked} onChange={(e) => onChange('title_no', e.target.value)} />
        </FieldShell>

        <FieldShell
          label="Lot number"
          htmlFor="lot_no"
          required
          action={<Explain field="lot_no" explaining={explaining} setExplaining={setExplaining} />}
          hint={explaining === 'lot_no' ? explainQuestion('lot_no') : undefined}
        >
          <Input id="lot_no" value={parcel?.lot_no ?? ''} disabled={locked} onChange={(e) => onChange('lot_no', e.target.value)} />
        </FieldShell>

        <FieldShell label="District" htmlFor="district" required>
          <Input id="district" value={parcel?.district ?? ''} disabled={locked} onChange={(e) => onChange('district', e.target.value)} />
        </FieldShell>

        <FieldShell
          label="Land area (square feet)"
          htmlFor="area"
          required
          action={<Explain field="area_sq_ft" explaining={explaining} setExplaining={setExplaining} />}
          hint={explaining === 'area_sq_ft' ? explainQuestion('area_sq_ft') : 'An approximate figure is fine.'}
        >
          <Input
            id="area"
            type="number"
            min={0}
            value={parcel?.area_sq_ft ?? ''}
            disabled={locked}
            onChange={(e) => onChange('area_sq_ft', Number(e.target.value))}
          />
        </FieldShell>

        <FieldShell
          label="What kind of title is it?"
          htmlFor="tenure"
          required
          action={<Explain field="tenure" explaining={explaining} setExplaining={setExplaining} />}
          hint={explaining === 'tenure' ? explainQuestion('tenure') : undefined}
        >
          <Select id="tenure" value={parcel?.tenure ?? ''} disabled={locked} onChange={(e) => onChange('tenure', e.target.value as LandParcel['tenure'])}>
            <option value="">Choose one</option>
            <option value="native_title">Native title</option>
            <option value="mixed_zone">Mixed zone</option>
            <option value="leasehold">Leasehold</option>
            <option value="freehold">Freehold</option>
          </Select>
        </FieldShell>

        <FieldShell
          label="Who owns it?"
          htmlFor="ownership"
          required
          action={<Explain field="ownership" explaining={explaining} setExplaining={setExplaining} />}
          hint={explaining === 'ownership' ? explainQuestion('ownership') : undefined}
        >
          <Select id="ownership" value={parcel?.ownership ?? ''} disabled={locked} onChange={(e) => onChange('ownership', e.target.value as LandParcel['ownership'])}>
            <option value="">Choose one</option>
            <option value="sole">In my name alone</option>
            <option value="joint">Jointly with someone else</option>
            <option value="family_trust">Held by the family</option>
          </Select>
        </FieldShell>
      </div>

      <fieldset>
        <legend className="label mb-2">What is already at the site?</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {([
            ['road_access', 'A vehicle can reach it'],
            ['power_nearby', 'Power nearby'],
            ['water_nearby', 'Water nearby'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line-2 text-forest-700 focus:ring-forest-600/25"
                checked={Boolean(parcel?.[key])}
                disabled={locked}
                onChange={(e) => onChange(key, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
        <p className="hint">EGMH checks all of this again on the site visit, so a best guess is fine.</p>
      </fieldset>

      {/* Conditional: no road access changes what happens next. */}
      {parcel && !parcel.road_access && (
        <div className="rounded-xl bg-warn-bg p-4">
          <p className="font-semibold text-ink">No vehicle access yet</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">
            That is not a problem, but it does change how materials get to the site. EGMH will look at access
            first when they visit, and the quotation will allow for it.
          </p>
        </div>
      )}
    </div>
  );
}

function DocumentStep() {
  const { documents } = usePortal();
  const gaps = documentGaps(documents, 'plan');
  const held = documents.filter((d) => d.status === 'verified');

  return (
    <div className="space-y-5">
      {gaps.length === 0 ? (
        <div className="flex items-start gap-3 rounded-xl bg-ok-bg p-4">
          <Icon name="check" className="mt-0.5 text-ok" />
          <div>
            <p className="font-semibold text-ok">Nothing is missing</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">
              Everything this stage needs is already on file and still valid.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {gaps.map((gap) => (
            <li key={gap.kind} className="rounded-xl border border-gold-500/40 bg-gold-100/50 p-4">
              <p className="font-semibold text-ink">{gap.label}</p>
              <p className="mt-0.5 text-sm text-ink-2">{gap.note}</p>
              <Link to="/app/documents" className="mt-2 inline-block text-sm font-semibold text-forest-800 underline underline-offset-4">
                Upload it now
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Already on file</p>
        <ul className="divide-y divide-line rounded-xl border border-line">
          {held.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="flex items-center gap-2.5 text-sm text-ink">
                <Icon name="check" size={16} className="text-ok" />
                {doc.title}
              </span>
              <span className="text-[0.8125rem] text-ink-2">
                {doc.valid_until ? `valid until ${shortDate(doc.valid_until)}` : 'no expiry'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* The short confirmation summary shown before anything is submitted. */
function Summary({
  app,
  parcel,
  profile,
}: {
  app: Application | null;
  parcel: LandParcel | null;
  profile: { full_name: string; membership_no: string; co_applicant_name?: string; household_size?: number };
}) {
  const house = HOUSE_TYPES.find((h) => h.key === app?.house_type);
  const rows: [string, string][] = [
    ['Applicant', `${profile.full_name} (KPSM ${profile.membership_no})`],
    ['Co-applicant', profile.co_applicant_name ?? 'None'],
    ['Household', profile.household_size ? `${profile.household_size} people` : 'Not given'],
    ['Land', parcel ? `${parcel.lot_no}, ${parcel.district}, ${parcel.state} — ${sqft(parcel.area_sq_ft)}` : 'Not given'],
    ['Title', parcel?.title_no ?? 'Not given'],
    ['Home chosen', house?.name ?? 'Not chosen yet'],
    ['Indicative price', house?.indicative_price ? myr(house.indicative_price) : 'Priced after the site visit'],
    ['Budget range', app?.budget_band ?? 'Not given'],
    [
      'Paying by',
      app?.financing_route === 'kpsm_facility'
        ? 'The KPSM facility'
        : app?.financing_route === 'bank'
          ? 'A bank loan'
          : app?.financing_route === 'self_funded'
            ? 'Own funds'
            : 'Not decided',
    ],
    ['Hoping to start', app?.target_start ? shortDate(app.target_start) : 'Not given'],
  ];

  if (!app) {
    return <EmptyState title="Nothing to summarise yet">Fill in the sections above and your summary appears here.</EmptyState>;
  }

  return (
    <dl className="divide-y divide-line rounded-xl border border-line">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-4 py-3">
          <dt className="text-sm text-ink-2">{label}</dt>
          <dd className="text-right font-semibold text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
