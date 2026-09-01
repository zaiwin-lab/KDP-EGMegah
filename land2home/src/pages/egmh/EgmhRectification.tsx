import { useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Badge, Button, EmptyState, FieldShell, Icon, Panel, Textarea } from '@/components/ui';
import { SitePhoto } from '@/components/art/SitePhoto';
import { shortDate } from '@/lib/format';
import type { Defect } from '@/lib/types';

export default function EgmhRectification() {
  const { defects } = usePortal();

  const open = defects.filter((d) => d.status === 'open');
  const inProgress = defects.filter((d) => d.status === 'in_progress');
  const resolved = defects.filter((d) => d.status === 'resolved');

  return (
    <>
      <PageHead
        title="Rectification"
        lead="Items the member or the inspector raised. Record what you did and attach the evidence."
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Count label="Open" value={open.length} tone="warn" />
        <Count label="In progress" value={inProgress.length} tone="info" />
        <Count label="Resolved" value={resolved.length} tone="ok" />
      </div>

      {defects.length === 0 ? (
        <Panel>
          <EmptyState title="Nothing raised">
            Items appear here as soon as the member or the joint inspection raises them.
          </EmptyState>
        </Panel>
      ) : (
        <ol className="space-y-4">
          {[...open, ...inProgress, ...resolved].map((defect) => (
            <li key={defect.id}>
              <DefectCard defect={defect} />
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function Count({ label, value, tone }: { label: string; value: number; tone: 'warn' | 'info' | 'ok' }) {
  const bg = tone === 'warn' ? 'bg-warn-bg' : tone === 'info' ? 'bg-info-bg' : 'bg-ok-bg';
  return (
    <div className={`rounded-2xl border border-line p-5 ${bg}`}>
      <p className="tnum font-display text-3xl text-ink">{value}</p>
      <p className="mt-1 text-sm font-semibold text-ink-2">{label}</p>
    </div>
  );
}

function DefectCard({ defect }: { defect: Defect }) {
  const { actor, refresh } = usePortal();
  const repo = useRepo();
  const [note, setNote] = useState(defect.rectification_note ?? '');
  const [busy, setBusy] = useState<string | null>(null);

  const act = async (key: string, patch: Partial<Defect>) => {
    setBusy(key);
    try {
      await repo.updateDefect(defect.id, patch, actor);
      await refresh();
    } finally {
      setBusy(null);
    }
  };

  const tone = defect.status === 'resolved' ? 'ok' : defect.status === 'in_progress' ? 'info' : 'warn';
  const label = defect.status === 'resolved' ? 'Resolved' : defect.status === 'in_progress' ? 'In progress' : 'Open';

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="tnum text-sm font-bold text-ink-2">{defect.reference}</span>
            <span className="font-semibold text-ink">{defect.area}</span>
            <Badge tone={tone}>{label}</Badge>
          </p>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-2">{defect.description}</p>
          <p className="mt-1 text-[0.8125rem] text-ink-3">
            Raised by {defect.reported_by} on {shortDate(defect.reported_on)}
          </p>
        </div>
      </div>

      {defect.photos.length > 0 && (
        <div className="flex gap-3 overflow-x-auto border-b border-line px-5 py-4 sm:px-6">
          {defect.photos.map((photo) => (
            <figure key={photo.id} className="w-36 shrink-0">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <SitePhoto plate={photo.swatch} />
              </div>
              <figcaption className="mt-1.5 text-[0.75rem] text-ink-2">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <div className="space-y-4 px-5 py-5 sm:px-6">
        <FieldShell label="What was done to put it right" htmlFor={`note-${defect.id}`} required>
          <Textarea
            id={`note-${defect.id}`}
            className="min-h-[5rem]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Replaced the cartridge in the mixer tap and tested it under pressure."
          />
        </FieldShell>

        <div className="flex flex-wrap gap-2">
          {defect.status === 'open' && (
            <Button size="sm" variant="secondary" loading={busy === 'start'} onClick={() => act('start', { status: 'in_progress', rectification_note: note })}>
              Mark as in progress
            </Button>
          )}
          {defect.status !== 'resolved' && (
            <Button
              size="sm"
              loading={busy === 'resolve'}
              disabled={!note.trim()}
              onClick={() =>
                act('resolve', {
                  status: 'resolved',
                  rectification_note: note,
                  rectification_photos: [
                    { id: `rp_${Date.now()}`, caption: 'After rectification', swatch: 'b', taken_on: new Date().toISOString().slice(0, 10) },
                  ],
                })
              }
            >
              <Icon name="check" size={16} />
              Mark as put right
            </Button>
          )}
          {defect.status === 'resolved' && (
            <p className="flex items-center gap-2 text-sm text-ink-2">
              <Icon name="check" size={16} className="text-ok" />
              {defect.member_confirmed
                ? 'The member has confirmed they are happy with this.'
                : 'Waiting for the member to confirm they are happy.'}
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}
