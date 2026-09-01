import { useI18n } from '@/i18n';

/* The house credit bar, carried at the foot of every page: one line, with
   KOBIS Berhad linked and given a gold sheen on hover. */
export function Signature({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { t } = useI18n();
  const [before, after] = t('credit.line').split('{brand}');

  return (
    <div
      className={
        tone === 'light'
          ? 'flex min-h-[4.5rem] items-center justify-center border-t border-forest-50/10 bg-onyx px-5 py-4'
          : 'flex min-h-[4.5rem] items-center justify-center border-t border-line bg-forest-900 px-5 py-4'
      }
    >
      <p className="text-center text-[0.78rem] font-light leading-relaxed text-forest-50/85">
        {before}
        <a
          href="https://www.kobisberhad.com"
          target="_blank"
          rel="noreferrer noopener"
          className="kobis-link font-semibold text-gold-200 transition-colors"
        >
          KOBIS Berhad
        </a>
        {after}
      </p>
    </div>
  );
}
