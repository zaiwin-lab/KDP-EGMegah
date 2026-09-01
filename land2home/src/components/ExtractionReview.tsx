import { useState } from 'react';
import { Badge, Button, Icon, Input } from '@/components/ui';
import type { ExtractedField } from '@/lib/types';

/* Extracted values are always shown back before they are used. Nothing is
   accepted silently, low-certainty and conflicting values are called out,
   and every value stays editable. Confirming here means "these are the
   right values to prefill" — it does not mean the document is verified.
   Verification is a separate act by a KOBIS or KPSM officer. */
export function ExtractionReview({
  fields,
  notes,
  source,
  onConfirm,
  onDiscard,
}: {
  fields: ExtractedField[];
  notes: string[];
  source: 'assisted' | 'local';
  onConfirm: (fields: ExtractedField[]) => void | Promise<void>;
  onDiscard?: () => void;
}) {
  const [values, setValues] = useState<ExtractedField[]>(fields);
  const [busy, setBusy] = useState(false);

  const update = (index: number, patch: Partial<ExtractedField>) =>
    setValues((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));

  const conflicts = values.filter((f) => f.conflicts_with).length;
  const uncertain = values.filter((f) => f.confidence !== 'high').length;
  const blank = values.filter((f) => !f.value.trim()).length;
  const accepted = values.filter((f) => f.accepted).length;

  return (
    <div className="rounded-2xl border border-gold-500/40 bg-gold-100/50">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gold-500/25 px-5 py-4">
        <div>
          <p className="flex items-center gap-2 font-semibold text-ink">
            <Icon name="sparkle" size={17} className="text-gold-700" />
            We read your document. Please check what we found.
          </p>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-2">
            These are suggestions, not confirmed facts. Correct anything that is wrong, then confirm. A KOBIS
            officer still checks the document itself before it counts as verified.
          </p>
        </div>
        {source === 'local' && (
          <Badge tone="neutral">Offline reading</Badge>
        )}
      </div>

      {(conflicts > 0 || uncertain > 0 || blank > 0) && (
        <ul className="space-y-1.5 border-b border-gold-500/25 px-5 py-3.5 text-sm">
          {conflicts > 0 && (
            <li className="flex items-start gap-2 text-ink">
              <Icon name="alert" size={16} className="mt-0.5 text-alert" />
              {conflicts === 1 ? 'One value disagrees' : `${conflicts} values disagree`} with what your profile already holds. Please pick the right one.
            </li>
          )}
          {uncertain > 0 && (
            <li className="flex items-start gap-2 text-ink-2">
              <Icon name="info" size={16} className="mt-0.5 text-warn" />
              {uncertain === 1 ? 'One value was' : `${uncertain} values were`} read with less certainty.
            </li>
          )}
          {blank > 0 && (
            <li className="flex items-start gap-2 text-ink-2">
              <Icon name="info" size={16} className="mt-0.5 text-ink-3" />
              {blank === 1 ? 'One field' : `${blank} fields`} could not be read at all. Please type {blank === 1 ? 'it' : 'them'} in.
            </li>
          )}
        </ul>
      )}

      <ul className="divide-y divide-gold-500/20">
        {values.map((field, index) => (
          <li key={field.field} className="px-5 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label className="text-sm font-semibold text-ink" htmlFor={`x-${field.field}`}>
                {field.label}
              </label>
              <span className="flex items-center gap-2">
                {field.confidence !== 'high' && (
                  <Badge tone={field.confidence === 'low' ? 'warn' : 'neutral'}>
                    {field.confidence === 'low' ? 'Low certainty' : 'Please check'}
                  </Badge>
                )}
                {field.conflicts_with && <Badge tone="alert">Disagrees with your profile</Badge>}
              </span>
            </div>

            <Input
              id={`x-${field.field}`}
              className="mt-2"
              value={field.value}
              placeholder="Could not be read — please type it in"
              invalid={Boolean(field.conflicts_with)}
              onChange={(e) => update(index, { value: e.target.value, accepted: true })}
            />

            {field.conflicts_with && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ink-2">Your profile says</span>
                <span className="rounded-lg bg-surface px-2 py-1 font-semibold text-ink">{field.conflicts_with}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => update(index, { value: field.conflicts_with ?? '', conflicts_with: undefined, accepted: true })}
                >
                  Keep what I had
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => update(index, { conflicts_with: undefined, accepted: true })}
                >
                  Use the document
                </Button>
              </div>
            )}

            {!field.conflicts_with && (
              <label className="mt-2.5 flex items-center gap-2.5 text-sm text-ink-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-line-2 text-forest-700 focus:ring-forest-600/25"
                  checked={Boolean(field.accepted)}
                  onChange={(e) => update(index, { accepted: e.target.checked })}
                />
                Use this to fill in my form
              </label>
            )}
          </li>
        ))}
      </ul>

      {notes.length > 0 && (
        <ul className="space-y-1.5 border-t border-gold-500/25 px-5 py-3.5">
          {notes.map((note) => (
            <li key={note} className="flex items-start gap-2 text-sm leading-relaxed text-ink-2">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-ink-3" />
              {note}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-gold-500/25 px-5 py-4">
        <Button
          type="button"
          loading={busy}
          disabled={values.some((f) => f.conflicts_with)}
          onClick={async () => {
            setBusy(true);
            try {
              await onConfirm(values);
            } finally {
              setBusy(false);
            }
          }}
        >
          Confirm {accepted} {accepted === 1 ? 'value' : 'values'}
        </Button>
        {onDiscard && (
          <Button type="button" variant="ghost" onClick={onDiscard}>
            Do not use any of these
          </Button>
        )}
        {values.some((f) => f.conflicts_with) && (
          <p className="text-sm text-ink-2">Settle the disagreements above first.</p>
        )}
      </div>
    </div>
  );
}
