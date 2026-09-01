import { useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, Button, EmptyState, Icon, Panel } from '@/components/ui';
import { SitePhoto } from '@/components/art/SitePhoto';
import { shortDate } from '@/lib/format';

/* KOBIS reads both versions side by side: what EGMH actually filed, and
   the plain wording the member will see. Nothing reaches the member until
   a coordinator has read the second column and published it. */
export default function AdminUpdates() {
  const { updates, actor, refresh } = usePortal();
  const repo = useRepo();
  const [busy, setBusy] = useState<string | null>(null);

  const waiting = updates.filter((u) => !u.published);
  const published = updates.filter((u) => u.published);

  return (
    <>
      <PageHead
        title="Progress updates"
        lead="Check the member wording before it is published. You are accountable for what the member reads."
      />

      <Panel className="mb-5 panel-pad">
        <Assurance icon="person">
          Plain-language wording may be drafted with assistance, but it is never published automatically.
          A coordinator reads it, edits it if needed, and publishes it. That act is recorded.
        </Assurance>
      </Panel>

      {waiting.length > 0 && (
        <>
          <h2 className="mb-3 font-display text-xl text-ink">Waiting for you</h2>
          <ol className="space-y-5">
            {waiting.map((update) => (
              <li key={update.id}>
                <Panel className="border-gold-500/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3.5 sm:px-6">
                    <p className="font-semibold text-ink">
                      {shortDate(update.reported_on)} · filed by {update.submitted_by}
                    </p>
                    <Badge tone="gold">Not published</Badge>
                  </div>
                  <div className="grid gap-px bg-line md:grid-cols-2">
                    <div className="bg-surface p-5">
                      <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-ink-3">Site report as filed</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink">{update.technical_summary}</p>
                      <dl className="mt-4 space-y-2 text-sm">
                        <Pair label="Completed" value={update.work_completed} />
                        <Pair label="Current" value={update.current_work} />
                        <Pair label="Next" value={`${update.next_activity} — ${shortDate(update.expected_next_date)}`} />
                        {update.delay_reason && <Pair label="Delay" value={update.delay_reason} />}
                      </dl>
                    </div>
                    <div className="bg-forest-50 p-5">
                      <p className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-wide text-ink-3">
                        What the member will read
                        {update.member_summary_source === 'assisted' && (
                          <span className="inline-flex items-center gap-1 normal-case tracking-normal text-gold-700">
                            <Icon name="sparkle" size={13} /> assisted draft
                          </span>
                        )}
                      </p>
                      <p className="mt-2 leading-relaxed text-ink">{update.member_summary}</p>
                    </div>
                  </div>
                  {update.photos.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto border-t border-line px-5 py-4 sm:px-6">
                      {update.photos.map((photo) => (
                        <figure key={photo.id} className="w-40 shrink-0">
                          <div className="aspect-[4/3] overflow-hidden rounded-lg">
                            <SitePhoto plate={photo.swatch} />
                          </div>
                          <figcaption className="mt-1.5 text-[0.75rem] text-ink-2">{photo.caption}</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                  <div className="border-t border-line px-5 py-4 sm:px-6">
                    <Button
                      loading={busy === update.id}
                      onClick={async () => {
                        setBusy(update.id);
                        try {
                          await repo.publishProgressUpdate(update.id, actor);
                          await refresh();
                        } finally {
                          setBusy(null);
                        }
                      }}
                    >
                      <Icon name="check" size={17} />
                      Publish to the member
                    </Button>
                  </div>
                </Panel>
              </li>
            ))}
          </ol>
        </>
      )}

      <h2 className="mb-3 mt-8 font-display text-xl text-ink">Published</h2>
      {published.length === 0 ? (
        <Panel><EmptyState title="Nothing published yet">Updates you publish appear here.</EmptyState></Panel>
      ) : (
        <Panel>
          <ul className="divide-y divide-line">
            {published.map((update) => (
              <li key={update.id} className="px-5 py-4 sm:px-6">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                  {shortDate(update.reported_on)}
                  <Badge tone="ok"><Icon name="check" size={12} /> Published</Badge>
                </p>
                <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-ink-2">{update.member_summary}</p>
                <p className="mt-1 text-[0.8125rem] text-ink-3">
                  Filed by {update.submitted_by}, published by {update.verified_by}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-ink-2">{value}</dd>
    </div>
  );
}
