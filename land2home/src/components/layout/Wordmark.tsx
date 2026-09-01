import { cn } from '@/lib/cn';

/* The mark is a roofline over a horizon: land, then house. The platform is
   operated by EGMH and KOBIS together, so the lockup names both rather than
   presenting a single owner. */
export function Wordmark({
  tone = 'dark',
  showPartners = false,
}: {
  tone?: 'dark' | 'light';
  showPartners?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden className="shrink-0">
        <rect width="32" height="32" rx="8" className={tone === 'light' ? 'fill-forest-800' : 'fill-forest-900'} />
        <path
          d="M8 17.5 16 10l8 7.5"
          stroke="currentColor"
          className="text-gold-500"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 16.5V23h11v-6.5"
          stroke="currentColor"
          className="text-forest-50"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-[1.0625rem] tracking-[-0.01em]',
            tone === 'light' ? 'text-forest-50' : 'text-ink',
          )}
        >
          Land2Home
        </span>
        <span
          className={cn(
            'mt-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]',
            tone === 'light' ? 'text-gold-200/85' : 'text-gold-700',
          )}
        >
          {showPartners ? 'EGMH × KOBIS' : 'Concierge'}
        </span>
      </span>
    </span>
  );
}

/* Used wherever the three parties need to be named together. */
export function PartnerLockup({
  tone = 'light',
  className,
}: {
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const base = tone === 'light' ? 'text-forest-50' : 'text-ink';
  const dim = tone === 'light' ? 'text-forest-50/40' : 'text-ink-3';
  return (
    <span className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg', base, className)}>
      <span>EGMH</span>
      <span className={dim} aria-hidden>×</span>
      <span>KOBIS</span>
      <span className={dim} aria-hidden>×</span>
      <span>KPSM</span>
    </span>
  );
}
