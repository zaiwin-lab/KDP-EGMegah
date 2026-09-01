import type {
  Application, AuditRecord, Defect, DocumentRecord, ExtractedField, Handover, Inspection,
  LandParcel, MemberProfile, Milestone, Notification, Org, PaymentStage, PhotoRef,
  ProgressUpdate, Project, UserAccount, WarrantyItem, WarrantyRequest,
} from '@/lib/types';

export interface NewProgressUpdate {
  project_id: string;
  reported_on: string;
  technical_summary: string;
  work_completed: string;
  current_work: string;
  next_activity: string;
  expected_next_date: string;
  delay_reason?: string;
  milestone_id?: string;
  member_summary: string;
  member_summary_source: 'assisted' | 'manual';
  photos: PhotoRef[];
  submitted_by: string;
}

export interface NewDocument {
  profile_id: string;
  project_id?: string;
  kind: DocumentRecord['kind'];
  title: string;
  file_name: string;
  size_kb: number;
  uploaded_by: string;
  extraction?: DocumentRecord['extraction'];
}

export interface Actor {
  name: string;
  role: UserAccount['role'];
}

/* One interface, two implementations: a local demo store and Supabase.
   Screens never import either one directly, so swapping the backing store
   (or pointing the platform at another cooperative) touches only this layer. */
export interface Repository {
  readonly mode: 'demo' | 'supabase';

  signIn(email: string, password?: string): Promise<UserAccount>;
  signOut(): Promise<void>;
  getSession(): Promise<UserAccount | null>;

  getOrg(): Promise<Org>;
  listUsers(): Promise<UserAccount[]>;

  getProfile(userId: string): Promise<MemberProfile | null>;
  updateProfile(profileId: string, patch: Partial<MemberProfile>, actor: Actor): Promise<MemberProfile>;

  getLand(profileId: string): Promise<LandParcel | null>;
  saveLand(profileId: string, patch: Partial<LandParcel>, actor: Actor): Promise<LandParcel>;

  getApplication(profileId: string): Promise<Application | null>;
  saveApplication(profileId: string, patch: Partial<Application>): Promise<Application>;
  submitApplication(applicationId: string, actor: Actor): Promise<Application>;

  listProjects(): Promise<Project[]>;
  getProjectForProfile(profileId: string): Promise<Project | null>;
  getProject(projectId: string): Promise<Project | null>;

  listMilestones(projectId: string): Promise<Milestone[]>;
  listProgressUpdates(projectId: string, opts?: { includeUnpublished?: boolean }): Promise<ProgressUpdate[]>;
  createProgressUpdate(input: NewProgressUpdate, actor: Actor): Promise<ProgressUpdate>;
  publishProgressUpdate(updateId: string, actor: Actor): Promise<ProgressUpdate>;

  listPaymentStages(projectId: string): Promise<PaymentStage[]>;
  submitClaim(stageId: string, evidenceNote: string, actor: Actor): Promise<PaymentStage>;
  recordVerification(stageId: string, actor: Actor): Promise<PaymentStage>;
  authorisePayment(stageId: string, actor: Actor): Promise<PaymentStage>;
  recordPayment(stageId: string, reference: string, actor: Actor): Promise<PaymentStage>;

  listDocuments(profileId: string): Promise<DocumentRecord[]>;
  addDocument(input: NewDocument, actor: Actor): Promise<DocumentRecord>;
  confirmExtraction(documentId: string, fields: ExtractedField[], actor: Actor): Promise<DocumentRecord>;

  getInspection(projectId: string): Promise<Inspection | null>;
  scheduleInspection(projectId: string, when: string, actor: Actor): Promise<Inspection>;
  setChecklistResult(projectId: string, itemId: string, result: 'pending' | 'pass' | 'attention', note: string | undefined, actor: Actor): Promise<Inspection>;

  listDefects(projectId: string): Promise<Defect[]>;
  createDefect(input: Omit<Defect, 'id' | 'org_id' | 'reference' | 'status'>, actor: Actor): Promise<Defect>;
  updateDefect(defectId: string, patch: Partial<Defect>, actor: Actor): Promise<Defect>;

  getHandover(projectId: string): Promise<Handover | null>;
  updateHandover(projectId: string, patch: Partial<Handover>, actor: Actor): Promise<Handover>;

  listWarranties(projectId: string): Promise<WarrantyItem[]>;
  listWarrantyRequests(projectId: string): Promise<WarrantyRequest[]>;
  createWarrantyRequest(projectId: string, category: string, description: string, actor: Actor): Promise<WarrantyRequest>;

  listNotifications(profileId: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  markAllNotificationsRead(profileId: string): Promise<void>;

  listAudit(): Promise<AuditRecord[]>;
}
