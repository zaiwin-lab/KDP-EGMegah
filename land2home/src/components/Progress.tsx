import { cn } from '@/lib/cn';

/* Progress is shown as a filled bar with the number beside it, never as a
   ring or a lone statistic. The label always says what the number means. */
export function ProgressBar({
  value,
  label,
  tone = 'forest',
  size = 'md',
}: {
  value: number;
  label?: string;
  tone?: 'forest' | 'gold';
  size?: 'sm' | 'md';
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      {label && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-ink">{label}</span>
          <span className="tnum text-sm font-bold text-ink">{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={cn('w-full overflow-hidden rounded-full bg-forest-100', size === 'sm' ? 'h-1.5' : 'h-2.5')}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500 ease-out4',
            tone === 'forest' ? 'bg-forest-700' : 'bg-gold-600',
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
