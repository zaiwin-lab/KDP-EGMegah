import { usePortal } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, ButtonLink, Icon, Panel, PanelHeader } from '@/components/ui';
import { JourneyRail } from '@/components/journey/JourneyRail';
import { houseType } from '@/lib/houseTypes';
import { myr, shortDate, sqft } from '@/lib/format';

/* The whole journey on one page: the six stages, and the facts behind the
   two that are already settled (land, home) so a member can check them. */
export default function Journey() {
  const { journey, profile, land, application, project } = usePortal();
  const chosen = houseType(application?.house_type);

  return (
    <>
      <PageHead
        title="My journey"
        lead="Six stages from your land to your keys. You are never on more than one at a time."
      />

      <Panel className="panel-pad">
        <div className="hidden lg:block">
          <JourneyRail stages={journey} />
        </div>
        <div className="lg:hidden">
          <JourneyRail stages={journey} orientation="vertical" />
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="My Land"
            description="Checked by a KOBIS officer against the land office record, not by software."
            action={
              land?.verification_status === 'verified' ? (
                <Badge tone="ok"><Icon name="check" size={13} /> Verified</Badge>
              ) : (
                <Badge tone="warn">Being checked</Badge>
              )
            }
          />
          <dl className="divide-y divide-line">
            <Row label="Member" value={profile?.full_name} sub={`KPSM ${profile?.membership_no}`} />
            <Row label="Land title" value={land?.title_no} sub={land ? `${land.lot_no}, ${land.district}, ${land.state}` : undefined} />
            <Row label="Land area" value={land ? sqft(land.area_sq_ft) : undefined} />
            <Row
              label="Ownership"
              value={land?.ownership === 'joint' ? 'Held jointly' : land?.ownership === 'sole' ? 'In your name alone' : 'Family held'}
              sub={land?.tenure === 'native_title' ? 'Native title' : land?.tenure}
            />
            <Row
              label="Services at the site"
              value={[land?.road_access && 'Road access', land?.power_nearby && 'Power nearby', land?.water_nearby && 'Water nearby']
                .filter(Boolean)
                .join(' · ')}
            />
          </dl>
          {land?.verification_note && (
            <div className="border-t border-line px-5 py-4">
              <Assurance icon="person">
                {land.verification_note} Confirmed by {land.verified_by} on {shortDate(land.verified_at)}.
              </Assurance>
            </div>
          )}
        </Panel>

        <Panel>
          <PanelHeader
            title="My Home"
            description="You chose this, and it can still change until the contract is signed."
            action={<Badge tone="ok"><Icon name="check" size={13} /> Chosen</Badge>}
          />
          {chosen ? (
            <>
              <div className="px-5 py-5 sm:px-6">
                <p className="font-display text-2xl text-ink">{chosen.name}</p>
                <p className="mt-1.5 leading-relaxed text-ink-2">{chosen.tagline}</p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-2">
                  {chosen.highlights.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <Icon name="check" size={16} className="mt-0.5 text-forest-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <dl className="divide-y divide-line border-t border-line">
                <Row label="Built-up area" value={project ? sqft(project.built_up_sq_ft) : sqft(chosen.built_up_sq_ft)} />
                <Row label="Bedrooms and bathrooms" value={`${chosen.bedrooms} bedrooms, ${chosen.bathrooms} bathrooms`} />
                <Row
                  label="Contract sum"
                  value={project ? myr(project.contract_sum) : 'Set after the site visit'}
                  sub={project?.contract_signed_at ? `Fixed when the contract was signed on ${shortDate(project.contract_signed_at)}` : undefined}
                />
              </dl>
            </>
          ) : (
            <div className="px-5 py-8">
              <p className="text-ink-2">You have not chosen a house yet.</p>
              <ButtonLink to="/app/apply" className="mt-4">Choose my home</ButtonLink>
            </div>
          )}
        </Panel>
      </div>

      <Panel className="mt-5 panel-pad">
        <Assurance>
          Membership, land, contracts, technical milestones and payments are all confirmed by a named
          person. The portal can read your documents and draft plain-language updates, but it never
          verifies, approves or signs anything on its own.
        </Assurance>
      </Panel>
    </>
  );
}

function Row({ label, value, sub }: { label: string; value?: string | null; sub?: string | null }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-3.5 sm:px-6">
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="text-right">
        <span className="font-semibold text-ink">{value || '—'}</span>
        {sub && <span className="block text-[0.8125rem] text-ink-2">{sub}</span>}
      </dd>
    </div>
  );
}
