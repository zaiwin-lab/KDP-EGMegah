import { Link } from 'react-router-dom';
import { ButtonLink, Icon } from '@/components/ui';
import { PartnerLockup, Wordmark } from '@/components/layout/Wordmark';
import { EGMH_BUILD_SYSTEM, EGMH_STEPS, HOUSE_TYPES } from '@/lib/houseTypes';
import { STAGE_META, STAGE_ORDER } from '@/lib/journey';
import { ORG } from '@/data/demoSeed';
import { myr, sqft } from '@/lib/format';
import { useI18n } from '@/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Signature } from '@/components/Signature';

const STAGE_ICON: Record<string, string> = {
  land: 'land', home: 'home', plan: 'plan', build: 'build', inspection: 'search', keys: 'key',
};

export default function Home() {
  const { t } = useI18n();
  return (
    <div className="bg-paper">
      <PublicNav />

      {/* ── Hero: a real EGMH home carries the fold ────────────────── */}
      <header className="relative isolate overflow-hidden bg-onyx text-forest-50">
        <img
          src="/egmh/serena.jpg"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-onyx via-onyx/90 to-onyx/45" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-onyx to-transparent" />

        <div className="shell relative py-20 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-[0.8125rem] font-semibold tracking-wide text-gold-200">
              <Icon name="key" size={15} />
              {t('hero.badge')}
            </p>
            <h1 className="mt-6 font-display text-[2.7rem] leading-[1.04] tracking-[-0.02em] sm:text-[3.6rem] lg:text-[4.1rem]">
              {t('hero.title')}
            </h1>
            <p className="mt-6 max-w-prose text-[1.0625rem] leading-relaxed text-forest-50/85 sm:text-lg">
              {t('hero.lead')}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink to="/login" size="lg" className="bg-gold-500 text-onyx hover:bg-gold-200 focus-visible:ring-gold-500/30">
                {t('hero.cta')}
                <Icon name="arrow" size={18} />
              </ButtonLink>
              <ButtonLink
                to="/partnership"
                size="lg"
                variant="onDark"
              >
                {t('hero.cta2')}
              </ButtonLink>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-forest-50/15 pt-8 sm:grid-cols-3">
              {[
                ['EGMH', t('hero.egmh')],
                ['KOBIS Berhad', t('hero.kobis')],
                ['KPSM Bau', t('hero.kpsm')],
              ].map(([who, what]) => (
                <div key={who}>
                  <dt className="font-display text-lg text-gold-200">{who}</dt>
                  <dd className="mt-0.5 text-sm text-forest-50/70">{what}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      {/* ── The four EGMH paths, with real renders ─────────────────── */}
      <section id="homes" className="scroll-mt-20 border-b border-line py-16 sm:py-24">
        <div className="shell">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]">
              {t('homes.title')}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              {t('homes.lead')}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {HOUSE_TYPES.map((house, i) => (
              <article
                key={house.key}
                className={`group overflow-hidden rounded-2xl border border-line bg-surface ${i === 0 || i === 3 ? 'md:col-span-2' : ''}`}
              >
                <div className={`relative overflow-hidden ${i === 0 || i === 3 ? 'aspect-[21/9]' : 'aspect-[16/10]'}`}>
                  <img
                    src={house.image}
                    alt={house.image_alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out4 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-onyx/75 px-3 py-1 text-2xs font-semibold uppercase tracking-[0.12em] text-gold-200 backdrop-blur-sm">
                    {house.series}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                    {house.character}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl text-ink">{house.name}</h3>
                  <p className="mt-2 max-w-prose leading-relaxed text-ink-2">{house.tagline}</p>

                  <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
                    <dl className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
                      <div>
                        <dt className="text-ink-3">{t('homes.builtup')}</dt>
                        <dd className="tnum font-semibold text-ink">
                          {house.built_up_sq_ft ? sqft(house.built_up_sq_ft) : t('homes.youdecide')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-ink-3">{t('homes.bedrooms')}</dt>
                        <dd className="tnum font-semibold text-ink">{house.bedrooms ?? '—'}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-3">{t('homes.bathrooms')}</dt>
                        <dd className="tnum font-semibold text-ink">{house.bathrooms ?? '—'}</dd>
                      </div>
                    </dl>
                    <p className="tnum font-display text-lg text-forest-800">
                      {house.indicative_price ? `${t('homes.from')} ${myr(house.indicative_price)}` : t('homes.priced')}
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-2">
                    {house.highlights.map((point) => (
                      <li key={point} className="flex gap-2.5">
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-forest-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How EGMH actually builds ───────────────────────────────── */}
      <section className="border-b border-line bg-onyx py-16 text-forest-50 sm:py-24">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="max-w-prose">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-gold-200">
                {t('tech.eyebrow')}
              </p>
              <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.015em] sm:text-[2.6rem]">
                {t('tech.title')}
              </h2>
              <p className="mt-5 leading-relaxed text-forest-50/80">{t('tech.lead')}</p>

              <p className="mt-8 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-forest-50/50">
                {t('tech.certs')}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {EGMH_BUILD_SYSTEM.certifications.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-forest-50/25 px-3 py-1.5 text-[0.8125rem] font-semibold text-forest-50/85"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-forest-50/12">
                {EGMH_BUILD_SYSTEM.specs.map((spec) => (
                  <div key={spec.label} className="bg-onyx p-5 sm:p-6">
                    <dt className="tnum font-display text-2xl text-gold-200 sm:text-3xl">{spec.value}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-forest-50/75">{spec.label}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-forest-50/50">
                {t('tech.steps')}
              </p>
              <ol className="mt-3 space-y-2.5">
                {EGMH_STEPS.map((step) => (
                  <li key={step.n} className="flex gap-3.5">
                    <span className="tnum shrink-0 font-display text-sm text-gold-200">{step.n}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-forest-50">{step.title}</span>
                      <span className="mt-0.5 block text-sm text-forest-50/65">{step.en}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why this is the members' own platform ──────────────────── */}
      <section className="border-b border-line bg-forest-50 py-16 sm:py-24">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <div className="max-w-prose">
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-gold-700">
                {t('members.eyebrow')}
              </p>
              <h2 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]">
                {t('members.title')}
              </h2>
              <p className="mt-5 leading-relaxed text-ink-2">
                {t('members.p1')}
              </p>
              <p className="mt-4 leading-relaxed text-ink-2">
                {t('members.p2')}
              </p>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                ['key', t('members.b1t'), t('members.b1b')],
                ['money', t('members.b2t'), t('members.b2b')],
                ['person', t('members.b3t'), t('members.b3b')],
                ['doc', t('members.b4t'), t('members.b4b')],
              ].map(([icon, title, body]) => (
                <li key={title} className="rounded-2xl border border-line bg-surface p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-800">
                    <Icon name={icon} size={19} />
                  </span>
                  <h3 className="mt-3.5 font-semibold text-ink">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Who is behind it ───────────────────────────────────────── */}
      <section className="border-b border-line bg-onyx py-16 text-forest-50 sm:py-24">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <PartnerLockup className="text-2xl" />
              <h2 className="mt-6 font-display text-[2rem] leading-tight tracking-[-0.015em] sm:text-[2.6rem]">
                {t('partners.title')}
              </h2>
              <p className="mt-5 max-w-prose leading-relaxed text-forest-50/80">
                {t('partners.lead')}
              </p>
              <ButtonLink
                to="/partnership"
                variant="onDark"
                className="mt-8"
              >
                {t('partners.cta')}
                <Icon name="arrow" size={17} />
              </ButtonLink>
            </div>

            <ul className="space-y-px overflow-hidden rounded-2xl bg-forest-50/10">
              {ORG.partners.map((partner) => (
                <li key={partner.code} className="bg-onyx p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-display text-xl text-gold-200">{partner.name}</h3>
                    <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-forest-50/50">
                      {partner.role}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-forest-50/60">
                    {partner.legal_name}
                    {partner.registration ? ` · ${partner.registration}` : ''}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {partner.responsibilities.slice(0, 3).map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-forest-50/80">
                        <Icon name="check" size={15} className="mt-0.5 shrink-0 text-gold-500" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── The six stages ─────────────────────────────────────────── */}
      <section id="journey" className="scroll-mt-20 border-b border-line py-16 sm:py-24">
        <div className="shell">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]">
              {t('journey.title')}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              {t('journey.lead')}
            </p>
          </div>

          <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {STAGE_ORDER.map((key, i) => (
              <li key={key} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-800">
                  <Icon name={STAGE_ICON[key]} />
                </span>
                <div className="min-w-0">
                  <p className="flex items-baseline gap-2">
                    <span className="tnum text-sm font-bold text-gold-700">{i + 1}</span>
                    <span className="font-display text-xl text-ink">{STAGE_META[key].title}</span>
                  </p>
                  <p className="mt-1.5 leading-relaxed text-ink-2">{STAGE_META[key].blurb}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Payment governance ─────────────────────────────────────── */}
      <section className="border-b border-line bg-surface py-16 sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]">
              {t('pay.title')}
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              {t('pay.p1')}
            </p>
            <p className="mt-4 leading-relaxed text-ink-2">
              {t('pay.p2')}
            </p>
          </div>

          <ol className="space-y-3">
            {[
              [t('pay.r1t'), t('pay.r1b')],
              [t('pay.r2t'), t('pay.r2b')],
              [t('pay.r3t'), t('pay.r3b')],
              [t('pay.r4t'), t('pay.r4b')],
            ].map(([title, detail], i) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-line bg-paper p-5">
                <span className="tnum grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-800 text-sm font-bold text-forest-50">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What each party gets ───────────────────────────────────── */}
      <section className="border-b border-line py-16 sm:py-24">
        <div className="shell">
          <h2 className="max-w-prose font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.6rem]">
            {t('aud.title')}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [t('aud.a1t'), t('aud.a1b')],
              [t('aud.a2t'), t('aud.a2b')],
              [t('aud.a3t'), t('aud.a3b')],
              [t('aud.a4t'), t('aud.a4b')],
            ].map(([who, what]) => (
              <div key={who} className="border-t-2 border-gold-500/60 pt-5">
                <h3 className="font-display text-xl text-ink">{who}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{what}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <ButtonLink to="/login" size="lg">
              {t('hero.cta')}
              <Icon name="arrow" size={18} />
            </ButtonLink>
            <p className="text-sm text-ink-2">{t('aud.note')}</p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export function PublicNav() {
  const { t } = useI18n();
  return (
    <div className="sticky top-0 z-sticky border-b border-forest-50/10 bg-onyx/95 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <Wordmark tone="light" showPartners />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="/#homes"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-forest-50/80 transition-colors hover:bg-forest-800 hover:text-forest-50 sm:block"
          >
            {t('nav.homes')}
          </a>
          <Link
            to="/partnership"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-forest-50/80 transition-colors hover:bg-forest-800 hover:text-forest-50 sm:block"
          >
            {t('nav.partnership')}
          </Link>
          <LanguageSwitcher />
          <ButtonLink to="/login" size="sm" className="bg-gold-500 text-onyx hover:bg-gold-200 focus-visible:ring-gold-500/30">
            {t('nav.signin')}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export function PublicFooter() {
  const { t } = useI18n();
  return (
    <footer className="bg-onyx pb-8 pt-12 text-forest-50/70">
      <div className="shell grid gap-8 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <Wordmark tone="light" showPartners />
          <p className="mt-5 max-w-md text-sm leading-relaxed">{t('footer.disclaimer')}</p>
        </div>
        <div className="sm:justify-self-end">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-forest-50/50">
            {t('footer.operated')}
          </p>
          {/* Names only: listing a registration for one partner and not the
              others read as though the rest were less established. */}
          <ul className="mt-3 space-y-2 text-sm">
            {ORG.partners.map((p) => (
              <li key={p.code} className="text-forest-50">{p.legal_name}</li>
            ))}
          </ul>
          <Link to="/partnership" className="mt-4 inline-block text-sm font-semibold text-gold-200 underline underline-offset-4">
            {t('footer.about')}
          </Link>
        </div>
      </div>

      <div className="shell mt-10 border-t border-forest-50/12 pt-7">
        <Signature />
      </div>
    </footer>
  );
}
