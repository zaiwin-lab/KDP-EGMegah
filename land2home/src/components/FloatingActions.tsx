import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/cn';

/* WhatsApp number for the programme desk. Displayed in Malaysian local
   format, dialled in international format. */
const WA_LOCAL = '011-2846 5813';
const WA_INTL = '601128465813';
const WA_MESSAGE = 'Hi! I am a KPSM Bau member and I would like to ask about Land2Home. #Land2Home';

/* Common questions, answered in the same plain language the portal uses.
   This is deliberately a small helper, not a chatbot: it answers what can
   be answered without knowing anything about a specific project, and hands
   anything personal to a human. */
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Who actually builds my house?',
    a: 'EG Megah Holdings (EGMH) designs and builds it. KOBIS Berhad runs this platform and coordinates your journey. KPSM Bau verifies your membership and authorises each payment release.',
  },
  {
    q: 'Do I have to pay anything to look around?',
    a: 'No. Nothing on this platform is a commitment. The real price of your house is fixed only after EGMH visits your land and gives you a written quotation.',
  },
  {
    q: 'How is my money protected?',
    a: 'KPSM holds the funds and releases them in four stages. EGMH is only paid for work that has been completed and checked, and every release is authorised by a named KPSM officer, never automatically.',
  },
  {
    q: 'Why does it ask for my identity card and land title?',
    a: 'Your membership, identity and land have to be confirmed by a person before building can start. You upload each document once, and we never ask for it again while it is still valid.',
  },
  {
    q: 'Does a computer decide anything about my application?',
    a: 'No. The platform can read your documents and suggest values for you to confirm, and it can put site reports into plain language. Every decision that affects you is made by a named person.',
  },
  {
    q: 'What if something is wrong with my house at the end?',
    a: 'You walk through the house with KOBIS and EGMH before you accept it. Anything you raise stays open until EGMH puts it right and you confirm you are happy with it.',
  },
];

export function FloatingActions() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* ── Left: AI help ─────────────────────────────────────────── */}
      <div className="fixed bottom-4 left-4 z-toast sm:bottom-6 sm:left-6">
        {open && (
          <div
            ref={panel}
            role="dialog"
            aria-label={t('help.title')}
            className="mb-3 flex max-h-[70vh] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-raised shadow-high animate-fade-up"
          >
            <div className="flex items-start justify-between gap-3 border-b border-line bg-forest-900 px-5 py-4 text-forest-50">
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  <Icon name="sparkle" size={17} className="text-gold-500" />
                  {t('help.title')}
                </p>
                <p className="mt-0.5 text-[0.8125rem] text-forest-50/70">{t('help.sub')}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-forest-50/80 transition-colors hover:bg-forest-800"
              >
                <Icon name="close" size={16} />
                <span className="sr-only">{t('help.close')}</span>
              </button>
            </div>

            <p className="border-b border-line px-5 py-3 text-[0.8125rem] leading-relaxed text-ink-2">
              {t('help.intro')}
            </p>

            <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
              {FAQ.map((item, i) => {
                const isOpen = expanded === i;
                return (
                  <li key={item.q}>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start gap-2.5 px-5 py-3 text-left transition-colors hover:bg-forest-50"
                    >
                      <Icon
                        name="chevron"
                        size={14}
                        className={cn('mt-1 shrink-0 text-ink-3 transition-transform', isOpen && 'rotate-90')}
                      />
                      <span className="text-sm font-semibold text-ink">{item.q}</span>
                    </button>
                    {isOpen && (
                      <p className="px-5 pb-4 pl-[2.9rem] text-sm leading-relaxed text-ink-2">{item.a}</p>
                    )}
                  </li>
                );
              })}
            </ul>

            <a
              href={`https://wa.me/${WA_INTL}?text=${encodeURIComponent(WA_MESSAGE)}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-center gap-2 border-t border-line bg-forest-50 px-5 py-3.5 text-sm font-semibold text-forest-800 transition-colors hover:bg-forest-100"
            >
              <Icon name="phone" size={16} />
              {t('help.talk')}
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t('help.title')}
          className="flex h-12 w-12 items-center justify-center gap-2.5 rounded-full bg-forest-900 text-forest-50 shadow-high transition-[background-color,transform] duration-150 ease-out4 hover:bg-forest-800 active:translate-y-px sm:w-auto sm:justify-start sm:pl-3.5 sm:pr-4"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500 text-onyx">
            <Icon name={open ? 'close' : 'sparkle'} size={16} />
          </span>
          <span className="hidden text-sm font-semibold sm:inline">{t('help.title')}</span>
        </button>
      </div>

      {/* ── Right: WhatsApp ───────────────────────────────────────── */}
      <a
        href={`https://wa.me/${WA_INTL}?text=${encodeURIComponent(WA_MESSAGE)}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${t('wa.title')} ${WA_LOCAL} — ${t('wa.sub')}`}
        className="group fixed bottom-4 right-4 z-toast flex h-12 w-12 items-center justify-center gap-2.5 rounded-full bg-[#25D366] text-[#07301c] shadow-high transition-[background-color,transform] duration-150 ease-out4 hover:bg-[#1fbe5a] active:translate-y-px sm:bottom-6 sm:right-6 sm:w-auto sm:justify-start sm:pl-3 sm:pr-4"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/25">
          <WhatsAppGlyph />
        </span>
        <span className="hidden flex-col leading-none sm:flex">
          <span className="tnum text-sm font-bold">{WA_LOCAL}</span>
          <span className="mt-0.5 text-[0.6875rem] font-semibold opacity-80">
            {t('wa.sub')} · #Land2Home
          </span>
        </span>
      </a>
    </>
  );
}

function WhatsAppGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 0 16.47Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
