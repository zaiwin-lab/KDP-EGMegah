import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortal, useRepo } from '@/state/portal';
import { PageHead } from '@/components/layout/AppShell';
import { Assurance, Badge, Button, FieldShell, Icon, Input, Panel, Select, Textarea } from '@/components/ui';
import { draftMemberSummary } from '@/ai/client';
import type { PhotoRef } from '@/lib/types';

const PLATES = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

/* EGMH writes the site report in its own language. The member-facing
   wording is drafted from it, shown here for editing, and only becomes
   visible to the member after a KOBIS coordinator publishes it. */
export default function EgmhUpdate() {
  const { project, milestones, actor, refresh } = usePortal();
  const repo = useRepo();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reported_on: new Date().toISOString().slice(0, 10),
    technical_summary: '',
    work_completed: '',
    current_work: '',
    next_activity: '',
    expected_next_date: '',
    delay_reason: '',
    milestone_id: '',
  });
  const [photos, setPhotos] = useState<PhotoRef[]>([]);
  const [summary, setSummary] = useState('');
  const [summarySource, setSummarySource] = useState<'assisted' | 'manual'>('manual');
  const [drafting, setDrafting] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!project) return null;

  const set = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const draft = async () => {
    setDrafting(true);
    try {
      const result = await draftMemberSummary({
        technical_summary: form.technical_summary,
        work_completed: form.work_completed,
        current_work: form.current_work,
        next_activity: form.next_activity,
        expected_next_date: form.expected_next_date,
        delay_reason: form.delay_reason || undefined,
      });
      setSummary(result.text);
      setSummarySource('assisted');
    } finally {
      setDrafting(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await repo.createProgressUpdate(
        {
          project_id: project.id,
          reported_on: form.reported_on,
          technical_summary: form.technical_summary,
          work_completed: form.work_completed,
          current_work: form.current_work,
          next_activity: form.next_activity,
          expected_next_date: form.expected_next_date,
          delay_reason: form.delay_reason || undefined,
          milestone_id: form.milestone_id || undefined,
          member_summary: summary,
          member_summary_source: summarySource,
          photos,
          submitted_by: actor.name,
        },
        actor,
      );
      await refresh();
      navigate('/egmh');
    } finally {
      setBusy(false);
    }
  };

  const canSubmit = form.work_completed.trim() && form.next_activity.trim() && summary.trim();

  return (
    <>
      <PageHead title="File a site update" lead={`${project.reference} · ${project.site_label}`} />

      <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <Panel>
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-[0.95rem] font-bold text-ink">What happened on site</h2>
              <p className="mt-1 text-sm text-ink-2">Write this as you normally would. Technical language is fine here.</p>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <FieldShell label="Date of the visit" htmlFor="reported_on" required>
                <Input id="reported_on" type="date" value={form.reported_on} onChange={(e) => set('reported_on', e.target.value)} required />
              </FieldShell>

              <FieldShell label="Milestone this relates to" htmlFor="milestone">
                <Select id="milestone" value={form.milestone_id} onChange={(e) => set('milestone_id', e.target.value)}>
                  <option value="">Not tied to a milestone</option>
                  {milestones.map((m) => (
                    <option key={m.id} value={m.id}>{m.sequence}. {m.title}</option>
                  ))}
                </Select>
              </FieldShell>

              <div className="sm:col-span-2">
                <FieldShell label="Site report" htmlFor="tech" required>
                  <Textarea
                    id="tech"
                    value={form.technical_summary}
                    onChange={(e) => set('technical_summary', e.target.value)}
                    placeholder="Superstructure certified at 65%. RC columns and roof beams cast; formwork struck."
                    required
                  />
                </FieldShell>
              </div>

              <FieldShell label="Work completed" htmlFor="done" required>
                <Textarea id="done" className="min-h-[5rem]" value={form.work_completed} onChange={(e) => set('work_completed', e.target.value)} required />
              </FieldShell>

              <FieldShell label="Current work" htmlFor="current" required>
                <Textarea id="current" className="min-h-[5rem]" value={form.current_work} onChange={(e) => set('current_work', e.target.value)} required />
              </FieldShell>

              <FieldShell label="Next activity" htmlFor="next" required>
                <Input id="next" value={form.next_activity} onChange={(e) => set('next_activity', e.target.value)} required />
              </FieldShell>

              <FieldShell label="Expected date for the next activity" htmlFor="nextdate" required>
                <Input id="nextdate" type="date" value={form.expected_next_date} onChange={(e) => set('expected_next_date', e.target.value)} required />
              </FieldShell>

              <div className="sm:col-span-2">
                <FieldShell
                  label="Delay explanation"
                  htmlFor="delay"
                  hint="Only if something has slipped. Say whether the handover date has moved."
                >
                  <Textarea id="delay" className="min-h-[4.5rem]" value={form.delay_reason} onChange={(e) => set('delay_reason', e.target.value)} />
                </FieldShell>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-[0.95rem] font-bold text-ink">Photographs</h2>
              <p className="mt-1 text-sm text-ink-2">Dated site photographs supporting this update.</p>
            </div>
            <div className="px-5 py-5">
              <input
                type="file"
                accept="image/*"
                multiple
                className="field file:mr-3 file:rounded-lg file:border-0 file:bg-forest-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-forest-800"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setPhotos((prev) => [
                    ...prev,
                    ...files.map((file, i) => ({
                      id: `ph_${Date.now()}_${i}`,
                      caption: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
                      swatch: PLATES[(prev.length + i) % PLATES.length],
                      taken_on: form.reported_on,
                    })),
                  ]);
                  e.target.value = '';
                }}
              />
              {photos.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {photos.map((photo, i) => (
                    <li key={photo.id} className="flex items-center gap-3">
                      <Icon name="photo" size={17} className="text-forest-600" />
                      <Input
                        value={photo.caption}
                        onChange={(e) =>
                          setPhotos((prev) => prev.map((p, j) => (j === i ? { ...p, caption: e.target.value } : p)))
                        }
                        className="flex-1"
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <div className="border-b border-line px-5 py-4">
              <h2 className="flex flex-wrap items-center gap-2 text-[0.95rem] font-bold text-ink">
                What the member will read
                {summarySource === 'assisted' && <Badge tone="gold"><Icon name="sparkle" size={12} /> assisted draft</Badge>}
              </h2>
              <p className="mt-1 text-sm text-ink-2">
                Plain language, no percentages, no jargon. Edit it freely — you are responsible for what it says.
              </p>
            </div>
            <div className="px-5 py-5">
              <Button
                type="button"
                variant="secondary"
                loading={drafting}
                disabled={!form.work_completed.trim()}
                onClick={draft}
              >
                <Icon name="sparkle" size={17} />
                Draft it from my report
              </Button>
              {!form.work_completed.trim() && (
                <p className="mt-2 text-[0.8125rem] text-ink-3">Fill in "work completed" first.</p>
              )}

              <Textarea
                className="mt-4 min-h-[10rem]"
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  setSummarySource('manual');
                }}
                placeholder="The main house structure is complete. Roof installation is the next activity."
              />

              <div className="mt-4">
                <Assurance icon="person">
                  This is not published when you submit it. A KOBIS coordinator reads it first and publishes
                  it to the member, and that action is recorded.
                </Assurance>
              </div>
            </div>
          </Panel>

          <Button type="submit" size="lg" loading={busy} disabled={!canSubmit} className="w-full">
            Submit for publication
          </Button>
          {!canSubmit && (
            <p className="text-sm text-ink-2">
              Fill in the work completed, the next activity, and the member wording before submitting.
            </p>
          )}
        </div>
      </form>
    </>
  );
}
