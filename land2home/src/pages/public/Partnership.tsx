import { ButtonLink, Icon } from '@/components/ui';
import { PartnerLockup } from '@/components/layout/Wordmark';
import { PublicFooter, PublicNav } from './Home';
import { ORG } from '@/data/demoSeed';

/* The trust page. Every credential here comes from the organisation's own
   published material; where something is not published, it is left out
   rather than estimated. */
export default function Partnership() {
  return (
    <div className="bg-paper">
      <PublicNav />

      <header className="border-b border-line bg-onyx py-16 text-forest-50 sm:py-20">
        <div className="shell">
          <PartnerLockup className="text-2xl" />
          <h1 className="mt-6 max-w-3xl font-display text-[2.4rem] leading-[1.06] tracking-[-0.02em] sm:text-[3.2rem]">
            Who is building your house, and who is answerable for what.
          </h1>
          <p className="mt-6 max-w-prose leading-relaxed text-forest-50/80">
            Handing over your land and your savings is not a small thing. This page sets out exactly which
            organisation does what, what each one is registered as, and where a decision that affects you
            actually gets made.
          </p>
        </div>
      </header>

      {/* ── Each organisation in full ──────────────────────────────── */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="shell space-y-14">
          {ORG.partners.map((partner, i) => (
            <article key={partner.code} className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
              <div>
                <p className="tnum text-sm font-bold text-gold-700">0{i + 1}</p>
                <h2 className="mt-2 font-display text-3xl leading-tight text-ink">{partner.name}</h2>
                <p className="mt-2 leading-relaxed text-ink-2">{partner.legal_name}</p>
                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-ink-3">Role</dt>
                    <dd className="font-semibold text-ink">{partner.role}</dd>
                  </div>
                  {partner.registration && (
                    <div className="flex gap-2">
                      <dt className="text-ink-3">Registration</dt>
                      <dd className="tnum font-semibold text-ink">{partner.registration}</dd>
                    </div>
                  )}
                  {partner.established && (
                    <div className="flex gap-2">
                      <dt className="text-ink-3">Since</dt>
                      <dd className="font-semibold text-ink">{partner.established}</dd>
                    </div>
                  )}
                  {partner.address && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-ink-3">Office</dt>
                      <dd className="text-ink">{partner.address}</dd>
                    </div>
                  )}
                  {partner.phone && (
                    <div className="flex gap-2">
                      <dt className="text-ink-3">Phone</dt>
                      <dd>
                        <a
                          href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`}
                          className="tnum font-semibold text-forest-800 underline decoration-forest-600/30 underline-offset-4 hover:decoration-forest-600"
                        >
                          {partner.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {partner.email && (
                    <div className="flex gap-2">
                      <dt className="text-ink-3">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${partner.email}`}
                          className="font-semibold text-forest-800 underline decoration-forest-600/30 underline-offset-4 hover:decoration-forest-600"
                        >
                          {partner.email}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 underline decoration-forest-600/30 underline-offset-4 hover:decoration-forest-600"
                  >
                    Visit {partner.name}
                    <Icon name="arrow" size={15} />
                  </a>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                    Standing and recognition
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {partner.credentials.map((c) => (
                      <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-forest-600" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
                    Accountable for
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {partner.responsibilities.map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                        <Icon name="chevron" size={15} className="mt-0.5 shrink-0 text-gold-700" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Where decisions are made ───────────────────────────────── */}
      <section className="border-b border-line bg-surface py-16 sm:py-20">
        <div className="shell">
          <div className="max-w-prose">
            <h2 className="font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2.4rem]">
              Where a decision about you actually gets made.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-2">
              No single party can move your project on its own, and the platform cannot move it at all.
              Each row below needs a named person to act, and each act is written to an audit record that
              cannot be edited or deleted afterwards.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line-2">
                  <th scope="col" className="py-3 pr-4 font-semibold text-ink">Decision</th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-ink">Who decides</th>
                  <th scope="col" className="py-3 font-semibold text-ink">What the platform does</th>
                </tr>
              </thead>
              <tbody className="text-ink-2">
                {[
                  ['Is this person a member in good standing?', 'KPSM Bau', 'Holds the record and shows the status'],
                  ['Is this land title valid for building?', 'KOBIS, against the land office record', 'Reads the title and proposes values for you to confirm'],
                  ['What will this house cost?', 'EGMH, after visiting the site', 'Carries the quotation and the signed contract'],
                  ['Is this construction milestone genuinely complete?', 'EGMH reports, KOBIS verifies', 'Shows the evidence side by side'],
                  ['Should this payment be released?', 'A named KPSM officer', 'Refuses to record a payment nobody authorised'],
                  ['Is this defect put right?', 'You confirm it, after EGMH rectifies', 'Keeps it open until you say so'],
                ].map(([decision, who, platform]) => (
                  <tr key={decision} className="border-b border-line align-top">
                    <td className="py-3.5 pr-4 text-ink">{decision}</td>
                    <td className="py-3.5 pr-4 font-semibold text-ink">{who}</td>
                    <td className="py-3.5">{platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex max-w-prose items-start gap-3 rounded-2xl border border-line bg-paper p-5">
            <Icon name="lock" className="mt-0.5 shrink-0 text-forest-600" />
            <p className="text-sm leading-relaxed text-ink-2">
              Two of these are enforced by the database itself, not by application code. A payment release
              cannot reach an authorised or paid state without a named authorising officer, and audit
              records reject every attempt to change or delete them. A mistake in the software cannot
              undo either one.
            </p>
          </div>
        </div>
      </section>

      {/* ── Honest limits ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="shell max-w-prose">
          <h2 className="font-display text-[1.75rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2rem]">
            What this platform is not.
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              'It is not a lender, and it does not decide your eligibility for financing.',
              'It does not certify construction work. Only qualified people do that.',
              'It does not approve payments. Every release is authorised by a named KPSM officer.',
              'Assisted reading of your documents is a suggestion you confirm, never a verification.',
              'Prices shown before a site assessment are indicative, not an offer.',
            ].map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed text-ink-2">
                <Icon name="info" size={18} className="mt-0.5 shrink-0 text-ink-3" />
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/login">Enter the member portal</ButtonLink>
            <ButtonLink to="/" variant="secondary">Back to the homepage</ButtonLink>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
