import { useState } from 'react';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import {
  Assurance, Badge, Button, EmptyState, FieldShell, Icon, Input, Panel, PanelHeader, Select, Textarea,
} from '@/components/ui';
import { SitePhoto } from '@/components/art/SitePhoto';
import { dateTime, shortDate } from '@/lib/format';
import type { ChecklistItem, Defect } from '@/lib/types';

const AREAS = ['Outside', 'Inside', 'Water', 'Electrical', 'Kitchen', 'Bedrooms', 'Bathrooms', 'Other'];

export default function Inspection() {
  const { project, inspection, defects, handover, warranties, warrantyRequests, actor, refresh } = usePortal();
  const repo = useRepo();

  if (!project || !inspection) {
    return (
      <>
        <PageHead title="Inspection and keys" />
        <Panel>
          <EmptyState title="Not yet">
            When your house is finished you will walk through it with KOBIS and EGMH, list anything that
            needs putting right, and collect your keys once you are happy.
          </EmptyState>
        </Panel>
      </>
    );
  }

  const open = defects.filter((d) => d.status !== 'resolved');
  const resolved = defects.filter((d) => d.status === 'resolved');

  return (
    <>
      <PageHead
        title="Inspection, handover and warranty"
        lead="Nothing is handed over until you have walked through the house and everything you raised has been put right."
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <InspectionPanel status={inspection.status} scheduledFor={inspection.scheduled_for} checklist={inspection.checklist} />

          <Panel>
            <PanelHeader
              title="Items to put right"
              description="Anything you or the inspector notice. Raise as many as you need, at any time."
              action={<Badge tone={open.length ? 'warn' : 'ok'}>{open.length} open</Badge>}
            />
            {defects.length === 0 ? (
              <EmptyState title="Nothing raised yet">
                When you walk through the house, anything that is not right goes here and stays visible until
                it is fixed and you have confirmed you are happy with it.
              </EmptyState>
            ) : (
              <ul className="divide-y divide-line">
                {[...open, ...resolved].map((defect) => (
                  <DefectRow
                    key={defect.id}
                    defect={defect}
                    onConfirm={async () => {
                      await repo.updateDefect(defect.id, { member_confirmed: true }, actor);
                      await refresh();
                    }}
                  />
                ))}
              </ul>
            )}
            <div className="border-t border-line p-5 sm:p-6">
              <RaiseDefect projectId={project.id} onDone={refresh} />
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <PanelHeader title="Handover" description="The day you receive your keys." />
            <div className="px-5 py-5 sm:px-6">
              {handover?.status === 'completed' ? (
                <>
                  <Badge tone="ok"><Icon name="check" size={13} /> Keys released</Badge>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">
                    Handed over on {shortDate(handover.keys_released_at)}. EGMH still puts right anything covered
                    by the defects liability period until {shortDate(handover.defects_liability_until)}.
                  </p>
                </>
              ) : handover?.appointment_at ? (
                <>
                  <Badge tone="gold">Appointment offered</Badge>
                  <p className="mt-3 font-semibold text-ink">{dateTime(handover.appointment_at)}</p>
                  <p className="text-sm text-ink-2">{handover.location}</p>
                  <Button
                    className="mt-4"
                    onClick={async () => {
                      await repo.updateHandover(project.id, { status: 'confirmed' }, actor);
                      await refresh();
                    }}
                  >
                    Confirm this appointment
                  </Button>
                </>
              ) : (
                <>
                  <Badge>Not ready yet</Badge>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{handover?.notes}</p>
                </>
              )}

              <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-ink-2">
                <li className="font-semibold text-ink">Who will be there</li>
                {(handover?.attendees ?? []).map((person) => (
                  <li key={person} className="flex items-center gap-2">
                    <Icon name="person" size={15} className="text-ink-3" />
                    {person}
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="My digital home file" description="Everything about your house, kept in one place after handover." />
            <ul className="divide-y divide-line">
              {[
                ['Signed building contract', 'doc'],
                ['Payment records for all four releases', 'money'],
                ['Every progress photograph', 'photo'],
                ['Inspection report and rectification evidence', 'search'],
                ['Warranties and appliance manuals', 'key'],
              ].map(([label, icon]) => (
                <li key={label} className="flex items-center gap-3 px-5 py-3 sm:px-6">
                  <Icon name={icon} size={17} className="text-forest-600" />
                  <span className="text-sm text-ink">{label}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-4 sm:px-6">
              <Button variant="secondary" size="sm" disabled>
                Download my home file
              </Button>
              <p className="mt-2 text-[0.8125rem] text-ink-3">Available once your keys have been handed over.</p>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Warranties" description="What is covered, by whom, and until when." />
            <ul className="divide-y divide-line">
              {warranties.map((w) => (
                <li key={w.id} className="px-5 py-3.5 sm:px-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-ink">{w.item}</p>
                    <p className="shrink-0 text-[0.8125rem] text-ink-2">until {shortDate(w.until)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-2">{w.covers}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-3">{w.provider}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-5 sm:p-6">
              <WarrantyForm projectId={project.id} onDone={refresh} />
              {warrantyRequests.length > 0 && (
                <ul className="mt-5 space-y-2 border-t border-line pt-4">
                  {warrantyRequests.map((r) => (
                    <li key={r.id} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-ink">
                        <span className="tnum font-semibold">{r.reference}</span> · {r.category}
                      </span>
                      <Badge tone={r.status === 'resolved' ? 'ok' : r.status === 'in_progress' ? 'info' : 'warn'}>
                        {r.status === 'in_progress' ? 'In progress' : r.status === 'resolved' ? 'Resolved' : 'Open'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="mt-5 panel-pad">
        <Assurance icon="person">
          The inspection result, the rectification evidence and the handover are all recorded by named
          people. Nothing here is closed off automatically.
        </Assurance>
      </Panel>
    </>
  );
}

function InspectionPanel({
  status,
  scheduledFor,
  checklist,
}: {
  status: string;
  scheduledFor?: string;
  checklist: ChecklistItem[];
}) {
  const areas = [...new Set(checklist.map((c) => c.area))];
  const passed = checklist.filter((c) => c.result === 'pass').length;

  return (
    <Panel>
      <PanelHeader
        title="Joint inspection"
        description="You, KOBIS and EGMH walk through the house together and check every item on this list."
        action={
          status === 'completed' ? (
            <Badge tone="ok">{passed} of {checklist.length} passed</Badge>
          ) : status === 'scheduled' ? (
            <Badge tone="gold">{dateTime(scheduledFor)}</Badge>
          ) : (
            <Badge>Not scheduled yet</Badge>
          )
        }
      />
      <div className="px-5 py-5 sm:px-6">
        {status === 'not_scheduled' && (
          <p className="mb-5 rounded-xl bg-forest-50 p-4 text-sm leading-relaxed text-ink-2">
            Your coordinator arranges this once the house is finished. Here is what will be checked, so you
            know what to look for on the day.
          </p>
        )}
        <div className="space-y-5">
          {areas.map((area) => (
            <div key={area}>
              <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-ink-3">{area}</p>
              <ul className="mt-2 space-y-1.5">
                {checklist
                  .filter((c) => c.area === area)
                  .map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5 text-sm">
                      <Icon
                        name={item.result === 'pass' ? 'check' : item.result === 'attention' ? 'alert' : 'info'}
                        size={16}
                        className={
                          item.result === 'pass' ? 'mt-0.5 text-ok' : item.result === 'attention' ? 'mt-0.5 text-warn' : 'mt-0.5 text-ink-3'
                        }
                      />
                      <span className={item.result === 'pending' ? 'text-ink-2' : 'text-ink'}>{item.item}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function DefectRow({ defect, onConfirm }: { defect: Defect; onConfirm: () => Promise<void> }) {
  const tone = defect.status === 'resolved' ? 'ok' : defect.status === 'in_progress' ? 'info' : 'warn';
  const label = defect.status === 'resolved' ? 'Resolved' : defect.status === 'in_progress' ? 'In progress' : 'Open';

  return (
    <li className="px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
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

      {defect.rectification_note && (
        <div className="mt-3 rounded-xl bg-forest-50 p-4">
          <p className="text-sm font-semibold text-ink">What EGMH did</p>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{defect.rectification_note}</p>
          {defect.rectification_photos && defect.rectification_photos.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:max-w-sm">
              {defect.rectification_photos.map((photo) => (
                <div key={photo.id} className="aspect-[4/3] overflow-hidden rounded-lg">
                  <SitePhoto plate={photo.swatch} />
                </div>
              ))}
            </div>
          )}
          {defect.status === 'resolved' && !defect.member_confirmed && (
            <Button size="sm" className="mt-3" onClick={onConfirm}>
              Yes, I am happy with this
            </Button>
          )}
          {defect.member_confirmed && (
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-ok">
              <Icon name="check" size={16} /> You confirmed this is put right
            </p>
          )}
        </div>
      )}
    </li>
  );
}

function RaiseDefect({ projectId, onDone }: { projectId: string; onDone: () => Promise<void> }) {
  const { actor, profile } = usePortal();
  const repo = useRepo();
  const [open, setOpen] = useState(false);
  const [area, setArea] = useState(AREAS[0]);
  const [description, setDescription] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Icon name="alert" size={17} />
        Raise something that is not right
      </Button>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description.trim()) return;
    setBusy(true);
    try {
      await repo.createDefect(
        {
          project_id: projectId,
          area,
          description: description.trim(),
          reported_by: profile?.full_name ?? actor.name,
          reported_on: new Date().toISOString().slice(0, 10),
          priority: 'routine',
          photos: photoName ? [{ id: `ph_${Date.now()}`, caption: photoName, swatch: 'b', taken_on: new Date().toISOString().slice(0, 10) }] : [],
        },
        actor,
      );
      await onDone();
      setOpen(false);
      setDescription('');
      setPhotoName('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <FieldShell label="Where is it?" htmlFor="defect-area" required>
        <Select id="defect-area" value={area} onChange={(e) => setArea(e.target.value)}>
          {AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </Select>
      </FieldShell>

      <FieldShell
        label="What is wrong?"
        htmlFor="defect-desc"
        required
        hint="Plain words are fine. For example: the tap in the back bathroom drips when it is turned off."
      >
        <Textarea
          id="defect-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you noticed"
          required
        />
      </FieldShell>

      <FieldShell label="Add a photo" htmlFor="defect-photo" hint="A photo helps EGMH bring the right tools the first time.">
        <Input
          id="defect-photo"
          type="file"
          accept="image/*"
          className="file:mr-3 file:rounded-lg file:border-0 file:bg-forest-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-forest-800"
          onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? '')}
        />
      </FieldShell>

      <div className="flex gap-2">
        <Button type="submit" loading={busy}>Raise this item</Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  );
}

function WarrantyForm({ projectId, onDone }: { projectId: string; onDone: () => Promise<void> }) {
  const { actor } = usePortal();
  const repo = useRepo();
  const [category, setCategory] = useState('Water and plumbing');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description.trim()) return;
    setBusy(true);
    try {
      await repo.createWarrantyRequest(projectId, category, description.trim(), actor);
      await onDone();
      setDescription('');
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm font-semibold text-ink">Ask for help under warranty</p>
      <FieldShell label="What kind of problem?" htmlFor="wr-cat" required>
        <Select id="wr-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
          {['Water and plumbing', 'Electrical', 'Roof and leaks', 'Doors and windows', 'Finishes', 'Something else'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </FieldShell>
      <FieldShell label="Tell us what is happening" htmlFor="wr-desc" required>
        <Textarea id="wr-desc" value={description} onChange={(e) => { setDescription(e.target.value); setSent(false); }} required />
      </FieldShell>
      <Button type="submit" variant="secondary" loading={busy}>Send to EGMH</Button>
      {sent && <p className="text-sm font-semibold text-ok">Sent. EGMH will be in touch to arrange a visit.</p>}
    </form>
  );
}
