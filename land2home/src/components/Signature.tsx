/* House signature, carried at the foot of every page. */
export function Signature({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const muted = tone === 'light' ? 'text-forest-50/55' : 'text-ink-3';
  const link = tone === 'light' ? 'text-gold-200' : 'text-gold-700';
  return (
    <div className={`flex flex-col items-center gap-2 text-center text-sm ${muted}`}>
      <p className="font-display italic">
        ~ Sparkling Sarawak's Future, Towards 2030 and Beyond ~
      </p>
      <a
        href="https://www.kobisberhad.com"
        target="_blank"
        rel="noreferrer noopener"
        className={`font-semibold underline decoration-current/30 underline-offset-4 transition-colors hover:decoration-current ${link}`}
      >
        www.kobisberhad.com
      </a>
    </div>
  );
}
