import { Link } from 'react-router-dom';
import type { JourneyStage, StageKey } from '@/lib/types';
import { STAGE_META } from '@/lib/journey';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

const STAGE_ICON: Record<StageKey, string> = {
  land: 'land', home: 'home', plan: 'plan', build: 'build', inspection: 'search', keys: 'key',
};

/* The six stages as one continuous path rather than six separate chips.
   Horizontal on desktop, vertical on a phone, same component either way. */
export function JourneyRail({ stages, orientation = 'horizontal' }: { stages: JourneyStage[]; orientation?: 'horizontal' | 'vertical' }) {
  if (orientation === 'vertical') {
    return (
      <ol className="relative">
        {stages.map((stage, i) => (
          <li key={stage.key} className="relative flex gap-4 pb-6 last:pb-0">
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  'absolute left-[1.125rem] top-9 h-[calc(100%-1.75rem)] w-px',
                  stage.status === 'complete' ? 'bg-forest-600/45' : 'bg-line-2',
                )}
              />
            )}
            <Marker stage={stage} />
            <div className="min-w-0 pt-1">
              <p className={cn('text-sm font-bold', stage.status === 'locked' ? 'text-ink-3' : 'text-ink')}>
                {stage.title}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{stage.member_summary}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="grid gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
      {stages.map((stage) => (
        <li key={stage.key} className="min-w-0">
          <div className="flex items-center gap-3">
            <Marker stage={stage} />
            <span aria-hidden className={cn('hidden h-px flex-1 lg:block', stage.status === 'complete' ? 'bg-forest-600/40' : 'bg-line-2')} />
          </div>
          <p className={cn('mt-3 text-sm font-bold', stage.status === 'locked' ? 'text-ink-3' : 'text-ink')}>{stage.title}</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-2">{STAGE_META[stage.key].blurb}</p>
        </li>
      ))}
    </ol>
  );
}

function Marker({ stage }: { stage: JourneyStage }) {
  const complete = stage.status === 'complete';
  const active = stage.status === 'active';
  return (
    <span
      className={cn(
        'relative z-[1] grid h-9 w-9 shrink-0 place-items-center rounded-full border',
        complete && 'border-forest-700 bg-forest-800 text-forest-50',
        active && 'border-gold-600 bg-gold-100 text-gold-700 ring-4 ring-gold-500/15',
        !complete && !active && 'border-line-2 bg-surface text-ink-3',
      )}
    >
      <Icon name={complete ? 'check' : STAGE_ICON[stage.key]} size={complete ? 16 : 18} />
      <span className="sr-only">
        {complete ? 'Completed' : active ? 'Current stage' : 'Not started yet'}
      </span>
    </span>
  );
}

export function StageLink({ stage }: { stage: JourneyStage }) {
  return (
    <Link to="/app/journey" className="text-sm font-semibold text-forest-800 underline decoration-forest-600/30 underline-offset-4 hover:decoration-forest-600">
      {stage.title}
    </Link>
  );
}
