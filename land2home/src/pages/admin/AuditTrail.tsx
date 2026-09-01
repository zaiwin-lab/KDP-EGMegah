import { useEffect, useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, Icon, Panel, Select, Skeleton } from '@/components/ui';
import { dateTime } from '@/lib/format';
import type { AuditRecord, Role } from '@/lib/types';

const ROLE_LABEL: Record<Role, string> = { member: 'Member', kobis: 'KOBIS', kpsm: 'KPSM', egmh: 'EGMH' };
const ROLE_TONE: Record<Role, 'neutral' | 'info' | 'gold' | 'ok'> = {
  member: 'neutral', kobis: 'info', kpsm: 'gold', egmh: 'ok',
};

export default function AuditTrail() {
  const { payments } = usePortal();
  const repo = useRepo();
  const [records, setRecords] = useState<AuditRecord[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'payments'>('all');

  useEffect(() => {
    let alive = true;
    void repo.listAudit().then((rows) => {
      if (alive) setRecords(rows);
    });
    return () => {
      alive = false;
    };
  }, [repo, payments]);

  const shown = (records ?? []).filter((r) => (filter === 'all' ? true : r.entity === 'payment_stage'));

  return (
    <>
      <PageHead
        title="Audit trail"
        lead="Every membership check, land verification, document decision, progress publication and payment authorisation, with who did it and when."
        action={
          <Select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'payments')} className="sm:w-56">
            <option value="all">Everything</option>
            <option value="payments">Payment actions only</option>
          </Select>
        }
      />

      <Panel className="mb-5 panel-pad">
        <Assurance icon="lock">
          Audit records cannot be edited or deleted, by anyone. In the database this is enforced by a
          trigger, not by application code.
        </Assurance>
      </Panel>

      <Panel>
        {records === null ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : (
          <ol className="divide-y divide-line">
            {shown.map((record) => (
              <li key={record.id} className="px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{record.action}</span>
                      <Badge tone={ROLE_TONE[record.actor_role]}>{ROLE_LABEL[record.actor_role]}</Badge>
                      {record.entity === 'payment_stage' && record.human_authorised && (
                        <Badge tone="ok"><Icon name="person" size={12} /> Human action</Badge>
                      )}
                    </p>
                    <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-2">{record.detail}</p>
                    <p className="mt-1 text-[0.8125rem] text-ink-3">
                      {record.actor_name} · {record.entity.replace(/_/g, ' ')} · <span className="tnum">{record.entity_ref}</span>
                    </p>
                  </div>
                  <p className="tnum shrink-0 text-[0.8125rem] text-ink-2">{dateTime(record.at)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </>
  );
}
