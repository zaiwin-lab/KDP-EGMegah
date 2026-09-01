import { cn } from '@/lib/cn';

/* The mark is a roofline drawn over a horizon: land, then house. */
export function Wordmark({ tone = 'dark', showTagline = false }: { tone?: 'dark' | 'light'; showTagline?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden className="shrink-0">
        <rect width="32" height="32" rx="8" className={tone === 'light' ? 'fill-forest-800' : 'fill-forest-900'} />
        <path d="M8 17.5 16 10l8 7.5" stroke="currentColor" className="text-gold-500" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 16.5V23h11v-6.5" stroke="currentColor" className={tone === 'light' ? 'text-forest-50' : 'text-forest-50'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-[1.0625rem] font-600 tracking-[-0.01em]', tone === 'light' ? 'text-forest-50' : 'text-ink')}>
          Land2Home
        </span>
        <span className={cn('mt-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]', tone === 'light' ? 'text-gold-200/85' : 'text-gold-700')}>
          Concierge
        </span>
      </span>
      {showTagline && (
        <span className="ml-2 hidden border-l border-line pl-3 font-display text-sm italic text-ink-2 lg:inline">
          From Land. To Vision. To Home.
        </span>
      )}
    </span>
  );
}
