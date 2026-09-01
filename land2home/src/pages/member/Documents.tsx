import { useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, FieldShell, Icon, Panel, PanelHeader, Select } from '@/components/ui';
import { ExtractionReview } from '@/components/ExtractionReview';
import { extractFromDocument } from '@/ai/client';
import { documentGaps } from '@/ai/localAssistant';
import { shortDate } from '@/lib/format';
import type { DocumentKind, DocumentRecord, ExtractedField } from '@/lib/types';

const KINDS: { value: DocumentKind; label: string }[] = [
  { value: 'ic', label: 'Identity card' },
  { value: 'membership_card', label: 'KPSM membership record' },
  { value: 'land_title', label: 'Land title' },
  { value: 'land_plan', label: 'Land plan or survey' },
  { value: 'income_proof', label: 'Income confirmation' },
  { value: 'consent_form', label: 'Signed consent form' },
  { value: 'other', label: 'Something else' },
];

const STATUS: Record<DocumentRecord['status'], { tone: 'ok' | 'warn' | 'alert' | 'neutral'; label: string }> = {
  verified: { tone: 'ok', label: 'Verified' },
  pending_review: { tone: 'warn', label: 'Waiting to be checked' },
  rejected: { tone: 'alert', label: 'Could not be read' },
  reference: { tone: 'neutral', label: 'For your records' },
};

export default function Documents() {
  const { documents, profile, land, actor, project, refresh } = usePortal();
  const repo = useRepo();

  const [kind, setKind] = useState<DocumentKind>('ic');
  const [pending, setPending] = useState<{ doc: DocumentRecord; fields: ExtractedField[]; notes: string[]; source: 'assisted' | 'local' } | null>(null);
  const [busy, setBusy] = useState(false);

  const gaps = documentGaps(documents, 'plan');
  const mine = documents.filter((d) => d.status !== 'reference');
  const shared = documents.filter((d) => d.status === 'reference');

  const handleFile = async (file: File | undefined) => {
    if (!file || !profile) return;
    setBusy(true);
    try {
      const extraction = await extractFromDocument({ kind, fileName: file.name, profile, land });
      const doc = await repo.addDocument(
        {
          profile_id: profile.id,
          project_id: project?.id,
          kind,
          title: KINDS.find((k) => k.value === kind)?.label ?? 'Document',
          file_name: file.name,
          size_kb: Math.max(1, Math.round(file.size / 1024)),
          uploaded_by: profile.full_name,
          extraction: { reviewed: false, fields: extraction.fields, notes: extraction.notes },
        },
        actor,
      );
      await refresh();
      if (extraction.fields.length) {
        setPending({ doc, fields: extraction.fields, notes: extraction.notes, source: extraction.source });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead
        title="My documents"
        lead="Upload something once and it is reused everywhere it is needed. We never ask again for a document that is already on file and still valid."
      />

      {gaps.length > 0 && (
        <Panel className="mb-5 border-gold-500/40 bg-gold-100/50">
          <div className="flex items-center gap-2.5 border-b border-gold-500/25 px-5 py-3.5">
            <Icon name="doc" className="text-gold-700" />
            <h2 className="text-[0.95rem] font-bold text-ink">Still needed for this stage</h2>
          </div>
          <ul className="divide-y divide-gold-500/20">
            {gaps.map((gap) => (
              <li key={gap.kind} className="px-5 py-3.5">
                <p className="font-semibold text-ink">{gap.label}</p>
                <p className="mt-0.5 text-sm text-ink-2">{gap.note}</p>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {pending && (
        <div className="mb-5">
          <ExtractionReview
            fields={pending.fields}
            notes={pending.notes}
            source={pending.source}
            onDiscard={() => setPending(null)}
            onConfirm={async (fields) => {
              await repo.confirmExtraction(pending.doc.id, fields, actor);
              /* Only values the member ticked are written back to the
                 profile, and they stay unverified until an officer checks
                 the document itself. */
              const accepted = Object.fromEntries(
                fields.filter((f) => f.accepted && f.value.trim()).map((f) => [f.field, f.value.trim()]),
              );
              if (profile && Object.keys(accepted).length) {
                const profileFields = ['full_name', 'ic_number', 'membership_no', 'address_line1', 'postcode', 'employer'];
                const patch: Record<string, string> = {};
                for (const key of profileFields) if (accepted[key]) patch[key] = accepted[key];
                if (Object.keys(patch).length) await repo.updateProfile(profile.id, patch, actor);
              }
              await refresh();
              setPending(null);
            }}
          />
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Panel>
          <PanelHeader title="Add a document" description="A clear photo of the whole page works. We will read it and show you what we found." />
          <div className="space-y-4 px-5 py-5 sm:px-6">
            <FieldShell label="What is it?" htmlFor="doc-kind" required>
              <Select id="doc-kind" value={kind} onChange={(e) => setKind(e.target.value as DocumentKind)}>
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </Select>
            </FieldShell>

            <FieldShell label="Choose the file" htmlFor="doc-file" required hint="PDF or a photo. Nothing is shared outside KPSM, KOBIS and EGMH.">
              <input
                id="doc-file"
                type="file"
                accept="image/*,application/pdf"
                disabled={busy}
                className="field file:mr-3 file:rounded-lg file:border-0 file:bg-forest-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-forest-800 disabled:opacity-60"
                onChange={(e) => {
                  void handleFile(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </FieldShell>

            {busy && (
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-forest-600 border-t-transparent" />
                Reading your document
              </p>
            )}

            <Assurance>
              Your documents are stored securely and are visible only to you and the officers handling your
              project. You agreed to this when you gave consent, and you can ask KOBIS to remove anything you
              have uploaded.
            </Assurance>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeader title="What you have given us" action={<Badge>{mine.length}</Badge>} />
            <ul className="divide-y divide-line">
              {mine.map((doc) => (
                <DocRow key={doc.id} doc={doc} />
              ))}
            </ul>
          </Panel>

          {shared.length > 0 && (
            <Panel>
              <PanelHeader title="Documents for your records" description="Issued by KOBIS, KPSM or EGMH. Yours to keep." />
              <ul className="divide-y divide-line">
                {shared.map((doc) => (
                  <DocRow key={doc.id} doc={doc} />
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

function DocRow({ doc }: { doc: DocumentRecord }) {
  const status = STATUS[doc.status];
  const expiring = doc.valid_until && new Date(doc.valid_until).getTime() < Date.now() + 60 * 86400000;

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 sm:px-6">
      <div className="flex min-w-0 gap-3">
        <Icon name="doc" className="mt-0.5 shrink-0 text-forest-600" />
        <div className="min-w-0">
          <p className="font-semibold text-ink">{doc.title}</p>
          <p className="truncate text-[0.8125rem] text-ink-2">
            {doc.file_name} · {doc.size_kb} KB · added {shortDate(doc.uploaded_at)}
          </p>
          {doc.verified_by && (
            <p className="mt-0.5 text-[0.8125rem] text-ink-3">Checked by {doc.verified_by} on {shortDate(doc.verified_at)}</p>
          )}
          {doc.extraction && !doc.extraction.reviewed && (
            <p className="mt-1 text-[0.8125rem] font-semibold text-gold-700">Waiting for you to check what we read</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <Badge tone={status.tone}>{status.label}</Badge>
        {doc.valid_until && (
          <span className={`text-[0.8125rem] ${expiring ? 'font-semibold text-warn' : 'text-ink-3'}`}>
            {expiring ? 'expires' : 'valid until'} {shortDate(doc.valid_until)}
          </span>
        )}
      </div>
    </li>
  );
}
