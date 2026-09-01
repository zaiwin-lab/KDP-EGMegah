import { Link } from 'react-router-dom';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Badge, Button, ButtonLink, EmptyState, Icon, Panel } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { SitePhoto } from '@/components/art/SitePhoto';
import { PAYMENT_STATUS_LABEL, nextMilestone } from '@/lib/journey';
import { dayMonth, myr, relative, shortDate } from '@/lib/format';
import type { MemberAction } from '@/lib/types';

/* The dashboard answers five questions and stops:
   where is my house, what is done, what happens next, is anything needed
   from me, and where is my money. Anything else lives on its own page. */
export default function Dashboard() {
  const { profile, project, updates, payments, actions, notifications, milestones, refresh } = usePortal();
  const repo = useRepo();

  if (!project || !profile) {
    return (
      <>
        <PageHead title="Your journey has not started yet" />
        <Panel>
          <EmptyState
            title="Nothing to show here yet"
            action={<ButtonLink to="/app/apply">Start my application</ButtonLink>}
          >
            Once your membership and land are confirmed and you have chosen a home, this page becomes the
            one place that tells you how your build is going.
          </EmptyState>
        </Panel>
      </>
    );
  }

  const latest = updates[0];
  const next = nextMilestone(milestones);
  const activePayment = payments.find((p) => p.status !== 'paid' && p.status !== 'not_due');
  const paidTotal = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const firstName = profile.full_name.split(' ')[0];
  const unread = notifications.filter((n) => !n.read);

  const scheduleTone = project.schedule_status === 'on_schedule' ? 'ok' : project.schedule_status === 'slight_delay' ? 'warn' : 'alert';
  const scheduleLabel =
    project.schedule_status === 'on_schedule' ? 'On schedule' : project.schedule_status === 'slight_delay' ? 'Slightly behind' : 'Delayed';

  return (
    <>
      <div className="mb-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-2.5 py-1 font-semibold text-gold-700">
          <Icon name="key" size={13} />
          KPSM Bau member
        </span>
        <span className="tnum text-ink-2">{profile.membership_no}</span>
        {profile.membership_verified_at && (
          <span className="text-ink-3">· a member with us since {shortDate(profile.membership_verified_at)}</span>
        )}
      </div>

      <PageHead
        title={`Good to see you, ${firstName}`}
        lead={`${project.house_name} on ${project.site_label}, ${project.district}, ${project.state}.`}
        badge={{ tone: scheduleTone, text: scheduleLabel }}
      />

      {/* 4. Is any action required from me? Answered first, and honestly
             answered with "no" when there is nothing. */}
      <ActionPanel actions={actions} />

      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* 1 + 2 + 3: where is my house, what is done, what is next */}
        <Panel className="overflow-hidden">
          <div className="relative aspect-[16/9] w-full bg-forest-100">
            {latest ? (
              <SitePhoto plate={latest.photos[0]?.swatch ?? 'a'} />
            ) : (
              <div className="grid h-full place-items-center text-sm text-ink-2">No site photographs yet</div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/85 to-transparent p-5 pt-14">
              <p className="text-[0.8125rem] font-semibold text-gold-200">
                {latest ? `Site photograph, ${shortDate(latest.reported_on)}` : 'Awaiting the first site visit'}
              </p>
              <p className="mt-1 text-forest-50">{latest?.photos[0]?.caption ?? project.construction_phase}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <ProgressBar value={project.overall_progress} label={`Current stage: ${project.construction_phase}`} />

            {latest && (
              <p className="mt-5 max-w-prose leading-relaxed text-ink">{latest.member_summary}</p>
            )}

            {next && (
              <div className="mt-5 flex items-start gap-3 rounded-xl bg-forest-50 p-4">
                <Icon name="clock" className="mt-0.5 text-forest-700" />
                <div>
                  <p className="font-semibold text-ink">Next: {next.member_title}</p>
                  <p className="mt-0.5 text-sm text-ink-2">
                    Expected around {shortDate(next.expected_date)}. Your handover date is still {shortDate(project.target_handover)}.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5">
              <ButtonLink to="/app/progress" variant="secondary" size="sm">
                See all updates and photographs
                <Icon name="chevron" size={16} />
              </ButtonLink>
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          {/* 5. What is the status of my payment? */}
          <Panel>
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-[0.95rem] font-bold text-ink">KPSM-managed staged payment</h2>
              <p className="mt-1 text-sm text-ink-2">
                {myr(paidTotal)} of {myr(project.contract_sum)} released so far.
              </p>
            </div>
            <div className="px-5 py-4">
              <ol className="space-y-3">
                {payments.map((stage) => {
                  const done = stage.status === 'paid';
                  const live = stage.status !== 'paid' && stage.status !== 'not_due';
                  return (
                    <li key={stage.id} className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-2xs font-bold ${
                          done ? 'bg-forest-800 text-forest-50' : live ? 'bg-gold-500 text-forest-950' : 'bg-forest-100 text-ink-3'
                        }`}
                      >
                        {done ? <Icon name="check" size={13} /> : stage.sequence}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${done || live ? 'text-ink' : 'text-ink-3'}`}>{stage.title}</p>
                        <p className="mt-0.5 text-[0.8125rem] text-ink-2">
                          {PAYMENT_STATUS_LABEL[stage.status]}
                          {done && stage.paid_at ? ` · ${shortDate(stage.paid_at)}` : ''}
                        </p>
                      </div>
                      <span className="tnum shrink-0 text-sm font-semibold text-ink-2">{myr(stage.amount, { compact: true })}</span>
                    </li>
                  );
                })}
              </ol>

              {activePayment && (
                <p className="mt-4 rounded-xl bg-forest-50 p-3.5 text-sm leading-relaxed text-ink-2">
                  Release {activePayment.sequence}: {PAYMENT_STATUS_LABEL[activePayment.status]}. Nothing is needed from you.
                </p>
              )}

              <div className="mt-4">
                <ButtonLink to="/app/payments" variant="secondary" size="sm">
                  See the payment journey
                  <Icon name="chevron" size={16} />
                </ButtonLink>
              </div>
            </div>
          </Panel>

          {/* Your named person, not a support queue */}
          <Panel className="p-5">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-ink-3">Your journey coordinator</p>
            <p className="mt-1 text-sm text-ink-2">Looking after your build personally, not a call queue.</p>
            <p className="mt-2 font-display text-xl text-ink">{project.coordinator_name}</p>
            <p className="text-sm text-ink-2">{project.coordinator_role}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`tel:${project.coordinator_phone.replace(/\s/g, '')}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-forest-800 px-4 text-sm font-semibold text-forest-50 transition-colors hover:bg-forest-700"
              >
                <Icon name="phone" size={17} />
                Call {project.coordinator_phone}
              </a>
              <a
                href={`mailto:${project.coordinator_email}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-line-2 px-4 text-sm font-semibold text-ink transition-colors hover:border-forest-600"
              >
                Email
              </a>
            </div>
          </Panel>

          {unread.length > 0 && (
            <Panel>
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <h2 className="text-[0.95rem] font-bold text-ink">New since you last looked</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 whitespace-nowrap"
                  onClick={async () => {
                    await repo.markAllNotificationsRead(profile.id);
                    await refresh();
                  }}
                >
                  Mark all read
                </Button>
              </div>
              <ul className="divide-y divide-line">
                {unread.slice(0, 4).map((note) => (
                  <li key={note.id}>
                    <Link to={note.link ?? '/app'} className="block px-5 py-3.5 transition-colors hover:bg-forest-50">
                      <p className="text-sm font-semibold text-ink">{note.title}</p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-2">{note.body}</p>
                      <p className="mt-1.5 text-2xs uppercase tracking-wide text-ink-3">{relative(note.created_at)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

function ActionPanel({ actions }: { actions: MemberAction[] }) {
  if (!actions.length) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-ok/25 bg-ok-bg px-5 py-4">
        <Icon name="check" className="text-ok" />
        <p className="font-semibold text-ok">Nothing is needed from you right now.</p>
      </div>
    );
  }

  return (
    <Panel className="border-gold-500/40 bg-gold-100/60">
      <div className="flex items-center gap-2.5 border-b border-gold-500/25 px-5 py-3.5">
        <Icon name="alert" className="text-gold-700" />
        <h2 className="text-[0.95rem] font-bold text-ink">
          {actions.length === 1 ? 'One thing needs you' : `${actions.length} things need you`}
        </h2>
      </div>
      <ul className="divide-y divide-gold-500/20">
        {actions.map((action) => (
          <li key={action.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                {action.title}
                {action.due && <Badge tone="gold">by {dayMonth(action.due)}</Badge>}
              </p>
              <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-2">{action.detail}</p>
            </div>
            <ButtonLink to={action.href} size="sm" className="shrink-0">
              {action.cta}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
