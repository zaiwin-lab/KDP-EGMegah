import { Link } from 'react-router-dom';
import { ButtonLink, Icon } from '@/components/ui';
import { Wordmark } from '@/components/layout/Wordmark';
import { HeroScene } from '@/components/art/HeroScene';
import { HOUSE_TYPES } from '@/lib/houseTypes';
import { STAGE_META, STAGE_ORDER } from '@/lib/journey';
import { myr, sqft } from '@/lib/format';

const STAGE_ICON: Record<string, string> = {
  land: 'land', home: 'home', plan: 'plan', build: 'build', inspection: 'search', keys: 'key',
};

export default function Home() {
  return (
    <div className="bg-paper">
      <PublicNav />

      {/* ── Hero: forest green carries the surface, the scene sits in it ── */}
      <header className="relative overflow-hidden bg-forest-900 text-forest-50">
        <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
          <HeroScene className="h-full w-full" />
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-forest-900 to-transparent" />
        </div>

        <div className="shell relative py-16 sm:py-20 lg:py-28">
          <div className="max-w-xl lg:max-w-[34rem]">
            <p className="font-display text-lg italic text-gold-200">From Land. To Vision. To Home.</p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.06] tracking-[-0.02em] sm:text-[3.4rem] lg:text-[3.9rem]">
              Your land already holds a vision.
            </h1>
            <p className="mt-6 max-w-prose text-[1.0625rem] leading-relaxed text-forest-50/85 sm:text-lg">
              A guided home-building journey for KPSM members, from land verification and home selection
              to construction updates and key handover.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink to="/login" size="lg" className="bg-gold-500 text-forest-950 hover:bg-gold-200 focus-visible:ring-gold-500/30">
                Enter the member portal
                <Icon name="arrow" size={18} />
              </ButtonLink>
              <ButtonLink
                to="#journey"
                size="lg"
                variant="secondary"
                className="border-forest-50/35 bg-transparent text-forest-50 hover:border-forest-50/70 hover:text-forest-50 focus-visible:ring-forest-50/25"
              >
                See how it works
              </ButtonLink>
            </div>

            <p className="mt-8 max-w-md text-sm leading-relaxed text-forest-50/65">
              Built and managed by KOBIS Berhad. Membership and staged payments are governed by KPSM.
              Design and construction are carried out by EGMH.
            </p>
          </div>
        </div>

        {/* On narrow screens the scene sits under the words rather than behind them. */}
        <div className="relative h-56 sm:h-72 lg:hidden">
          <HeroScene className="h-full w-full" />
        </div>
      </header>

      {/* ── The six stages ── */}
      <section id="journey" className="scroll-mt-20 border-b border-line py-16 sm:py-20">
        <div className="shell">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.5rem]">
              Six stages, and you always know which one you are in.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              Building a house involves a cooperative, a builder and a lot of paperwork. The portal keeps all of
              it in one place, in plain language, and tells you when something is genuinely needed from you.
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

      {/* ── Houses ── */}
      <section className="border-b border-line bg-surface py-16 sm:py-20">
        <div className="shell">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.5rem]">
              Three plans, or your own.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              Prices below are indicative. The real figure is fixed only after EGMH visits your land and issues
              a written quotation, so nothing you see here commits you to anything.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOUSE_TYPES.map((house) => (
              <article key={house.key} className="flex flex-col rounded-2xl border border-line bg-paper p-6">
                <h3 className="font-display text-xl text-ink">{house.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{house.tagline}</p>

                <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-sm">
                  <div>
                    <dt className="text-ink-3">Built-up</dt>
                    <dd className="tnum font-semibold text-ink">{house.built_up_sq_ft ? sqft(house.built_up_sq_ft) : 'You decide'}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-3">Bedrooms</dt>
                    <dd className="tnum font-semibold text-ink">{house.bedrooms ?? '—'}</dd>
                  </div>
                </dl>

                <p className="mt-4 tnum font-display text-lg text-forest-800">
                  {house.indicative_price ? `from ${myr(house.indicative_price)}` : 'Priced after the site visit'}
                </p>

                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink-2">
                  {house.highlights.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <Icon name="check" size={16} className="mt-1 text-forest-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How payment works ── */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.5rem]">
              Money moves in four releases, and never without a person signing for it.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              KPSM manages the staged payments to EGMH on your behalf. Each release follows the same
              visible route, and you can see exactly where it has reached.
            </p>
            <p className="mt-4 leading-relaxed text-ink-2">
              The portal can read your documents and draft your updates. It cannot approve a payment,
              certify construction work, or make a decision about your contract. Those stay with named
              people at KPSM, KOBIS and EGMH, and each one leaves an audit record.
            </p>
          </div>

          <ol className="space-y-3">
            {[
              ['Mobilisation and contract commencement', 'The contract is signed and EGMH moves onto your land.'],
              ['Foundation and structural milestone', 'The foundation and main structure are complete and checked.'],
              ['Roofing, enclosure, services and finishes', 'The roof is on, the house is closed up, wiring and water are in.'],
              ['Completion, inspection, rectification and handover', 'After the joint inspection, any repairs, and your keys.'],
            ].map(([title, detail], i) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
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

      {/* ── Who does what ── */}
      <section className="bg-forest-900 py-16 text-forest-50 sm:py-20">
        <div className="shell">
          <h2 className="max-w-prose font-display text-[2rem] leading-tight tracking-[-0.015em] sm:text-[2.5rem]">
            Four parties. One record everyone works from.
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['You', 'Choose your home, provide what is needed once, watch the build, and approve what is yours to approve.'],
              ['KPSM', 'Verifies membership, governs the money, and authorises each staged payment release.'],
              ['KOBIS Berhad', 'Runs the portal, coordinates your journey, keeps the records and answers the phone.'],
              ['EGMH', 'Assesses the site, designs, quotes, builds, reports progress, fixes defects and hands over the keys.'],
            ].map(([who, what]) => (
              <div key={who} className="border-t border-forest-50/20 pt-5">
                <h3 className="font-display text-xl text-gold-200">{who}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest-50/80">{what}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-forest-50/20 pt-10">
            <ButtonLink to="/login" size="lg" className="bg-gold-500 text-forest-950 hover:bg-gold-200 focus-visible:ring-gold-500/30">
              Enter the member portal
              <Icon name="arrow" size={18} />
            </ButtonLink>
            <p className="text-sm text-forest-50/70">
              Not a KPSM member yet? Speak to your cooperative office first.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function PublicNav() {
  return (
    <div className="sticky top-0 z-sticky border-b border-forest-800/50 bg-forest-900/95 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <Wordmark tone="light" />
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="#journey"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-forest-50/80 transition-colors hover:bg-forest-800 hover:text-forest-50 sm:block"
          >
            How it works
          </a>
          <ButtonLink to="/login" size="sm" className="bg-gold-500 text-forest-950 hover:bg-gold-200 focus-visible:ring-gold-500/30">
            Sign in
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-forest-950 py-10 text-forest-50/70">
      <div className="shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Wordmark tone="light" />
          <p className="mt-4 max-w-md text-sm leading-relaxed">
            A demonstration portal built for the KPSM member home-building programme. The members,
            land titles, prices and payment records shown are illustrative and do not describe a real project.
          </p>
        </div>
        <p className="text-sm">Operated by KOBIS Berhad</p>
      </div>
    </footer>
  );
}
