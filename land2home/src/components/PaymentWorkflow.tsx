import { PAYMENT_WORKFLOW, workflowIndex } from '@/lib/journey';
import { Icon } from '@/components/ui';
import { dateTime } from '@/lib/format';
import type { PaymentStage } from '@/lib/types';
import { cn } from '@/lib/cn';

/* The same five steps, in the same order, on every release and in every
   role's view: claim → verification → KPSM authorisation → payment
   recorded → member notified. */
export function PaymentWorkflow({ stage, compact = false }: { stage: PaymentStage; compact?: boolean }) {
  const reached = workflowIndex(stage.status);

  const stamp = (key: string) => {
    switch (key) {
      /* Each key is a workflow step; the stamp is when that step finished. */
      case 'claim_submitted': return stage.claim_submitted_at;
      case 'technical_verification': return stage.verified_at;
      case 'awaiting_authorisation': return stage.authorised_at;
      case 'authorised': return stage.paid_at;
      case 'paid': return stage.member_notified_at ?? stage.paid_at;
      default: return undefined;
    }
  };

  return (
    <ol className={cn('grid gap-x-3', compact ? 'grid-cols-5' : 'gap-y-4 sm:grid-cols-5')}>
      {PAYMENT_WORKFLOW.map((step, i) => {
        const done = i <= reached;
        const current = i === reached + 1 && reached >= 0;
        return (
          <li key={step.key} className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-2xs font-bold',
                  done ? 'bg-forest-800 text-forest-50' : current ? 'bg-gold-500 text-forest-950' : 'bg-forest-100 text-ink-3',
                )}
              >
                {done ? <Icon name="check" size={12} /> : i + 1}
              </span>
              {i < PAYMENT_WORKFLOW.length - 1 && (
                <span aria-hidden className={cn('hidden h-px flex-1 sm:block', done ? 'bg-forest-600/40' : 'bg-line-2')} />
              )}
            </div>
            {!compact && (
              <>
                <p className={cn('mt-2 text-[0.8125rem] font-semibold leading-snug', done || current ? 'text-ink' : 'text-ink-3')}>
                  {step.label}
                </p>
                <p className="mt-0.5 text-2xs uppercase tracking-wide text-ink-3">{step.by}</p>
                {done && stamp(step.key) && (
                  <p className="mt-1 text-[0.75rem] text-ink-2">{dateTime(stamp(step.key))}</p>
                )}
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
