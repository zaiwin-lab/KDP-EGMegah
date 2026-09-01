import { useState } from 'react';
import { usePortal } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, Button, EmptyState, Icon, Panel, PanelHeader } from '@/components/ui';
import { shortDate } from '@/lib/format';

export default function AdminDocuments() {
  const { documents, profile } = usePortal();
  const [checked, setChecked] = useState<string[]>([]);

  const pending = documents.filter((d) => d.status === 'pending_review');
  const verified = documents.filter((d) => d.status === 'verified');

  return (
    <>
      <PageHead
        title="Member documents"
        lead={profile ? `${profile.full_name} · KPSM ${profile.membership_no}` : undefined}
      />

      <Panel className="mb-5 panel-pad">
        <Assurance icon="person">
          Anything read from a document is a suggestion until you have opened the document and checked it
          yourself. Marking a document verified is what makes its details count.
        </Assurance>
      </Panel>

      <Panel>
        <PanelHeader title="Waiting to be checked" action={<Badge tone={pending.length ? 'warn' : 'ok'}>{pending.length}</Badge>} />
        {pending.length === 0 ? (
          <EmptyState title="Nothing waiting">Every document this member has uploaded has been checked.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {pending.map((doc) => (
              <li key={doc.id} className="px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{doc.title}</p>
                    <p className="text-[0.8125rem] text-ink-2">
                      {doc.file_name} · {doc.size_kb} KB · uploaded {shortDate(doc.uploaded_at)} by {doc.uploaded_by}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={checked.includes(doc.id) ? 'secondary' : 'primary'}
                    onClick={() => setChecked((prev) => (prev.includes(doc.id) ? prev : [...prev, doc.id]))}
                  >
                    {checked.includes(doc.id) ? 'Opened' : 'Open the document'}
                  </Button>
                </div>

                {doc.extraction && (
                  <div className="mt-3 rounded-xl border border-line bg-forest-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Icon name="sparkle" size={15} className="text-gold-700" />
                      What was read from it {doc.extraction.reviewed ? '(the member has confirmed these)' : '(the member has not confirmed these yet)'}
                    </p>
                    <dl className="mt-2 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                      {doc.extraction.fields.map((field) => (
                        <div key={field.field} className="flex items-baseline justify-between gap-3">
                          <dt className="text-ink-2">{field.label}</dt>
                          <dd className="flex items-center gap-2 font-semibold text-ink">
                            {field.value || '—'}
                            {field.confidence !== 'high' && <Badge tone="warn">{field.confidence}</Badge>}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {doc.extraction.notes.length > 0 && (
                      <ul className="mt-3 space-y-1 border-t border-line pt-3 text-[0.8125rem] text-ink-2">
                        {doc.extraction.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <p className="mt-3 text-[0.8125rem] text-ink-3">
                  {checked.includes(doc.id)
                    ? 'Now mark it verified or reject it in the records system, and the member is told either way.'
                    : 'Open the document before recording a decision on it.'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="mt-5">
        <PanelHeader title="Already verified" action={<Badge tone="ok">{verified.length}</Badge>} />
        <ul className="divide-y divide-line">
          {verified.map((doc) => (
            <li key={doc.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
              <div className="min-w-0">
                <p className="font-semibold text-ink">{doc.title}</p>
                <p className="text-[0.8125rem] text-ink-2">
                  Verified by {doc.verified_by} on {shortDate(doc.verified_at)}
                </p>
              </div>
              {doc.valid_until && <Badge>valid until {shortDate(doc.valid_until)}</Badge>}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
