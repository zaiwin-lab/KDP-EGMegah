import { useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, Button, FieldShell, Icon, Input, Panel, PanelHeader, Select } from '@/components/ui';
import { resetDemoData } from '@/data';
import { shortDate } from '@/lib/format';
import type { ConsentKey, MemberProfile } from '@/lib/types';

const CONSENTS: { key: ConsentKey; label: string; detail: string }[] = [
  {
    key: 'store_documents',
    label: 'Store my documents',
    detail: 'Keep the identity, membership, land and income documents I upload, so I am not asked for them again.',
  },
  {
    key: 'share_with_builder',
    label: 'Share what EGMH needs',
    detail: 'Pass my name, contact details and land information to EGMH so they can assess the site and build.',
  },
  {
    key: 'contact_updates',
    label: 'Send me updates',
    detail: 'Contact me about progress, payments and anything that needs my attention.',
  },
];

/* One Member, One Profile. Everything here is captured once and reused by
   every form, application and document in the portal. */
export default function Profile() {
  const { profile, actor, refresh, mode } = usePortal();
  const repo = useRepo();
  const [draft, setDraft] = useState<Partial<MemberProfile>>({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!profile) return null;

  const value = <K extends keyof MemberProfile>(key: K): MemberProfile[K] =>
    (draft[key] !== undefined ? draft[key] : profile[key]) as MemberProfile[K];

  const set = <K extends keyof MemberProfile>(key: K, v: MemberProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: v }));
    setSaved(false);
  };

  const dirty = Object.keys(draft).length > 0;

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await repo.updateProfile(profile.id, draft, actor);
      await refresh();
      setDraft({});
      setSaved(true);
    } finally {
      setBusy(false);
    }
  };

  const toggleConsent = async (key: ConsentKey, granted: boolean) => {
    const consents = { ...profile.consents, [key]: { granted, at: new Date().toISOString() } };
    await repo.updateProfile(profile.id, { consents }, actor);
    await refresh();
  };

  return (
    <>
      <PageHead
        title="My details"
        lead="Entered once, reused everywhere. Change something here and every form in the portal picks it up."
      />

      <form onSubmit={save} className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Panel>
            <PanelHeader
              title="Membership"
              description="Confirmed against the KPSM register by a person, not by software."
              action={
                profile.membership_status === 'verified' ? (
                  <Badge tone="ok"><Icon name="check" size={13} /> Verified</Badge>
                ) : (
                  <Badge tone="warn">Being checked</Badge>
                )
              }
            />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <FieldShell label="Full name" htmlFor="full_name" required>
                <Input id="full_name" value={value('full_name')} onChange={(e) => set('full_name', e.target.value)} />
              </FieldShell>
              <FieldShell label="Identity card number" htmlFor="ic" required>
                <Input id="ic" value={value('ic_number')} onChange={(e) => set('ic_number', e.target.value)} />
              </FieldShell>
              <FieldShell label="Membership number" htmlFor="mem" required hint={profile.membership_verified_at ? `Verified ${shortDate(profile.membership_verified_at)}` : undefined}>
                <Input id="mem" value={value('membership_no')} disabled />
              </FieldShell>
              <FieldShell label="Preferred language" htmlFor="lang" required>
                <Select id="lang" value={value('preferred_language')} onChange={(e) => set('preferred_language', e.target.value as 'en' | 'ms')}>
                  <option value="en">English</option>
                  <option value="ms">Bahasa Melayu</option>
                </Select>
              </FieldShell>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="How we reach you" />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <FieldShell label="Email address" htmlFor="email" required>
                <Input id="email" type="email" value={value('email')} onChange={(e) => set('email', e.target.value)} />
              </FieldShell>
              <FieldShell label="Phone number" htmlFor="phone" required>
                <Input id="phone" type="tel" value={value('phone')} onChange={(e) => set('phone', e.target.value)} />
              </FieldShell>
              <FieldShell label="Address" htmlFor="addr1" required>
                <Input id="addr1" value={value('address_line1')} onChange={(e) => set('address_line1', e.target.value)} />
              </FieldShell>
              <FieldShell label="Second address line" htmlFor="addr2">
                <Input id="addr2" value={value('address_line2') ?? ''} onChange={(e) => set('address_line2', e.target.value)} />
              </FieldShell>
              <FieldShell label="Postcode" htmlFor="postcode" required>
                <Input id="postcode" inputMode="numeric" value={value('postcode')} onChange={(e) => set('postcode', e.target.value)} />
              </FieldShell>
              <FieldShell label="Town" htmlFor="town" required>
                <Input id="town" value={value('town')} onChange={(e) => set('town', e.target.value)} />
              </FieldShell>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Household" description="Used to suggest a house size and to work out which financing is open to you." />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <FieldShell label="People in the household" htmlFor="household">
                <Input
                  id="household"
                  type="number"
                  min={1}
                  max={20}
                  value={value('household_size') ?? ''}
                  onChange={(e) => set('household_size', Number(e.target.value))}
                />
              </FieldShell>
              <FieldShell label="Monthly income (RM)" htmlFor="income">
                <Input
                  id="income"
                  type="number"
                  min={0}
                  step={100}
                  value={value('monthly_income') ?? ''}
                  onChange={(e) => set('monthly_income', Number(e.target.value))}
                />
              </FieldShell>
              <FieldShell label="Employer" htmlFor="employer">
                <Input id="employer" value={value('employer') ?? ''} onChange={(e) => set('employer', e.target.value)} />
              </FieldShell>
              <FieldShell label="Co-applicant" htmlFor="coapp" hint="The other person building this home with you.">
                <Input id="coapp" value={value('co_applicant_name') ?? ''} onChange={(e) => set('co_applicant_name', e.target.value)} />
              </FieldShell>
            </div>
          </Panel>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={busy} disabled={!dirty}>Save my details</Button>
            {saved && (
              <p className="flex items-center gap-2 text-sm font-semibold text-ok">
                <Icon name="check" size={16} /> Saved
              </p>
            )}
            {dirty && !saved && <p className="text-sm text-ink-2">You have unsaved changes.</p>}
          </div>
        </div>

        <div className="space-y-5">
          <Panel>
            <PanelHeader title="What you have agreed to" description="You can change any of these at any time." />
            <ul className="divide-y divide-line">
              {CONSENTS.map((consent) => {
                const state = profile.consents[consent.key];
                return (
                  <li key={consent.key} className="px-5 py-4 sm:px-6">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 rounded border-line-2 text-forest-700 focus:ring-forest-600/25"
                        checked={Boolean(state?.granted)}
                        onChange={(e) => void toggleConsent(consent.key, e.target.checked)}
                      />
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink">{consent.label}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-ink-2">{consent.detail}</span>
                        {state?.granted && state.at && (
                          <span className="mt-1 block text-[0.8125rem] text-ink-3">Agreed {shortDate(state.at)}</span>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line px-5 py-4 sm:px-6">
              <Assurance>
                Withdrawing the first two consents means we cannot keep processing your application, so your
                coordinator will call you before anything changes.
              </Assurance>
            </div>
          </Panel>

          {mode === 'demo' && (
            <Panel className="panel-pad">
              <p className="font-semibold text-ink">Demonstration data</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                Everything in this portal is invented for the demonstration. Resetting puts Amir and Hana's
                project back to how it started.
              </p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  resetDemoData();
                  window.location.assign('/app');
                }}
              >
                Reset the demonstration
              </Button>
            </Panel>
          )}
        </div>
      </form>
    </>
  );
}
