/* Domain model for Land2Home Concierge.
   Deliberately tenant-scoped: every root record carries an org_id so the
   same platform can serve another cooperative/contractor pair later
   without a rebuild. */

export type Role = 'member' | 'kobis' | 'kpsm' | 'egmh';

export type StageKey = 'land' | 'home' | 'plan' | 'build' | 'inspection' | 'keys';

export type StageStatus = 'locked' | 'active' | 'in_review' | 'complete';

export interface Partner {
  code: string;
  name: string;
  legal_name: string;
  role: string;
  registration?: string;
  established?: string;
  address?: string;
  phone?: string;
  email?: string;
  credentials: string[];
  responsibilities: string[];
  website?: string;
}

export interface Org {
  id: string;
  name: string;
  short_name: string;
  cooperative: string;
  builder: string;
  operator: string;
  /* Platform owners first, then the cooperative whose members it serves. */
  partners: Partner[];
}

export interface UserAccount {
  id: string;
  org_id: string;
  email: string;
  role: Role;
  display_name: string;
  job_title?: string;
}

export type ConsentKey = 'store_documents' | 'share_with_builder' | 'contact_updates';

export interface MemberProfile {
  id: string;
  org_id: string;
  user_id: string;
  /* One Member, One Profile: captured once, reused everywhere. */
  full_name: string;
  ic_number: string;
  membership_no: string;
  membership_status: 'unverified' | 'pending' | 'verified';
  membership_verified_at?: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  postcode: string;
  town: string;
  state: string;
  employer?: string;
  monthly_income?: number;
  household_size?: number;
  co_applicant_name?: string;
  co_applicant_ic?: string;
  preferred_language: 'en' | 'ms';
  consents: Record<ConsentKey, { granted: boolean; at?: string }>;
  created_at: string;
  updated_at: string;
}

export interface LandParcel {
  id: string;
  org_id: string;
  profile_id: string;
  title_no: string;
  lot_no: string;
  district: string;
  state: string;
  area_sq_ft: number;
  tenure: 'native_title' | 'mixed_zone' | 'leasehold' | 'freehold';
  ownership: 'sole' | 'joint' | 'family_trust';
  road_access: boolean;
  power_nearby: boolean;
  water_nearby: boolean;
  verification_status: 'unverified' | 'pending' | 'verified' | 'query';
  verified_by?: string;
  verified_at?: string;
  verification_note?: string;
}

export type HouseTypeKey = 'A' | 'B' | 'C' | 'CUSTOM';

export interface HouseType {
  key: HouseTypeKey;
  name: string;
  /* EGMH's own catalogue language: series, character line, and the render
     used wherever the path is shown. */
  series: string;
  character: string;
  tagline: string;
  image: string;
  image_alt: string;
  built_up_sq_ft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  indicative_price: number | null;
  suits: string;
  min_land_sq_ft: number;
  highlights: string[];
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'site_assessment'
  | 'quotation_issued'
  | 'approved'
  | 'declined';

export interface Application {
  id: string;
  org_id: string;
  profile_id: string;
  land_id?: string;
  reference: string;
  house_type?: HouseTypeKey;
  custom_brief?: string;
  budget_band?: string;
  financing_route?: 'kpsm_facility' | 'bank' | 'self_funded' | 'undecided';
  target_start?: string;
  status: ApplicationStatus;
  /* Auto-save: which wizard step the member last left off on. */
  last_step: number;
  completed_steps: number[];
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  org_id: string;
  profile_id: string;
  application_id: string;
  reference: string;
  house_type: HouseTypeKey;
  house_name: string;
  built_up_sq_ft: number;
  site_label: string;
  district: string;
  state: string;
  contract_sum: number;
  contract_signed_at?: string;
  started_at: string;
  target_handover: string;
  current_stage: StageKey;
  construction_phase: string;
  overall_progress: number;
  schedule_status: 'on_schedule' | 'slight_delay' | 'delayed';
  coordinator_name: string;
  coordinator_role: string;
  coordinator_phone: string;
  coordinator_email: string;
  site_supervisor: string;
}

export interface JourneyStage {
  key: StageKey;
  title: string;
  member_summary: string;
  status: StageStatus;
  completed_at?: string;
}

export interface Milestone {
  id: string;
  org_id: string;
  project_id: string;
  sequence: number;
  title: string;
  member_title: string;
  expected_date: string;
  actual_date?: string;
  status: 'not_started' | 'in_progress' | 'complete';
  weight: number;
}

export interface ProgressUpdate {
  id: string;
  org_id: string;
  project_id: string;
  reported_on: string;
  /* What EGMH types in. Technical language is fine here. */
  technical_summary: string;
  work_completed: string;
  current_work: string;
  next_activity: string;
  expected_next_date: string;
  delay_reason?: string;
  milestone_id?: string;
  photos: PhotoRef[];
  /* What the member reads. Generated from the technical text, then
     always shown to EGMH for confirmation before it is published. */
  member_summary: string;
  member_summary_source: 'assisted' | 'manual';
  submitted_by: string;
  verified_by?: string;
  verified_at?: string;
  published: boolean;
}

export interface PhotoRef {
  id: string;
  caption: string;
  /* Storage path in Supabase; the demo adapter uses a gradient token. */
  path?: string;
  swatch: string;
  taken_on: string;
}

export type PaymentStageStatus =
  | 'not_due'
  | 'claim_submitted'
  | 'technical_verification'
  | 'awaiting_authorisation'
  | 'authorised'
  | 'paid';

export interface PaymentStage {
  id: string;
  org_id: string;
  project_id: string;
  sequence: 1 | 2 | 3 | 4;
  title: string;
  member_description: string;
  percentage: number;
  amount: number;
  status: PaymentStageStatus;
  claim_submitted_at?: string;
  claim_reference?: string;
  evidence_note?: string;
  verified_by?: string;
  verified_at?: string;
  authorised_by?: string;
  authorised_at?: string;
  paid_at?: string;
  payment_reference?: string;
  member_notified_at?: string;
}

export type DocumentKind =
  | 'ic'
  | 'membership_card'
  | 'land_title'
  | 'land_plan'
  | 'income_proof'
  | 'consent_form'
  | 'contract'
  | 'quotation'
  | 'site_assessment'
  | 'inspection_report'
  | 'warranty'
  | 'manual'
  | 'payment_record'
  | 'other';

export interface ExtractedField {
  field: string;
  label: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  /* Set when the extracted value disagrees with what the profile holds. */
  conflicts_with?: string;
  accepted?: boolean;
}

export interface DocumentRecord {
  id: string;
  org_id: string;
  profile_id: string;
  project_id?: string;
  kind: DocumentKind;
  title: string;
  file_name: string;
  size_kb: number;
  uploaded_at: string;
  uploaded_by: string;
  /* Documents expire; a valid one is never requested twice. */
  valid_until?: string;
  status: 'pending_review' | 'verified' | 'rejected' | 'reference';
  verified_by?: string;
  verified_at?: string;
  extraction?: {
    reviewed: boolean;
    fields: ExtractedField[];
    notes: string[];
  };
}

export type DefectStatus = 'open' | 'in_progress' | 'resolved';

export interface Inspection {
  id: string;
  org_id: string;
  project_id: string;
  scheduled_for?: string;
  completed_at?: string;
  inspector: string;
  status: 'not_scheduled' | 'scheduled' | 'completed';
  checklist: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  area: string;
  item: string;
  result: 'pending' | 'pass' | 'attention';
  note?: string;
}

export interface Defect {
  id: string;
  org_id: string;
  project_id: string;
  reference: string;
  area: string;
  description: string;
  reported_by: string;
  reported_on: string;
  status: DefectStatus;
  priority: 'routine' | 'important';
  photos: PhotoRef[];
  rectification_note?: string;
  rectification_photos?: PhotoRef[];
  resolved_on?: string;
  member_confirmed?: boolean;
}

export interface Handover {
  id: string;
  org_id: string;
  project_id: string;
  status: 'not_ready' | 'appointment_offered' | 'confirmed' | 'completed';
  appointment_at?: string;
  location?: string;
  attendees: string[];
  keys_released_at?: string;
  defects_liability_until?: string;
  notes?: string;
}

export interface WarrantyItem {
  id: string;
  org_id: string;
  project_id: string;
  item: string;
  provider: string;
  covers: string;
  until: string;
}

export interface WarrantyRequest {
  id: string;
  org_id: string;
  project_id: string;
  reference: string;
  raised_on: string;
  category: string;
  description: string;
  status: DefectStatus;
  response_note?: string;
  scheduled_for?: string;
}

export interface Notification {
  id: string;
  org_id: string;
  profile_id: string;
  created_at: string;
  title: string;
  body: string;
  channel: 'payment' | 'progress' | 'action' | 'document' | 'handover';
  read: boolean;
  link?: string;
}

export interface AuditRecord {
  id: string;
  org_id: string;
  at: string;
  actor_name: string;
  actor_role: Role;
  action: string;
  entity: string;
  entity_ref: string;
  detail: string;
  /* Every payment authorisation is a human act; this proves it. */
  human_authorised: boolean;
}

/* What the member must do next. Computed, never hand-maintained. */
export interface MemberAction {
  id: string;
  title: string;
  detail: string;
  cta: string;
  href: string;
  urgency: 'now' | 'soon' | 'info';
  due?: string;
}
