import { usePortal } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Badge, EmptyState, Icon, Panel, PanelHeader } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { SitePhoto } from '@/components/art/SitePhoto';
import { shortDate } from '@/lib/format';
import type { Milestone, ProgressUpdate } from '@/lib/types';

/* Everything here is in the member's language. The technical site report
   EGMH filed is never shown; the plain wording is, after a KOBIS officer
   has read and approved it. */
export default function BuildProgress() {
  const { project, updates, milestones } = usePortal();

  if (!project) {
    return (
      <>
        <PageHead title="Build progress" />
        <Panel>
          <EmptyState title="Construction has not started">
            Once your contract is signed and EGMH is on site, every visit is recorded here with
            photographs and a plain description of what was done.
          </EmptyState>
        </Panel>
      </>
    );
  }

  const scheduleTone = project.schedule_status === 'on_schedule' ? 'ok' : project.schedule_status === 'slight_delay' ? 'warn' : 'alert';
  const scheduleLabel =
    project.schedule_status === 'on_schedule' ? 'On schedule' : project.schedule_status === 'slight_delay' ? 'Slightly behind' : 'Delayed';

  return (
    <>
      <PageHead
        title="Build progress"
        lead={`${project.house_name} at ${project.site_label}. Site supervisor: ${project.site_supervisor}.`}
        badge={{ tone: scheduleTone, text: scheduleLabel }}
      />

      <Panel className="panel-pad">
        <ProgressBar value={project.overall_progress} label={`Current stage: ${project.construction_phase}`} />
        <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-5">
          <div>
            <dt className="text-sm text-ink-2">Work started</dt>
            <dd className="mt-0.5 font-semibold text-ink">{shortDate(project.started_at)}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-2">Expected handover</dt>
            <dd className="mt-0.5 font-semibold text-ink">{shortDate(project.target_handover)}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-2">Updates so far</dt>
            <dd className="mt-0.5 font-semibold text-ink">{updates.length}</dd>
          </div>
        </dl>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-3 font-display text-xl text-ink">Site updates</h2>
          {updates.length === 0 ? (
            <Panel>
              <EmptyState title="No updates yet">
                EGMH files an update after each site visit. You will be told as soon as the first one is here.
              </EmptyState>
            </Panel>
          ) : (
            <ol className="space-y-5">
              {updates.map((update, i) => (
                <UpdateEntry key={update.id} update={update} latest={i === 0} />
              ))}
            </ol>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl text-ink">Milestones</h2>
          <Panel>
            <PanelHeader title="What has to happen, and when" description="Dates shift with weather and deliveries. We tell you when one moves." />
            <ol className="divide-y divide-line">
              {milestones.map((m) => (
                <MilestoneRow key={m.id} milestone={m} />
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </>
  );
}

function UpdateEntry({ update, latest }: { update: ProgressUpdate; latest: boolean }) {
  return (
    <li>
      <Panel className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5">
          <p className="font-semibold text-ink">{shortDate(update.reported_on)}</p>
          {latest && <Badge tone="gold">Most recent</Badge>}
        </div>

        {update.photos.length > 0 && (
          <div className={update.photos.length > 1 ? 'grid grid-cols-2 gap-px bg-line' : ''}>
            {update.photos.map((photo) => (
              <figure key={photo.id} className="bg-forest-100">
                <div className="aspect-[16/10]">
                  <SitePhoto plate={photo.swatch} />
                </div>
                <figcaption className="bg-surface px-4 py-2.5 text-[0.8125rem] text-ink-2">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="px-5 py-5 sm:px-6">
          <p className="max-w-prose leading-relaxed text-ink">{update.member_summary}</p>

          {update.delay_reason && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-warn-bg p-4">
              <Icon name="info" className="mt-0.5 text-warn" />
              <p className="text-sm leading-relaxed text-ink">{update.delay_reason}</p>
            </div>
          )}

          <div className="mt-4 flex items-start gap-2.5 border-t border-line pt-4">
            <Icon name="clock" size={17} className="mt-0.5 text-forest-600" />
            <p className="text-sm text-ink-2">
              Next: <span className="font-semibold text-ink">{update.next_activity}</span>, expected around{' '}
              {shortDate(update.expected_next_date)}.
            </p>
          </div>

          {update.verified_by && (
            <p className="mt-3 text-[0.8125rem] text-ink-3">
              Reported by {update.submitted_by}, checked and published by {update.verified_by}.
            </p>
          )}
        </div>
      </Panel>
    </li>
  );
}

function MilestoneRow({ milestone }: { milestone: Milestone }) {
  const done = milestone.status === 'complete';
  const active = milestone.status === 'in_progress';
  return (
    <li className="flex items-start gap-3 px-5 py-3.5">
      <span
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-2xs font-bold ${
          done ? 'bg-forest-800 text-forest-50' : active ? 'bg-gold-500 text-forest-950' : 'bg-forest-100 text-ink-3'
        }`}
      >
        {done ? <Icon name="check" size={13} /> : milestone.sequence}
      </span>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${done || active ? 'text-ink' : 'text-ink-3'}`}>{milestone.member_title}</p>
        <p className="mt-0.5 text-[0.8125rem] text-ink-2">
          {done && milestone.actual_date
            ? `Done ${shortDate(milestone.actual_date)}`
            : active
              ? `Happening now, expected ${shortDate(milestone.expected_date)}`
              : `Expected ${shortDate(milestone.expected_date)}`}
        </p>
      </div>
    </li>
  );
}
