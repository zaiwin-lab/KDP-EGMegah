import { Link } from 'react-router-dom';
import { usePortal } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Badge, Icon, Panel, PanelHeader } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { PAYMENT_STATUS_LABEL } from '@/lib/journey';
import { myr, relative, shortDate } from '@/lib/format';

export default function AdminOverview() {
  const { user, project, profile, payments, updates, documents, defects } = usePortal();

  const awaiting = payments.filter((p) => p.status === 'claim_submitted' || p.status === 'technical_verification');
  const forAuthorisation = payments.filter((p) => p.status === 'awaiting_authorisation');
  const unpublished = updates.filter((u) => !u.published);
  const pendingDocs = documents.filter((d) => d.status === 'pending_review');

  const isKpsm = user?.role === 'kpsm';

  return (
    <>
      <PageHead
        title={isKpsm ? 'KPSM governance' : 'Journey coordination'}
        lead={
          isKpsm
            ? 'Membership standing and payment authorisation. Every authorisation you give is recorded against your name.'
            : 'Where every member project has reached, and what is waiting on someone.'
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Queue
          label={isKpsm ? 'Waiting for your authorisation' : 'Waiting for verification'}
          count={isKpsm ? forAuthorisation.length : awaiting.length}
          to="/admin/payments"
          tone={(isKpsm ? forAuthorisation.length : awaiting.length) > 0 ? 'gold' : 'neutral'}
        />
        <Queue label="Updates to publish" count={unpublished.length} to="/admin/updates" tone={unpublished.length ? 'gold' : 'neutral'} />
        <Queue label="Documents to check" count={pendingDocs.length} to="/admin/documents" tone={pendingDocs.length ? 'gold' : 'neutral'} />
        <Queue label="Open rectification items" count={defects.filter((d) => d.status !== 'resolved').length} to="/admin" tone="neutral" />
      </div>

      <Panel className="mt-5">
        <PanelHeader title="Member projects" description="One row per live project." />
        {project && profile ? (
          <div className="px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-xl text-ink">{profile.full_name}</p>
                <p className="text-sm text-ink-2">
                  KPSM {profile.membership_no} · {project.reference} · {project.house_name}
                </p>
                <p className="mt-0.5 text-sm text-ink-2">
                  {project.site_label}, {project.district}, {project.state}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={project.schedule_status === 'on_schedule' ? 'ok' : 'warn'}>
                  {project.schedule_status === 'on_schedule' ? 'On schedule' : 'Behind'}
                </Badge>
                <Badge>Handover {shortDate(project.target_handover)}</Badge>
              </div>
            </div>

            <div className="mt-5 max-w-md">
              <ProgressBar value={project.overall_progress} label={project.construction_phase} />
            </div>

            <dl className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-4">
              <Fact label="Contract sum" value={myr(project.contract_sum)} />
              <Fact
                label="Released"
                value={myr(payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0))}
              />
              <Fact label="Coordinator" value={project.coordinator_name} />
              <Fact label="Site supervisor" value={project.site_supervisor} />
            </dl>
          </div>
        ) : (
          <p className="px-5 py-8 text-ink-2">No live projects.</p>
        )}
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Payment releases" description="The same four releases the member sees." />
          <ul className="divide-y divide-line">
            {payments.map((stage) => (
              <li key={stage.id} className="flex items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
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
          <div className="border-t border-line px-5 py-3.5 sm:px-6">
            <Link to="/admin/payments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800">
              Open the payment queue <Icon name="chevron" size={15} />
            </Link>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Latest site reports" />
          <ul className="divide-y divide-line">
            {updates.slice(0, 4).map((update) => (
              <li key={update.id} className="px-5 py-3.5 sm:px-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  {shortDate(update.reported_on)}
                  {!update.published && <Badge tone="gold">Not published</Badge>}
                </p>
                <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-2">{update.technical_summary}</p>
                <p className="mt-1 text-2xs uppercase tracking-wide text-ink-3">
                  {update.submitted_by} · {relative(update.reported_on)}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function Queue({ label, count, to, tone }: { label: string; count: number; to: string; tone: 'gold' | 'neutral' }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl border p-5 transition-colors ${
        tone === 'gold' ? 'border-gold-500/45 bg-gold-100/50 hover:border-gold-600' : 'border-line bg-surface hover:border-forest-600'
      }`}
    >
      <p className="tnum font-display text-3xl text-ink">{count}</p>
      <p className="mt-1 text-sm font-semibold text-ink-2">{label}</p>
    </Link>
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
