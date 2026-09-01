import { usePortal } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, EmptyState, Icon, Panel } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { PaymentWorkflow } from '@/components/PaymentWorkflow';
import { PAYMENT_STATUS_LABEL } from '@/lib/journey';
import { myr, shortDate } from '@/lib/format';
import type { PaymentStage } from '@/lib/types';

export default function Payments() {
  const { project, payments } = usePortal();

  if (!project) {
    return (
      <>
        <PageHead title="Payment journey" />
        <Panel>
          <EmptyState title="No payment schedule yet">
            Your four payment releases are set out when the building contract is signed.
          </EmptyState>
        </Panel>
      </>
    );
  }

  const paid = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const released = Math.round((paid / project.contract_sum) * 100);

  return (
    <>
      <PageHead
        title="Payment journey"
        lead="KPSM-managed staged payment. Money is released to EGMH in four stages, and only after a named KPSM officer authorises it."
      />

      <Panel className="panel-pad">
        <ProgressBar value={released} label={`${myr(paid)} released of ${myr(project.contract_sum)} contract sum`} tone="gold" />
        <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
          <Figure label="Contract sum" value={myr(project.contract_sum)} note="Fixed when you signed" />
          <Figure label="Released so far" value={myr(paid)} note={`${payments.filter((p) => p.status === 'paid').length} of 4 releases`} />
          <Figure label="Still to come" value={myr(project.contract_sum - paid)} note="Held until each stage is done and checked" />
        </div>
      </Panel>

      <Panel className="mt-5 panel-pad">
        <Assurance>
          Every release follows the same route: EGMH submits a claim with evidence, the evidence is checked
          against the site record, a KPSM officer authorises it, the payment is recorded, and you are told.
          No payment can be approved automatically, and each authorisation is signed by a named officer and
          kept in the audit record.
        </Assurance>
      </Panel>

      <ol className="mt-5 space-y-5">
        {payments.map((stage) => (
          <li key={stage.id}>
            <ReleaseCard stage={stage} />
          </li>
        ))}
      </ol>
    </>
  );
}

function Figure({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div>
      <p className="text-sm text-ink-2">{label}</p>
      <p className="tnum mt-1 font-display text-2xl text-ink">{value}</p>
      <p className="mt-0.5 text-[0.8125rem] text-ink-3">{note}</p>
    </div>
  );
}

function ReleaseCard({ stage }: { stage: PaymentStage }) {
  const tone =
    stage.status === 'paid' ? 'ok' : stage.status === 'not_due' ? 'neutral' : 'gold';

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2.5">
            <span className="tnum grid h-7 w-7 place-items-center rounded-full bg-forest-100 text-sm font-bold text-forest-800">
              {stage.sequence}
            </span>
            <span className="font-display text-xl text-ink">{stage.title}</span>
          </p>
          <p className="mt-2 max-w-prose leading-relaxed text-ink-2">{stage.member_description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tnum font-display text-xl text-ink">{myr(stage.amount)}</p>
          <p className="tnum text-[0.8125rem] text-ink-2">{stage.percentage}% of the contract</p>
          <Badge tone={tone} className="mt-2">{PAYMENT_STATUS_LABEL[stage.status]}</Badge>
        </div>
      </div>

      {stage.status === 'not_due' ? (
        <p className="px-5 py-5 text-sm leading-relaxed text-ink-2 sm:px-6">
          This release has not been claimed yet. It becomes due when the work it covers is finished and checked.
        </p>
      ) : (
        <div className="px-5 py-5 sm:px-6">
          <PaymentWorkflow stage={stage} />

          {stage.evidence_note && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-forest-50 p-4">
              <Icon name="doc" size={17} className="mt-0.5 text-forest-700" />
              <div>
                <p className="text-sm font-semibold text-ink">Evidence EGMH provided</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{stage.evidence_note}</p>
              </div>
            </div>
          )}

          {stage.status === 'paid' && (
            <p className="mt-4 border-t border-line pt-4 text-sm text-ink-2">
              Authorised by {stage.authorised_by}. Paid on {shortDate(stage.paid_at)}, reference{' '}
              <span className="tnum font-semibold text-ink">{stage.payment_reference}</span>.
            </p>
          )}

          {stage.status === 'awaiting_authorisation' && (
            <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-2">
              The evidence has been checked by {stage.verified_by}. A KPSM officer is reviewing it for
              authorisation. Nothing is needed from you.
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}
