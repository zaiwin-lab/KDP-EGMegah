import type {
  Application, AuditRecord, Defect, DocumentRecord, ExtractedField, Handover, Inspection,
  LandParcel, MemberProfile, Milestone, Notification, Org, PaymentStage, ProgressUpdate,
  Project, UserAccount, WarrantyItem, WarrantyRequest,
} from '@/lib/types';
import type { Actor, NewDocument, NewProgressUpdate, Repository } from './repository';
import * as seed from './demoSeed';

interface Store {
  version: number;
  profile: MemberProfile;
  land: LandParcel;
  application: Application;
  project: Project;
  milestones: Milestone[];
  updates: ProgressUpdate[];
  payments: PaymentStage[];
  documents: DocumentRecord[];
  inspection: Inspection;
  defects: Defect[];
  handover: Handover;
  warranties: WarrantyItem[];
  warrantyRequests: WarrantyRequest[];
  notifications: Notification[];
  audit: AuditRecord[];
}

const KEY = 'l2h.demo.v1';
const SESSION_KEY = 'l2h.session.v1';
const VERSION = 1;

const fresh = (): Store => ({
  version: VERSION,
  profile: structuredClone(seed.PROFILE),
  land: structuredClone(seed.LAND),
  application: structuredClone(seed.APPLICATION),
  project: structuredClone(seed.PROJECT),
  milestones: structuredClone(seed.MILESTONES),
  updates: structuredClone(seed.PROGRESS_UPDATES),
  payments: structuredClone(seed.PAYMENT_STAGES),
  documents: structuredClone(seed.DOCUMENTS),
  inspection: structuredClone(seed.INSPECTION),
  defects: structuredClone(seed.DEFECTS),
  handover: structuredClone(seed.HANDOVER),
  warranties: structuredClone(seed.WARRANTIES),
  warrantyRequests: structuredClone(seed.WARRANTY_REQUESTS),
  notifications: structuredClone(seed.NOTIFICATIONS),
  audit: structuredClone(seed.AUDIT),
});

const safeLocal = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* Private mode or blocked storage: the demo still runs in memory. */
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* no-op */
    }
  },
};

const load = (): Store => {
  const raw = safeLocal.get(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Store;
      if (parsed.version === VERSION) return parsed;
    } catch {
      /* Corrupt or stale demo state: fall through and reseed. */
    }
  }
  return fresh();
};

const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* In-browser store for the demonstration account. Writes persist to
   localStorage so a member can leave and resume, and "Reset demo" puts
   everything back to the seeded state. */
export class LocalRepository implements Repository {
  readonly mode = 'demo' as const;
  private store: Store = load();

  private persist() {
    safeLocal.set(KEY, JSON.stringify(this.store));
  }

  private log(actor: Actor, action: string, entity: string, ref: string, detail: string) {
    const record: AuditRecord = {
      id: uid('au'),
      org_id: seed.ORG.id,
      at: nowIso(),
      actor_name: actor.name,
      actor_role: actor.role,
      action,
      entity,
      entity_ref: ref,
      detail,
      human_authorised: true,
    };
    this.store.audit = [record, ...this.store.audit];
  }

  private notify(title: string, body: string, channel: Notification['channel'], link?: string) {
    this.store.notifications = [
      {
        id: uid('nt'),
        org_id: seed.ORG.id,
        profile_id: this.store.profile.id,
        created_at: nowIso(),
        title,
        body,
        channel,
        read: false,
        link,
      },
      ...this.store.notifications,
    ];
  }

  resetDemo() {
    this.store = fresh();
    this.persist();
  }

  /* ── auth ─────────────────────────────────────────────────────── */

  async signIn(email: string): Promise<UserAccount> {
    await sleep(260);
    const user = seed.USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      throw new Error('We could not find an account with that email address.');
    }
    safeLocal.set(SESSION_KEY, user.id);
    return user;
  }

  async signOut() {
    safeLocal.remove(SESSION_KEY);
  }

  async getSession(): Promise<UserAccount | null> {
    const id = safeLocal.get(SESSION_KEY);
    return seed.USERS.find((u) => u.id === id) ?? null;
  }

  async getOrg(): Promise<Org> {
    return seed.ORG;
  }

  async listUsers(): Promise<UserAccount[]> {
    return seed.USERS;
  }

  /* ── profile, land, application ───────────────────────────────── */

  async getProfile(userId: string) {
    return this.store.profile.user_id === userId ? this.store.profile : null;
  }

  async updateProfile(_profileId: string, patch: Partial<MemberProfile>, actor: Actor) {
    this.store.profile = { ...this.store.profile, ...patch, updated_at: nowIso() };
    this.log(actor, 'Profile updated', 'member_profile', this.store.profile.membership_no, Object.keys(patch).join(', '));
    this.persist();
    return this.store.profile;
  }

  async getLand(profileId: string) {
    return this.store.land.profile_id === profileId ? this.store.land : null;
  }

  async saveLand(_profileId: string, patch: Partial<LandParcel>, actor: Actor) {
    this.store.land = { ...this.store.land, ...patch };
    this.log(actor, 'Land details updated', 'land', this.store.land.title_no, Object.keys(patch).join(', '));
    this.persist();
    return this.store.land;
  }

  async getApplication(profileId: string) {
    return this.store.application.profile_id === profileId ? this.store.application : null;
  }

  async saveApplication(_profileId: string, patch: Partial<Application>) {
    this.store.application = { ...this.store.application, ...patch, updated_at: nowIso() };
    this.persist();
    return this.store.application;
  }

  async submitApplication(_applicationId: string, actor: Actor) {
    this.store.application = {
      ...this.store.application,
      status: 'submitted',
      submitted_at: nowIso(),
      updated_at: nowIso(),
    };
    this.log(actor, 'Application submitted', 'application', this.store.application.reference, `Selected ${this.store.application.house_type ?? 'no type'}.`);
    this.notify('Application received', 'KOBIS has your application and will confirm the next step within two working days.', 'action', '/app/journey');
    this.persist();
    return this.store.application;
  }

  /* ── project, milestones, progress ────────────────────────────── */

  async listProjects() {
    return [this.store.project];
  }

  async getProjectForProfile(profileId: string) {
    return this.store.project.profile_id === profileId ? this.store.project : null;
  }

  async getProject(projectId: string) {
    return this.store.project.id === projectId ? this.store.project : null;
  }

  async listMilestones(projectId: string) {
    return this.store.milestones
      .filter((m) => m.project_id === projectId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  async listProgressUpdates(projectId: string, opts?: { includeUnpublished?: boolean }) {
    return this.store.updates
      .filter((u) => u.project_id === projectId && (opts?.includeUnpublished || u.published))
      .sort((a, b) => b.reported_on.localeCompare(a.reported_on));
  }

  async createProgressUpdate(input: NewProgressUpdate, actor: Actor) {
    const update: ProgressUpdate = {
      ...input,
      id: uid('pu'),
      org_id: seed.ORG.id,
      published: false,
    };
    this.store.updates = [update, ...this.store.updates];
    this.log(actor, 'Progress update submitted', 'progress_update', update.id, `${input.work_completed.slice(0, 90)}…`);
    this.persist();
    return update;
  }

  async publishProgressUpdate(updateId: string, actor: Actor) {
    const update = this.store.updates.find((u) => u.id === updateId);
    if (!update) throw new Error('That update no longer exists.');
    update.published = true;
    update.verified_by = actor.name;
    update.verified_at = nowIso();
    this.log(actor, 'Progress update published', 'progress_update', update.id, 'Member wording reviewed and approved before publishing.');
    this.notify('New site update and photographs', update.member_summary.slice(0, 120), 'progress', '/app/progress');
    this.persist();
    return update;
  }

  /* ── payments ─────────────────────────────────────────────────── */

  async listPaymentStages(projectId: string) {
    return this.store.payments
      .filter((p) => p.project_id === projectId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  private stage(stageId: string) {
    const stage = this.store.payments.find((p) => p.id === stageId);
    if (!stage) throw new Error('That payment release no longer exists.');
    return stage;
  }

  async submitClaim(stageId: string, evidenceNote: string, actor: Actor) {
    const stage = this.stage(stageId);
    stage.status = 'claim_submitted';
    stage.claim_submitted_at = nowIso();
    stage.claim_reference = stage.claim_reference ?? `CLM-0417-0${stage.sequence}`;
    stage.evidence_note = evidenceNote;
    this.log(actor, 'Payment claim submitted', 'payment_stage', stage.claim_reference, `Release ${stage.sequence} claimed with evidence attached.`);
    this.notify('A payment claim has been submitted', `EGMH has claimed release ${stage.sequence}. It now goes through technical verification before KPSM reviews it.`, 'payment', '/app/payments');
    this.persist();
    return stage;
  }

  async recordVerification(stageId: string, actor: Actor) {
    const stage = this.stage(stageId);
    stage.status = 'awaiting_authorisation';
    stage.verified_by = actor.name;
    stage.verified_at = nowIso();
    this.log(actor, 'Technical verification recorded', 'payment_stage', stage.claim_reference ?? stage.id, 'Evidence checked against the site record. Passed to KPSM for authorisation.');
    this.persist();
    return stage;
  }

  async authorisePayment(stageId: string, actor: Actor) {
    const stage = this.stage(stageId);
    stage.status = 'authorised';
    stage.authorised_by = actor.name;
    stage.authorised_at = nowIso();
    this.log(actor, 'Payment authorised', 'payment_stage', stage.claim_reference ?? stage.id, `Release ${stage.sequence} authorised by a KPSM officer after verification.`);
    this.persist();
    return stage;
  }

  async recordPayment(stageId: string, reference: string, actor: Actor) {
    const stage = this.stage(stageId);
    stage.status = 'paid';
    stage.paid_at = nowIso();
    stage.payment_reference = reference;
    stage.member_notified_at = nowIso();
    this.log(actor, 'Payment recorded', 'payment_stage', stage.claim_reference ?? stage.id, `Payment recorded against reference ${reference}.`);
    this.notify(`Release ${stage.sequence} has been paid`, `KPSM has recorded payment for ${stage.title.toLowerCase()}.`, 'payment', '/app/payments');
    this.persist();
    return stage;
  }

  /* ── documents ────────────────────────────────────────────────── */

  async listDocuments(profileId: string) {
    return this.store.documents
      .filter((d) => d.profile_id === profileId)
      .sort((a, b) => b.uploaded_at.localeCompare(a.uploaded_at));
  }

  async addDocument(input: NewDocument, actor: Actor) {
    const doc: DocumentRecord = {
      ...input,
      id: uid('doc'),
      org_id: seed.ORG.id,
      uploaded_at: nowIso(),
      status: 'pending_review',
    };
    this.store.documents = [doc, ...this.store.documents];
    this.log(actor, 'Document uploaded', 'document', doc.title, `${doc.file_name} (${doc.size_kb} KB) awaiting human review.`);
    this.persist();
    return doc;
  }

  async confirmExtraction(documentId: string, fields: ExtractedField[], actor: Actor) {
    const doc = this.store.documents.find((d) => d.id === documentId);
    if (!doc) throw new Error('That document no longer exists.');
    doc.extraction = { reviewed: true, fields, notes: doc.extraction?.notes ?? [] };
    const accepted = fields.filter((f) => f.accepted);
    this.log(actor, 'Extracted details confirmed by member', 'document', doc.title, `${accepted.length} of ${fields.length} suggested values accepted. Values remain unverified until a KOBIS or KPSM officer checks the document.`);
    this.persist();
    return doc;
  }

  /* ── inspection, defects, handover, warranty ──────────────────── */

  async getInspection(projectId: string) {
    return this.store.inspection.project_id === projectId ? this.store.inspection : null;
  }

  async scheduleInspection(_projectId: string, when: string, actor: Actor) {
    this.store.inspection = { ...this.store.inspection, scheduled_for: when, status: 'scheduled' };
    this.log(actor, 'Inspection scheduled', 'inspection', this.store.inspection.id, `Joint inspection set for ${when}.`);
    this.notify('Your joint inspection has been scheduled', 'You will walk through the house with KOBIS and EGMH and note anything that needs putting right.', 'handover', '/app/inspection');
    this.persist();
    return this.store.inspection;
  }

  async setChecklistResult(_projectId: string, itemId: string, result: 'pending' | 'pass' | 'attention', note: string | undefined, actor: Actor) {
    const item = this.store.inspection.checklist.find((c) => c.id === itemId);
    if (item) {
      item.result = result;
      item.note = note;
      this.log(actor, 'Inspection item recorded', 'inspection', this.store.inspection.id, `${item.item}: ${result}`);
    }
    this.persist();
    return this.store.inspection;
  }

  async listDefects(projectId: string) {
    return this.store.defects
      .filter((d) => d.project_id === projectId)
      .sort((a, b) => b.reported_on.localeCompare(a.reported_on));
  }

  async createDefect(input: Omit<Defect, 'id' | 'org_id' | 'reference' | 'status'>, actor: Actor) {
    const defect: Defect = {
      ...input,
      id: uid('def'),
      org_id: seed.ORG.id,
      reference: `ITM-${String(this.store.defects.length + 1).padStart(3, '0')}`,
      status: 'open',
    };
    this.store.defects = [defect, ...this.store.defects];
    this.log(actor, 'Item raised for rectification', 'defect', defect.reference, `${defect.area}: ${defect.description.slice(0, 90)}`);
    this.persist();
    return defect;
  }

  async updateDefect(defectId: string, patch: Partial<Defect>, actor: Actor) {
    const defect = this.store.defects.find((d) => d.id === defectId);
    if (!defect) throw new Error('That item no longer exists.');
    Object.assign(defect, patch);
    if (patch.status === 'resolved') {
      defect.resolved_on = new Date().toISOString().slice(0, 10);
      this.notify('An item has been put right', `${defect.reference} — ${defect.area}. Please take a look and confirm you are happy with it.`, 'action', '/app/inspection');
    }
    this.log(actor, 'Rectification updated', 'defect', defect.reference, patch.status ? `Status set to ${patch.status}.` : 'Details updated.');
    this.persist();
    return defect;
  }

  async getHandover(projectId: string) {
    return this.store.handover.project_id === projectId ? this.store.handover : null;
  }

  async updateHandover(_projectId: string, patch: Partial<Handover>, actor: Actor) {
    this.store.handover = { ...this.store.handover, ...patch };
    this.log(actor, 'Handover updated', 'handover', this.store.handover.id, patch.status ? `Status set to ${patch.status}.` : 'Details updated.');
    this.persist();
    return this.store.handover;
  }

  async listWarranties(projectId: string) {
    return this.store.warranties.filter((w) => w.project_id === projectId);
  }

  async listWarrantyRequests(projectId: string) {
    return this.store.warrantyRequests
      .filter((w) => w.project_id === projectId)
      .sort((a, b) => b.raised_on.localeCompare(a.raised_on));
  }

  async createWarrantyRequest(projectId: string, category: string, description: string, actor: Actor) {
    const request: WarrantyRequest = {
      id: uid('wr'),
      org_id: seed.ORG.id,
      project_id: projectId,
      reference: `WR-${String(this.store.warrantyRequests.length + 1).padStart(3, '0')}`,
      raised_on: new Date().toISOString().slice(0, 10),
      category,
      description,
      status: 'open',
    };
    this.store.warrantyRequests = [request, ...this.store.warrantyRequests];
    this.log(actor, 'Warranty request raised', 'warranty_request', request.reference, `${category}: ${description.slice(0, 90)}`);
    this.persist();
    return request;
  }

  /* ── notifications, audit ─────────────────────────────────────── */

  async listNotifications(profileId: string) {
    return this.store.notifications
      .filter((n) => n.profile_id === profileId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async markNotificationRead(id: string) {
    const n = this.store.notifications.find((x) => x.id === id);
    if (n) n.read = true;
    this.persist();
  }

  async markAllNotificationsRead(profileId: string) {
    this.store.notifications.forEach((n) => {
      if (n.profile_id === profileId) n.read = true;
    });
    this.persist();
  }

  async listAudit() {
    return [...this.store.audit].sort((a, b) => b.at.localeCompare(a.at));
  }
}
