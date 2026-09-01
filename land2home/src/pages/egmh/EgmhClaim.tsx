import { useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, Button, EmptyState, FieldShell, Icon, Panel, Select, Textarea } from '@/components/ui';
import { PaymentWorkflow } from '@/components/PaymentWorkflow';
import { PAYMENT_STATUS_LABEL } from '@/lib/journey';
import { myr } from '@/lib/format';

export default function EgmhClaim() {
  const { payments, actor, refresh } = usePortal();
  const repo = useRepo();

  const claimable = payments.filter((p) => p.status === 'not_due');
  const [stageId, setStageId] = useState(claimable[0]?.id ?? '');
  const [evidence, setEvidence] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const inFlight = payments.filter((p) => p.status !== 'not_due' && p.status !== 'paid');

  return (
    <>
      <PageHead
        title="Payment claim"
        lead="Submit a claim with the evidence for the stage you have completed. KOBIS verifies it, then KPSM authorises the release."
      />

      <Panel className="mb-5 panel-pad">
        <Assurance icon="lock">
          Submitting a claim starts the process; it does not release money. Verification and authorisation
          are separate human decisions taken by KOBIS and KPSM.
        </Assurance>
      </Panel>

      {inFlight.length > 0 && (
        <Panel className="mb-5">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[0.95rem] font-bold text-ink">Claims in progress</h2>
          </div>
          <ul className="divide-y divide-line">
            {inFlight.map((stage) => (
              <li key={stage.id} className="px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">
                    <span className="tnum">Release {stage.sequence}</span> · {stage.title}
                  </p>
                  <Badge tone="gold">{PAYMENT_STATUS_LABEL[stage.status]}</Badge>
                </div>
                <div className="mt-4">
                  <PaymentWorkflow stage={stage} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel>
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-[0.95rem] font-bold text-ink">Submit a new claim</h2>
        </div>
        {claimable.length === 0 ? (
          <EmptyState title="No release is claimable right now">
            Every release has either been claimed or already paid.
          </EmptyState>
        ) : (
          <form
            className="space-y-4 px-5 py-5 sm:px-6"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!stageId || !evidence.trim()) return;
              setBusy(true);
              try {
                await repo.submitClaim(stageId, evidence.trim(), actor);
                await refresh();
                setEvidence('');
                setFiles([]);
                setDone(true);
              } finally {
                setBusy(false);
              }
            }}
          >
            <FieldShell label="Which release?" htmlFor="stage" required>
              <Select id="stage" value={stageId} onChange={(e) => { setStageId(e.target.value); setDone(false); }}>
                {claimable.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    Release {stage.sequence} — {stage.title} ({myr(stage.amount)})
                  </option>
                ))}
              </Select>
            </FieldShell>

            <FieldShell
              label="Evidence supporting the claim"
              htmlFor="evidence"
              required
              hint="What proves the stage is complete: completion records, test results, dated photographs."
            >
              <Textarea
                id="evidence"
                value={evidence}
                onChange={(e) => { setEvidence(e.target.value); setDone(false); }}
                placeholder="Structural completion record, concrete cube test results and dated site photographs."
                required
              />
            </FieldShell>

            <FieldShell label="Attach the evidence files" htmlFor="evidence-files">
              <input
                id="evidence-files"
                type="file"
                multiple
                className="field file:mr-3 file:rounded-lg file:border-0 file:bg-forest-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-forest-800"
                onChange={(e) => {
                  setFiles(Array.from(e.target.files ?? []).map((f) => f.name));
                  e.target.value = '';
                }}
              />
            </FieldShell>

            {files.length > 0 && (
              <ul className="space-y-1.5 text-sm text-ink-2">
                {files.map((name) => (
                  <li key={name} className="flex items-center gap-2">
                    <Icon name="doc" size={16} className="text-forest-600" />
                    {name}
                  </li>
                ))}
              </ul>
            )}

            <Button type="submit" loading={busy} disabled={!evidence.trim()}>
              Submit the claim
            </Button>
            {done && (
              <p className="flex items-center gap-2 text-sm font-semibold text-ok">
                <Icon name="check" size={16} /> Submitted. KOBIS has it for technical verification.
              </p>
            )}
          </form>
        )}
      </Panel>
    </>
  );
}
