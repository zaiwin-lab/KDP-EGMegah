import type {
  Application, AuditRecord, Defect, DocumentRecord, ExtractedField, Handover, Inspection,
  LandParcel, MemberProfile, Milestone, Notification, Org, PaymentStage, ProgressUpdate,
  Project, UserAccount, WarrantyItem, WarrantyRequest,
} from '@/lib/types';
import type { Actor, NewDocument, NewProgressUpdate, Repository } from './repository';
import { supabase, supabaseConfigured } from './supabaseClient';

export { supabaseConfigured };

const nowIso = () => new Date().toISOString();

/* Thin mapping onto Postgres. Access control is not implemented here on
   purpose: row-level security in supabase/schema.sql decides what each
   role can read and write, so a bug in this file cannot widen access. */
export class SupabaseRepository implements Repository {
  readonly mode = 'supabase' as const;

  private db = supabase();

  private async one<T>(table: string, match: Record<string, unknown>): Promise<T | null> {
    const { data, error } = await this.db.from(table).select('*').match(match).maybeSingle();
    if (error) throw new Error(error.message);
    return (data as T) ?? null;
  }

  private async many<T>(table: string, match: Record<string, unknown>, orderBy?: { column: string; ascending: boolean }): Promise<T[]> {
    let query = this.db.from(table).select('*').match(match);
    if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending });
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data as T[]) ?? [];
  }

  private async patch<T>(table: string, id: string, values: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.db.from(table).update(values).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data as T;
  }

  private async audit(actor: Actor, action: string, entity: string, ref: string, detail: string) {
    const { error } = await this.db.from('audit_records').insert({
      at: nowIso(),
      actor_name: actor.name,
      actor_role: actor.role,
      action,
      entity,
      entity_ref: ref,
      detail,
      human_authorised: true,
    });
    /* An audit write must never be silently dropped. */
    if (error) throw new Error(`Audit record could not be written: ${error.message}`);
  }

  /* ── auth ───────────────────────────────────────────────────── */

  async signIn(email: string, password?: string): Promise<UserAccount> {
    if (!password) throw new Error('A password is required to sign in.');
    const { data, error } = await this.db.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    const account = await this.one<UserAccount>('user_accounts', { id: data.user.id });
    if (!account) throw new Error('This account has no portal role assigned yet.');
    return account;
  }

  async signOut() {
    await this.db.auth.signOut();
  }

  async getSession(): Promise<UserAccount | null> {
    const { data } = await this.db.auth.getSession();
    if (!data.session) return null;
    return this.one<UserAccount>('user_accounts', { id: data.session.user.id });
  }

  async getOrg(): Promise<Org> {
    const { data, error } = await this.db.from('orgs').select('*').limit(1).single();
    if (error) throw new Error(error.message);
    return data as Org;
  }

  async listUsers() {
    return this.many<UserAccount>('user_accounts', {});
  }

  /* ── profile, land, application ─────────────────────────────── */

  async getProfile(userId: string) {
    return this.one<MemberProfile>('member_profiles', { user_id: userId });
  }

  async updateProfile(profileId: string, patch: Partial<MemberProfile>, actor: Actor) {
    const row = await this.patch<MemberProfile>('member_profiles', profileId, { ...patch, updated_at: nowIso() });
    await this.audit(actor, 'Profile updated', 'member_profile', row.membership_no, Object.keys(patch).join(', '));
    return row;
  }

  async getLand(profileId: string) {
    return this.one<LandParcel>('land_parcels', { profile_id: profileId });
  }

  async saveLand(profileId: string, patch: Partial<LandParcel>, actor: Actor) {
    const existing = await this.getLand(profileId);
    if (!existing) {
      const { data, error } = await this.db.from('land_parcels').insert({ ...patch, profile_id: profileId }).select().single();
      if (error) throw new Error(error.message);
      await this.audit(actor, 'Land details added', 'land', (data as LandParcel).title_no, 'Created by the member.');
      return data as LandParcel;
    }
    const row = await this.patch<LandParcel>('land_parcels', existing.id, patch);
    await this.audit(actor, 'Land details updated', 'land', row.title_no, Object.keys(patch).join(', '));
    return row;
  }

  async getApplication(profileId: string) {
    return this.one<Application>('applications', { profile_id: profileId });
  }

  async saveApplication(profileId: string, patch: Partial<Application>) {
    const existing = await this.getApplication(profileId);
    if (!existing) {
      const { data, error } = await this.db
        .from('applications')
        .insert({ ...patch, profile_id: profileId, status: 'draft' })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Application;
    }
    return this.patch<Application>('applications', existing.id, { ...patch, updated_at: nowIso() });
  }

  async submitApplication(applicationId: string, actor: Actor) {
    const row = await this.patch<Application>('applications', applicationId, {
      status: 'submitted',
      submitted_at: nowIso(),
      updated_at: nowIso(),
    });
    await this.audit(actor, 'Application submitted', 'application', row.reference, `Selected ${row.house_type ?? 'no type'}.`);
    return row;
  }

  /* ── project, milestones, progress ──────────────────────────── */

  async listProjects() {
    return this.many<Project>('projects', {});
  }

  async getProjectForProfile(profileId: string) {
    return this.one<Project>('projects', { profile_id: profileId });
  }

  async getProject(projectId: string) {
    return this.one<Project>('projects', { id: projectId });
  }

  async listMilestones(projectId: string) {
    return this.many<Milestone>('milestones', { project_id: projectId }, { column: 'sequence', ascending: true });
  }

  async listProgressUpdates(projectId: string, opts?: { includeUnpublished?: boolean }) {
    const match: Record<string, unknown> = { project_id: projectId };
    if (!opts?.includeUnpublished) match.published = true;
    return this.many<ProgressUpdate>('progress_updates', match, { column: 'reported_on', ascending: false });
  }

  async createProgressUpdate(input: NewProgressUpdate, actor: Actor) {
    const { data, error } = await this.db.from('progress_updates').insert({ ...input, published: false }).select().single();
    if (error) throw new Error(error.message);
    await this.audit(actor, 'Progress update submitted', 'progress_update', (data as ProgressUpdate).id, input.work_completed.slice(0, 120));
    return data as ProgressUpdate;
  }

  async publishProgressUpdate(updateId: string, actor: Actor) {
    const row = await this.patch<ProgressUpdate>('progress_updates', updateId, {
      published: true,
      verified_by: actor.name,
      verified_at: nowIso(),
    });
    await this.audit(actor, 'Progress update published', 'progress_update', row.id, 'Member wording reviewed and approved before publishing.');
    return row;
  }

  /* ── payments ───────────────────────────────────────────────── */

  async listPaymentStages(projectId: string) {
    return this.many<PaymentStage>('payment_stages', { project_id: projectId }, { column: 'sequence', ascending: true });
  }

  async submitClaim(stageId: string, evidenceNote: string, actor: Actor) {
    const row = await this.patch<PaymentStage>('payment_stages', stageId, {
      status: 'claim_submitted',
      claim_submitted_at: nowIso(),
      evidence_note: evidenceNote,
    });
    await this.audit(actor, 'Payment claim submitted', 'payment_stage', row.claim_reference ?? row.id, `Release ${row.sequence} claimed with evidence attached.`);
    return row;
  }

  async recordVerification(stageId: string, actor: Actor) {
    const row = await this.patch<PaymentStage>('payment_stages', stageId, {
      status: 'awaiting_authorisation',
      verified_by: actor.name,
      verified_at: nowIso(),
    });
    await this.audit(actor, 'Technical verification recorded', 'payment_stage', row.claim_reference ?? row.id, 'Evidence checked. Passed to KPSM for authorisation.');
    return row;
  }

  async authorisePayment(stageId: string, actor: Actor) {
    if (actor.role !== 'kpsm') {
      throw new Error('Only an authorised KPSM officer can authorise a payment release.');
    }
    const row = await this.patch<PaymentStage>('payment_stages', stageId, {
      status: 'authorised',
      authorised_by: actor.name,
      authorised_at: nowIso(),
    });
    await this.audit(actor, 'Payment authorised', 'payment_stage', row.claim_reference ?? row.id, `Release ${row.sequence} authorised by a KPSM officer after verification.`);
    return row;
  }

  async recordPayment(stageId: string, reference: string, actor: Actor) {
    const row = await this.patch<PaymentStage>('payment_stages', stageId, {
      status: 'paid',
      paid_at: nowIso(),
      payment_reference: reference,
      member_notified_at: nowIso(),
    });
    await this.audit(actor, 'Payment recorded', 'payment_stage', row.claim_reference ?? row.id, `Payment recorded against reference ${reference}.`);
    return row;
  }

  /* ── documents ──────────────────────────────────────────────── */

  async listDocuments(profileId: string) {
    return this.many<DocumentRecord>('documents', { profile_id: profileId }, { column: 'uploaded_at', ascending: false });
  }

  async addDocument(input: NewDocument, actor: Actor) {
    const { data, error } = await this.db
      .from('documents')
      .insert({ ...input, uploaded_at: nowIso(), status: 'pending_review' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await this.audit(actor, 'Document uploaded', 'document', input.title, `${input.file_name} awaiting human review.`);
    return data as DocumentRecord;
  }

  async confirmExtraction(documentId: string, fields: ExtractedField[], actor: Actor) {
    const { data: current, error: readError } = await this.db.from('documents').select('extraction').eq('id', documentId).single();
    if (readError) throw new Error(readError.message);
    const notes = (current as { extraction?: DocumentRecord['extraction'] })?.extraction?.notes ?? [];
    const row = await this.patch<DocumentRecord>('documents', documentId, {
      extraction: { reviewed: true, fields, notes },
    });
    const accepted = fields.filter((f) => f.accepted).length;
    await this.audit(actor, 'Extracted details confirmed by member', 'document', row.title, `${accepted} of ${fields.length} suggested values accepted. Values remain unverified until an officer checks the document.`);
    return row;
  }

  /* ── inspection, defects, handover, warranty ────────────────── */

  async getInspection(projectId: string) {
    return this.one<Inspection>('inspections', { project_id: projectId });
  }

  async scheduleInspection(projectId: string, when: string, actor: Actor) {
    const existing = await this.getInspection(projectId);
    if (!existing) throw new Error('No inspection record exists for this project yet.');
    const row = await this.patch<Inspection>('inspections', existing.id, { scheduled_for: when, status: 'scheduled' });
    await this.audit(actor, 'Inspection scheduled', 'inspection', row.id, `Joint inspection set for ${when}.`);
    return row;
  }

  async setChecklistResult(projectId: string, itemId: string, result: 'pending' | 'pass' | 'attention', note: string | undefined, actor: Actor) {
    const inspection = await this.getInspection(projectId);
    if (!inspection) throw new Error('No inspection record exists for this project yet.');
    const checklist = inspection.checklist.map((c) => (c.id === itemId ? { ...c, result, note } : c));
    const row = await this.patch<Inspection>('inspections', inspection.id, { checklist });
    await this.audit(actor, 'Inspection item recorded', 'inspection', row.id, `${itemId}: ${result}`);
    return row;
  }

  async listDefects(projectId: string) {
    return this.many<Defect>('defects', { project_id: projectId }, { column: 'reported_on', ascending: false });
  }

  async createDefect(input: Omit<Defect, 'id' | 'org_id' | 'reference' | 'status'>, actor: Actor) {
    const existing = await this.listDefects(input.project_id);
    const reference = `ITM-${String(existing.length + 1).padStart(3, '0')}`;
    const { data, error } = await this.db.from('defects').insert({ ...input, reference, status: 'open' }).select().single();
    if (error) throw new Error(error.message);
    await this.audit(actor, 'Item raised for rectification', 'defect', reference, `${input.area}: ${input.description.slice(0, 120)}`);
    return data as Defect;
  }

  async updateDefect(defectId: string, patch: Partial<Defect>, actor: Actor) {
    const values: Record<string, unknown> = { ...patch };
    if (patch.status === 'resolved') values.resolved_on = new Date().toISOString().slice(0, 10);
    const row = await this.patch<Defect>('defects', defectId, values);
    await this.audit(actor, 'Rectification updated', 'defect', row.reference, patch.status ? `Status set to ${patch.status}.` : 'Details updated.');
    return row;
  }

  async getHandover(projectId: string) {
    return this.one<Handover>('handovers', { project_id: projectId });
  }

  async updateHandover(projectId: string, patch: Partial<Handover>, actor: Actor) {
    const existing = await this.getHandover(projectId);
    if (!existing) throw new Error('No handover record exists for this project yet.');
    const row = await this.patch<Handover>('handovers', existing.id, patch);
    await this.audit(actor, 'Handover updated', 'handover', row.id, patch.status ? `Status set to ${patch.status}.` : 'Details updated.');
    return row;
  }

  async listWarranties(projectId: string) {
    return this.many<WarrantyItem>('warranty_items', { project_id: projectId });
  }

  async listWarrantyRequests(projectId: string) {
    return this.many<WarrantyRequest>('warranty_requests', { project_id: projectId }, { column: 'raised_on', ascending: false });
  }

  async createWarrantyRequest(projectId: string, category: string, description: string, actor: Actor) {
    const existing = await this.listWarrantyRequests(projectId);
    const reference = `WR-${String(existing.length + 1).padStart(3, '0')}`;
    const { data, error } = await this.db
      .from('warranty_requests')
      .insert({
        project_id: projectId,
        reference,
        raised_on: new Date().toISOString().slice(0, 10),
        category,
        description,
        status: 'open',
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await this.audit(actor, 'Warranty request raised', 'warranty_request', reference, `${category}: ${description.slice(0, 120)}`);
    return data as WarrantyRequest;
  }

  /* ── notifications, audit ───────────────────────────────────── */

  async listNotifications(profileId: string) {
    return this.many<Notification>('notifications', { profile_id: profileId }, { column: 'created_at', ascending: false });
  }

  async markNotificationRead(id: string) {
    const { error } = await this.db.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw new Error(error.message);
  }

  async markAllNotificationsRead(profileId: string) {
    const { error } = await this.db.from('notifications').update({ read: true }).eq('profile_id', profileId);
    if (error) throw new Error(error.message);
  }

  async listAudit() {
    return this.many<AuditRecord>('audit_records', {}, { column: 'at', ascending: false });
  }
}
