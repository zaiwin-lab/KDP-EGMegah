import { useEffect, useRef, useState } from 'react';
import { LANGUAGES, useI18n, type Lang } from '@/i18n';
import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

/* Four-language panel. Opens downward from the nav; closes on outside
   click, on Escape, and after a choice. */
export function LanguageSwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-semibold transition-colors',
          tone === 'light'
            ? 'text-forest-50/80 hover:bg-forest-800 hover:text-forest-50'
            : 'text-ink-2 hover:bg-forest-50 hover:text-ink',
        )}
      >
        <span aria-hidden className="text-base leading-none">{current.flag}</span>
        <span className="tnum">{current.short}</span>
        <Icon name="chevron" size={13} className={cn('rotate-90 transition-transform', open && '-rotate-90')} />
        <span className="sr-only">Change language</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute right-0 top-11 z-dropdown w-56 overflow-hidden rounded-xl border border-line bg-raised shadow-high animate-fade-up"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(l.code as Lang);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    active ? 'bg-forest-100 text-forest-800' : 'text-ink hover:bg-forest-50',
                  )}
                >
                  <span aria-hidden className="text-lg leading-none">{l.flag}</span>
                  <span className="flex-1 text-sm font-semibold">{l.name}</span>
                  <span className="tnum text-2xs text-ink-3">{l.short}</span>
                  {active && <Icon name="check" size={15} className="text-forest-700" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
