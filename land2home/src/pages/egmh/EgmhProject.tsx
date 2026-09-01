import { Link } from 'react-router-dom';
import { usePortal } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Badge, Icon, Panel, PanelHeader } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { PAYMENT_STATUS_LABEL, nextMilestone } from '@/lib/journey';
import { myr, shortDate, sqft } from '@/lib/format';

export default function EgmhProject() {
  const { project, profile, milestones, payments, updates, defects } = usePortal();
  if (!project || !profile) return null;

  const next = nextMilestone(milestones);
  const openDefects = defects.filter((d) => d.status !== 'resolved');
  const claimable = payments.find((p) => p.status === 'not_due');

  return (
    <>
      <PageHead
        title={project.reference}
        lead={`${project.house_name} · ${sqft(project.built_up_sq_ft)} · ${project.site_label}, ${project.district}`}
        badge={{ tone: project.schedule_status === 'on_schedule' ? 'ok' : 'warn', text: project.schedule_status === 'on_schedule' ? 'On schedule' : 'Behind' }}
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Panel className="panel-pad">
            <ProgressBar value={project.overall_progress} label={project.construction_phase} />
            <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
              <Fact label="Started" value={shortDate(project.started_at)} />
              <Fact label="Contract handover" value={shortDate(project.target_handover)} />
              <Fact label="Contract sum" value={myr(project.contract_sum)} />
            </dl>
          </Panel>

          <Panel>
            <PanelHeader title="Milestones" description="Weighting drives the overall percentage the member sees." />
            <ol className="divide-y divide-line">
              {milestones.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-3 px-5 py-3.5 sm:px-6">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      <span className="tnum">{m.sequence}.</span> {m.title}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-2">Member sees: “{m.member_title}”</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge tone={m.status === 'complete' ? 'ok' : m.status === 'in_progress' ? 'gold' : 'neutral'}>
                      {m.status === 'complete' ? 'Complete' : m.status === 'in_progress' ? 'In progress' : 'Not started'}
                    </Badge>
                    <p className="tnum mt-1 text-[0.8125rem] text-ink-2">
                      {m.actual_date ? shortDate(m.actual_date) : shortDate(m.expected_date)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel className="panel-pad">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-ink-3">Next due</p>
            <p className="mt-2 font-display text-xl text-ink">{next?.title ?? 'Nothing outstanding'}</p>
            {next && <p className="mt-1 text-sm text-ink-2">Expected {shortDate(next.expected_date)}</p>}
            <Link
              to="/egmh/update"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-forest-800 px-5 text-[0.9375rem] font-semibold text-forest-50 hover:bg-forest-700"
            >
              <Icon name="photo" size={17} />
              File a site update
            </Link>
          </Panel>

          <Panel>
            <PanelHeader title="Payment releases" />
            <ul className="divide-y divide-line">
              {payments.map((stage) => (
                <li key={stage.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">
                      <span className="tnum">{stage.sequence}.</span> {stage.title}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-2">{PAYMENT_STATUS_LABEL[stage.status]}</p>
                  </div>
                  <span className="tnum shrink-0 text-sm font-semibold text-ink-2">{myr(stage.amount, { compact: true })}</span>
                </li>
              ))}
            </ul>
            {claimable && (
              <div className="border-t border-line px-5 py-3.5">
                <Link to="/egmh/claim" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800">
                  Submit a claim <Icon name="chevron" size={15} />
                </Link>
              </div>
            )}
          </Panel>

          <Panel className="panel-pad">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-ink-3">Outstanding</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between gap-3">
                <span className="text-ink-2">Rectification items open</span>
                <span className="tnum font-semibold text-ink">{openDefects.length}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink-2">Updates filed</span>
                <span className="tnum font-semibold text-ink">{updates.length}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-ink-2">Awaiting publication</span>
                <span className="tnum font-semibold text-ink">{updates.filter((u) => !u.published).length}</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
    </div>
  );
}
