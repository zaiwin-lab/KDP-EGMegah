import { useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, Button, FieldShell, Icon, Input, Panel } from '@/components/ui';
import { PaymentWorkflow } from '@/components/PaymentWorkflow';
import { PAYMENT_STATUS_LABEL } from '@/lib/journey';
import { myr, shortDate } from '@/lib/format';
import type { PaymentStage } from '@/lib/types';

/* Each role sees the same four releases and can only take the one action
   that belongs to it. The database enforces the same rule independently
   (see supabase/schema.sql), so this UI is a convenience, not the control. */
export default function AdminPayments() {
  const { user, payments, project } = usePortal();
  const isKpsm = user?.role === 'kpsm';

  return (
    <>
      <PageHead
        title="Payment releases"
        lead={
          isKpsm
            ? 'You are the only role that can authorise a release. Check the verification before you do.'
            : 'Check each claim against the site record, then pass it to KPSM for authorisation.'
        }
      />

      <Panel className="mb-5 panel-pad">
        <Assurance icon="lock">
          Authorisation is a human act. The portal will not authorise, certify or release a payment on its
          own under any circumstances, and every action below is written to the audit record against your
          name and the time you took it.
        </Assurance>
      </Panel>

      {project && (
        <p className="mb-4 text-sm text-ink-2">
          {project.reference} · contract sum {myr(project.contract_sum)}
        </p>
      )}

      <ol className="space-y-5">
        {payments.map((stage) => (
          <li key={stage.id}>
            <StageCard stage={stage} />
          </li>
        ))}
      </ol>
    </>
  );
}

function StageCard({ stage }: { stage: PaymentStage }) {
  const { user, actor, refresh } = usePortal();
  const repo = useRepo();
  const [busy, setBusy] = useState<string | null>(null);
  const [reference, setReference] = useState('');
  const [error, setError] = useState<string | null>(null);

  const role = user?.role;
  const canVerify = role === 'kobis' && stage.status === 'claim_submitted';
  const canAuthorise = role === 'kpsm' && stage.status === 'awaiting_authorisation';
  const canRecord = role === 'kpsm' && stage.status === 'authorised';

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That did not go through. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2.5">
            <span className="tnum grid h-7 w-7 place-items-center rounded-full bg-forest-100 text-sm font-bold text-forest-800">
              {stage.sequence}
            </span>
            <span className="font-display text-xl text-ink">{stage.title}</span>
            {stage.claim_reference && <Badge>{stage.claim_reference}</Badge>}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="tnum font-display text-xl text-ink">{myr(stage.amount)}</p>
          <Badge tone={stage.status === 'paid' ? 'ok' : stage.status === 'not_due' ? 'neutral' : 'gold'} className="mt-1.5">
            {PAYMENT_STATUS_LABEL[stage.status]}
          </Badge>
        </div>
      </div>

      {stage.status !== 'not_due' && (
        <div className="border-b border-line px-5 py-5 sm:px-6">
          <PaymentWorkflow stage={stage} />
        </div>
      )}

      <div className="px-5 py-5 sm:px-6">
        {stage.evidence_note && (
          <div className="mb-4 rounded-xl bg-forest-50 p-4">
            <p className="text-sm font-semibold text-ink">Evidence submitted by EGMH</p>
            <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{stage.evidence_note}</p>
          </div>
        )}

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {stage.verified_by && <Line label="Verified by" value={`${stage.verified_by}, ${shortDate(stage.verified_at)}`} />}
          {stage.authorised_by && <Line label="Authorised by" value={`${stage.authorised_by}, ${shortDate(stage.authorised_at)}`} />}
          {stage.paid_at && <Line label="Paid" value={`${shortDate(stage.paid_at)} · ${stage.payment_reference}`} />}
        </dl>

        {error && <p className="mt-4 text-sm font-semibold text-alert">{error}</p>}

        <div className="mt-5 flex flex-wrap items-end gap-3">
          {canVerify && (
            <Button loading={busy === 'verify'} onClick={() => run('verify', () => repo.recordVerification(stage.id, actor))}>
              <Icon name="check" size={17} />
              Record technical verification
            </Button>
          )}

          {canAuthorise && (
            <Button loading={busy === 'auth'} onClick={() => run('auth', () => repo.authorisePayment(stage.id, actor))}>
              <Icon name="lock" size={17} />
              Authorise release {stage.sequence}
            </Button>
          )}

          {canRecord && (
            <>
              <FieldShell label="Payment reference" htmlFor={`ref-${stage.id}`} required>
                <Input
                  id={`ref-${stage.id}`}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="KPSM/TT/26/00000"
                  className="sm:w-64"
                />
              </FieldShell>
              <Button
                loading={busy === 'pay'}
                disabled={!reference.trim()}
                onClick={() => run('pay', () => repo.recordPayment(stage.id, reference.trim(), actor))}
              >
                Record the payment
              </Button>
            </>
          )}

          {!canVerify && !canAuthorise && !canRecord && (
            <p className="text-sm text-ink-2">
              {stage.status === 'paid'
                ? 'This release is complete.'
                : stage.status === 'not_due'
                  ? 'Nothing to do until EGMH claims this release.'
                  : `Waiting on ${stage.status === 'awaiting_authorisation' ? 'KPSM' : 'KOBIS'}.`}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-2">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
