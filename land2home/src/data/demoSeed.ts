import type {
  Application, AuditRecord, Defect, DocumentRecord, Handover, Inspection, LandParcel,
  MemberProfile, Milestone, Notification, Org, PaymentStage, ProgressUpdate, Project,
  UserAccount, WarrantyItem, WarrantyRequest,
} from '@/lib/types';

/* Demonstration data only. No real member, land title or payment record.
   Every name, number and reference below is invented for the demo. */

/* Partner details are drawn from each organisation's own published
   material. Nothing here is inferred: where a credential is not published,
   it is simply absent rather than estimated. */
export const ORG: Org = {
  id: 'org_bau',
  name: 'Land2Home — EGMH × KOBIS',
  short_name: 'Land2Home',
  cooperative: 'KPSM Bau',
  builder: 'EGMH',
  operator: 'KOBIS Berhad',
  partners: [
    {
      code: 'EGMH',
      name: 'EG Megah Holdings',
      legal_name: 'EG Megah Holdings Sdn Bhd',
      role: 'Design and build',
      credentials: [
        'Member, Persatuan Kontraktor Perumahan Malaysia (PKPM) — Sarawak',
        'PKPM member reference PKPM-0113',
        'Design-and-build contractor for homes on privately held land',
      ],
      responsibilities: [
        'Site assessment and design',
        'Quotation and specification',
        'Construction and quality control',
        'Progress reporting, handover and warranty',
      ],
    },
    {
      code: 'KOBIS',
      name: 'KOBIS Berhad',
      legal_name: 'Koperasi Pro Belia Inovatif Sarawak Berhad',
      role: 'Platform and programme orchestration',
      registration: 'Reg. No. Q40891',
      established: 'Established 2013',
      credentials: [
        'Top 50 Koperasi Terbaik Sarawak, recognised by Suruhanjaya Koperasi Malaysia (SKM)',
        'Shariah Advisory structure',
        'Six offices: Kuching, Kuala Lumpur, Miri, Sibu, Bintulu and Mukah',
        'Aligned to Sarawak’s PCDS2030 agenda',
      ],
      responsibilities: [
        'Builds and runs this platform',
        'Coordinates the member journey end to end',
        'Records, communication and service monitoring',
        'Technical verification before payment authorisation',
      ],
      website: 'https://www.kobisberhad.com',
    },
    {
      code: 'KPSM',
      name: 'KPSM Bau',
      legal_name: 'Koperasi Penanam Sawit Mampan Daerah Bau Berhad',
      role: 'Member cooperative and payment governance',
      credentials: [
        'Registered cooperative serving members in the Bau district, Sarawak',
        'Named in Malaysia’s Top 100 cooperatives for four consecutive years, 2023 to 2026',
      ],
      responsibilities: [
        'Verifies member standing and eligibility',
        'Governs the staged payment facility',
        'Authorises each payment release to EGMH',
        'Represents members’ interests throughout',
      ],
    },
  ],
};

const ORG_ID = ORG.id;

export const USERS: UserAccount[] = [
  { id: 'usr_member', org_id: ORG_ID, email: 'amir@demo.land2home.my', role: 'member', display_name: 'Amir bin Rahman' },
  { id: 'usr_kobis', org_id: ORG_ID, email: 'kobis@demo.land2home.my', role: 'kobis', display_name: 'Nurul Aisyah', job_title: 'Journey Coordinator, KOBIS Berhad' },
  { id: 'usr_kpsm', org_id: ORG_ID, email: 'kpsm@demo.land2home.my', role: 'kpsm', display_name: 'Hj. Zulkifli Awang', job_title: 'Payment Authorising Officer, KPSM' },
  { id: 'usr_egmh', org_id: ORG_ID, email: 'egmh@demo.land2home.my', role: 'egmh', display_name: 'Sim Chee Hong', job_title: 'Site Manager, EGMH' },
];

export const PROFILE: MemberProfile = {
  id: 'prf_amir',
  org_id: ORG_ID,
  user_id: 'usr_member',
  full_name: 'Amir bin Rahman',
  ic_number: '880412-13-5xxx',
  membership_no: 'KPSM-04127',
  membership_status: 'verified',
  membership_verified_at: '2026-03-02T09:15:00+08:00',
  email: 'amir@demo.land2home.my',
  phone: '+60 12-345 6789',
  address_line1: 'Lot 2214, Kampung Skibang',
  address_line2: 'Jalan Bau–Lundu',
  postcode: '94000',
  town: 'Bau',
  state: 'Sarawak',
  employer: 'Sarawak Public Works Department',
  monthly_income: 6400,
  household_size: 5,
  co_applicant_name: 'Hana binti Zainal',
  co_applicant_ic: '900228-13-6xxx',
  preferred_language: 'en',
  consents: {
    store_documents: { granted: true, at: '2026-03-01T10:02:00+08:00' },
    share_with_builder: { granted: true, at: '2026-03-01T10:02:00+08:00' },
    contact_updates: { granted: true, at: '2026-03-01T10:02:00+08:00' },
  },
  created_at: '2026-03-01T10:00:00+08:00',
  updated_at: '2026-08-18T14:22:00+08:00',
};

export const LAND: LandParcel = {
  id: 'lnd_skibang',
  org_id: ORG_ID,
  profile_id: PROFILE.id,
  title_no: 'BAU/NT/22-1148',
  lot_no: 'Lot 2214',
  district: 'Bau',
  state: 'Sarawak',
  area_sq_ft: 6200,
  tenure: 'native_title',
  ownership: 'joint',
  road_access: true,
  power_nearby: true,
  water_nearby: true,
  verification_status: 'verified',
  verified_by: 'Nurul Aisyah (KOBIS)',
  verified_at: '2026-03-09T11:40:00+08:00',
  verification_note: 'Title and site boundary checked against the land office extract. Access road confirmed on the site visit.',
};

export const APPLICATION: Application = {
  id: 'app_amir_01',
  org_id: ORG_ID,
  profile_id: PROFILE.id,
  land_id: LAND.id,
  reference: 'L2H-2026-0417',
  house_type: 'B',
  budget_band: 'RM 200,000 – RM 260,000',
  financing_route: 'kpsm_facility',
  target_start: '2026-04-20',
  status: 'approved',
  last_step: 6,
  completed_steps: [1, 2, 3, 4, 5, 6],
  submitted_at: '2026-03-14T16:05:00+08:00',
  created_at: '2026-03-04T20:11:00+08:00',
  updated_at: '2026-04-02T09:30:00+08:00',
};

export const PROJECT: Project = {
  id: 'prj_amir_01',
  org_id: ORG_ID,
  profile_id: PROFILE.id,
  application_id: APPLICATION.id,
  reference: 'EGMH-BAU-0417',
  house_type: 'B',
  house_name: 'The Harmoni',
  built_up_sq_ft: 1280,
  site_label: 'Lot 2214, Kampung Skibang',
  district: 'Bau',
  state: 'Sarawak',
  contract_sum: 238000,
  contract_signed_at: '2026-04-08T10:00:00+08:00',
  started_at: '2026-04-20',
  target_handover: '2027-02-19',
  current_stage: 'build',
  construction_phase: 'Structural works',
  overall_progress: 42,
  schedule_status: 'on_schedule',
  coordinator_name: 'Nurul Aisyah',
  coordinator_role: 'Journey Coordinator, KOBIS Berhad',
  coordinator_phone: '+60 82-555 140',
  coordinator_email: 'nurul.aisyah@demo.kobis.my',
  site_supervisor: 'Sim Chee Hong (EGMH)',
};

export const MILESTONES: Milestone[] = [
  { id: 'ms_1', org_id: ORG_ID, project_id: PROJECT.id, sequence: 1, title: 'Site clearing and setting out', member_title: 'Land cleared and the house position marked out', expected_date: '2026-04-30', actual_date: '2026-04-28', status: 'complete', weight: 6 },
  { id: 'ms_2', org_id: ORG_ID, project_id: PROJECT.id, sequence: 2, title: 'Foundation and ground beam', member_title: 'Foundation poured', expected_date: '2026-06-05', actual_date: '2026-06-03', status: 'complete', weight: 16 },
  { id: 'ms_3', org_id: ORG_ID, project_id: PROJECT.id, sequence: 3, title: 'Superstructure — columns and beams', member_title: 'Main house structure built', expected_date: '2026-08-22', actual_date: '2026-08-20', status: 'complete', weight: 20 },
  { id: 'ms_4', org_id: ORG_ID, project_id: PROJECT.id, sequence: 4, title: 'Roof structure installation', member_title: 'Roof structure installed', expected_date: '2026-09-26', status: 'in_progress', weight: 14 },
  { id: 'ms_5', org_id: ORG_ID, project_id: PROJECT.id, sequence: 5, title: 'Wall infill, doors and windows', member_title: 'Walls, doors and windows fitted', expected_date: '2026-11-14', status: 'not_started', weight: 16 },
  { id: 'ms_6', org_id: ORG_ID, project_id: PROJECT.id, sequence: 6, title: 'Electrical, plumbing and internal finishes', member_title: 'Wiring, water and inside finishing', expected_date: '2027-01-09', status: 'not_started', weight: 18 },
  { id: 'ms_7', org_id: ORG_ID, project_id: PROJECT.id, sequence: 7, title: 'Practical completion and joint inspection', member_title: 'House checked together before handover', expected_date: '2027-02-06', status: 'not_started', weight: 10 },
];

const swatch = (a: string) => a;

export const PROGRESS_UPDATES: ProgressUpdate[] = [
  {
    id: 'pu_5', org_id: ORG_ID, project_id: PROJECT.id, reported_on: '2026-08-26',
    technical_summary: 'Superstructure certified at 65%. RC columns C1–C14 and roof beams cast; formwork struck. Awaiting truss delivery from Kuching yard.',
    work_completed: 'Columns and roof beams cast and cured. Formwork removed and stacked.',
    current_work: 'Setting out for the roof truss line and preparing the wall plate.',
    next_activity: 'Roof truss delivery and installation',
    expected_next_date: '2026-09-08',
    milestone_id: 'ms_4',
    photos: [
      { id: 'ph_51', caption: 'Roof beams cast, formwork removed', swatch: swatch('a'), taken_on: '2026-08-26' },
      { id: 'ph_52', caption: 'Front elevation from the access road', swatch: swatch('b'), taken_on: '2026-08-26' },
    ],
    member_summary:
      'The main house structure is complete. The columns and roof beams have set and the temporary supports have been taken down. Roof installation is the next activity, with the trusses expected on site in early September.',
    member_summary_source: 'assisted',
    submitted_by: 'Sim Chee Hong (EGMH)',
    verified_by: 'Nurul Aisyah (KOBIS)',
    verified_at: '2026-08-27T09:10:00+08:00',
    published: true,
  },
  {
    id: 'pu_4', org_id: ORG_ID, project_id: PROJECT.id, reported_on: '2026-08-06',
    technical_summary: 'Column casting to first lift complete. Beam reinforcement fixed, awaiting consultant check before pour.',
    work_completed: 'All ground-floor columns cast.',
    current_work: 'Beam reinforcement and formwork.',
    next_activity: 'Roof beam pour',
    expected_next_date: '2026-08-20',
    milestone_id: 'ms_3',
    photos: [{ id: 'ph_41', caption: 'Columns cast, beam steel being fixed', swatch: swatch('c'), taken_on: '2026-08-06' }],
    member_summary:
      'All the columns for the house are now up. The steel for the roof beams is being tied in place and will be checked before concrete is poured.',
    member_summary_source: 'assisted',
    submitted_by: 'Sim Chee Hong (EGMH)',
    verified_by: 'Nurul Aisyah (KOBIS)',
    verified_at: '2026-08-07T08:40:00+08:00',
    published: true,
  },
  {
    id: 'pu_3', org_id: ORG_ID, project_id: PROJECT.id, reported_on: '2026-06-10',
    technical_summary: 'Ground beam and pad footings completed to spec. Backfill and compaction done. Slab prep in progress.',
    work_completed: 'Footings and ground beams cast, backfilled and compacted.',
    current_work: 'Preparing the floor slab bed.',
    next_activity: 'Floor slab pour, then column starter bars',
    expected_next_date: '2026-06-24',
    milestone_id: 'ms_2',
    photos: [
      { id: 'ph_31', caption: 'Ground beams cast and backfilled', swatch: swatch('d'), taken_on: '2026-06-10' },
      { id: 'ph_32', caption: 'Site levelled, slab bed being prepared', swatch: swatch('e'), taken_on: '2026-06-10' },
    ],
    member_summary:
      'The foundation is finished and the ground has been filled back and compacted. The floor slab is being prepared next.',
    member_summary_source: 'assisted',
    submitted_by: 'Sim Chee Hong (EGMH)',
    verified_by: 'Nurul Aisyah (KOBIS)',
    verified_at: '2026-06-11T10:15:00+08:00',
    published: true,
  },
  {
    id: 'pu_2', org_id: ORG_ID, project_id: PROJECT.id, reported_on: '2026-05-14',
    technical_summary: 'Excavation for pad footings complete. Two days lost to heavy rain; recovered within the float.',
    work_completed: 'Footing excavation and blinding.',
    current_work: 'Steel fixing for pad footings.',
    next_activity: 'Footing and ground beam pour',
    expected_next_date: '2026-06-05',
    delay_reason: 'Two days of heavy rain in the first week of May. Time made up the following week, so the overall date has not moved.',
    milestone_id: 'ms_2',
    photos: [{ id: 'ph_21', caption: 'Footing excavation', swatch: swatch('f'), taken_on: '2026-05-14' }],
    member_summary:
      'The holes for the foundation have been dug and the steel is being tied in place. Two days were lost to heavy rain in early May, and that time has already been made up, so your handover date has not changed.',
    member_summary_source: 'assisted',
    submitted_by: 'Sim Chee Hong (EGMH)',
    verified_by: 'Nurul Aisyah (KOBIS)',
    verified_at: '2026-05-15T09:00:00+08:00',
    published: true,
  },
  {
    id: 'pu_1', org_id: ORG_ID, project_id: PROJECT.id, reported_on: '2026-04-28',
    technical_summary: 'Site cleared, hoarding erected, setting out completed and verified against the approved plan.',
    work_completed: 'Site clearing, temporary fencing, setting out.',
    current_work: 'Mobilising plant and materials.',
    next_activity: 'Footing excavation',
    expected_next_date: '2026-05-08',
    milestone_id: 'ms_1',
    photos: [{ id: 'ph_11', caption: 'Site cleared and marked out', swatch: swatch('g'), taken_on: '2026-04-28' }],
    member_summary:
      'Your land has been cleared and fenced, and the exact position of the house has been marked out on the ground and checked against the approved plan.',
    member_summary_source: 'assisted',
    submitted_by: 'Sim Chee Hong (EGMH)',
    verified_by: 'Nurul Aisyah (KOBIS)',
    verified_at: '2026-04-29T09:20:00+08:00',
    published: true,
  },
];

export const PAYMENT_STAGES: PaymentStage[] = [
  {
    id: 'pay_1', org_id: ORG_ID, project_id: PROJECT.id, sequence: 1,
    title: 'Mobilisation and contract commencement',
    member_description: 'Released when the contract is signed and EGMH moves onto your land to start work.',
    percentage: 15, amount: 35700, status: 'paid',
    claim_submitted_at: '2026-04-21T09:00:00+08:00', claim_reference: 'CLM-0417-01',
    evidence_note: 'Signed contract, insurance cover note and site mobilisation record.',
    verified_by: 'Nurul Aisyah (KOBIS)', verified_at: '2026-04-22T14:20:00+08:00',
    authorised_by: 'Hj. Zulkifli Awang (KPSM)', authorised_at: '2026-04-24T11:05:00+08:00',
    paid_at: '2026-04-25T16:30:00+08:00', payment_reference: 'KPSM/TT/26/00812',
    member_notified_at: '2026-04-25T16:35:00+08:00',
  },
  {
    id: 'pay_2', org_id: ORG_ID, project_id: PROJECT.id, sequence: 2,
    title: 'Foundation and structural milestone',
    member_description: 'Released when the foundation and the main structure of the house are complete and checked.',
    percentage: 30, amount: 71400, status: 'awaiting_authorisation',
    claim_submitted_at: '2026-08-27T10:12:00+08:00', claim_reference: 'CLM-0417-02',
    evidence_note: 'Structural completion record, concrete cube test results and dated site photographs.',
    verified_by: 'Nurul Aisyah (KOBIS)', verified_at: '2026-08-29T15:45:00+08:00',
  },
  {
    id: 'pay_3', org_id: ORG_ID, project_id: PROJECT.id, sequence: 3,
    title: 'Roofing, enclosure, services and finishes',
    member_description: 'Released once the roof is on, the house is closed up, and the wiring, water and finishes are done.',
    percentage: 35, amount: 83300, status: 'not_due',
  },
  {
    id: 'pay_4', org_id: ORG_ID, project_id: PROJECT.id, sequence: 4,
    title: 'Completion, inspection, rectification and handover',
    member_description: 'The final release, after the joint inspection, any repairs, and the day you receive your keys.',
    percentage: 20, amount: 47600, status: 'not_due',
  },
];

export const DOCUMENTS: DocumentRecord[] = [
  { id: 'doc_ic', org_id: ORG_ID, profile_id: PROFILE.id, kind: 'ic', title: 'Identity card', file_name: 'ic-amir.pdf', size_kb: 412, uploaded_at: '2026-03-01T10:20:00+08:00', uploaded_by: 'Amir bin Rahman', status: 'verified', verified_by: 'Nurul Aisyah (KOBIS)', verified_at: '2026-03-02T09:15:00+08:00', valid_until: '2031-04-12' },
  { id: 'doc_mem', org_id: ORG_ID, profile_id: PROFILE.id, kind: 'membership_card', title: 'KPSM membership record', file_name: 'kpsm-membership.pdf', size_kb: 208, uploaded_at: '2026-03-01T10:24:00+08:00', uploaded_by: 'Amir bin Rahman', status: 'verified', verified_by: 'KPSM registry', verified_at: '2026-03-02T09:15:00+08:00', valid_until: '2027-12-31' },
  { id: 'doc_title', org_id: ORG_ID, profile_id: PROFILE.id, kind: 'land_title', title: 'Land title — Lot 2214', file_name: 'land-title-2214.pdf', size_kb: 1840, uploaded_at: '2026-03-04T21:02:00+08:00', uploaded_by: 'Amir bin Rahman', status: 'verified', verified_by: 'Nurul Aisyah (KOBIS)', verified_at: '2026-03-09T11:40:00+08:00' },
  { id: 'doc_income', org_id: ORG_ID, profile_id: PROFILE.id, kind: 'income_proof', title: 'Income confirmation', file_name: 'payslip-jan-mar.pdf', size_kb: 622, uploaded_at: '2026-03-05T08:40:00+08:00', uploaded_by: 'Amir bin Rahman', status: 'verified', verified_by: 'KPSM credit desk', verified_at: '2026-03-12T10:05:00+08:00', valid_until: '2026-09-30' },
  { id: 'doc_quote', org_id: ORG_ID, profile_id: PROFILE.id, project_id: PROJECT.id, kind: 'quotation', title: 'EGMH quotation — The Harmoni', file_name: 'quotation-0417.pdf', size_kb: 940, uploaded_at: '2026-03-28T15:10:00+08:00', uploaded_by: 'Sim Chee Hong (EGMH)', status: 'reference' },
  { id: 'doc_assess', org_id: ORG_ID, profile_id: PROFILE.id, project_id: PROJECT.id, kind: 'site_assessment', title: 'Site assessment report', file_name: 'site-assessment-2214.pdf', size_kb: 1320, uploaded_at: '2026-03-22T17:30:00+08:00', uploaded_by: 'Sim Chee Hong (EGMH)', status: 'reference' },
  { id: 'doc_contract', org_id: ORG_ID, profile_id: PROFILE.id, project_id: PROJECT.id, kind: 'contract', title: 'Building contract (signed)', file_name: 'contract-0417-signed.pdf', size_kb: 2210, uploaded_at: '2026-04-08T12:00:00+08:00', uploaded_by: 'Nurul Aisyah (KOBIS)', status: 'reference' },
  { id: 'doc_pay1', org_id: ORG_ID, profile_id: PROFILE.id, project_id: PROJECT.id, kind: 'payment_record', title: 'Payment record — Release 1', file_name: 'payment-release-1.pdf', size_kb: 180, uploaded_at: '2026-04-25T16:40:00+08:00', uploaded_by: 'KPSM finance', status: 'reference' },
];

export const INSPECTION: Inspection = {
  id: 'insp_1', org_id: ORG_ID, project_id: PROJECT.id,
  inspector: 'Joint inspection — member, KOBIS and EGMH',
  status: 'not_scheduled',
  checklist: [
    { id: 'ck_1', area: 'Outside', item: 'Walls, paint and external finishes', result: 'pending' },
    { id: 'ck_2', area: 'Outside', item: 'Roof, gutters and rainwater pipes', result: 'pending' },
    { id: 'ck_3', area: 'Outside', item: 'Drainage and ground levels around the house', result: 'pending' },
    { id: 'ck_4', area: 'Inside', item: 'Floors, walls and ceilings', result: 'pending' },
    { id: 'ck_5', area: 'Inside', item: 'Doors, windows, locks and keys', result: 'pending' },
    { id: 'ck_6', area: 'Water', item: 'Taps, sinks, toilets and water pressure', result: 'pending' },
    { id: 'ck_7', area: 'Water', item: 'No leaks or damp patches', result: 'pending' },
    { id: 'ck_8', area: 'Electrical', item: 'Lights, switches, sockets and distribution board', result: 'pending' },
    { id: 'ck_9', area: 'Kitchen', item: 'Cabinets, worktop and sink', result: 'pending' },
    { id: 'ck_10', area: 'Handover pack', item: 'Manuals, warranties and keys accounted for', result: 'pending' },
  ],
};

export const DEFECTS: Defect[] = [];

export const HANDOVER: Handover = {
  id: 'hand_1', org_id: ORG_ID, project_id: PROJECT.id,
  status: 'not_ready',
  attendees: ['Amir bin Rahman', 'Hana binti Zainal', 'Nurul Aisyah (KOBIS)', 'Sim Chee Hong (EGMH)'],
  notes: 'The handover appointment is offered once the joint inspection is complete and any items raised have been put right.',
};

export const WARRANTIES: WarrantyItem[] = [
  { id: 'w_1', org_id: ORG_ID, project_id: PROJECT.id, item: 'Structure', provider: 'EGMH', covers: 'Foundation, columns, beams and roof structure', until: '2037-02-19' },
  { id: 'w_2', org_id: ORG_ID, project_id: PROJECT.id, item: 'Defects liability', provider: 'EGMH', covers: 'Workmanship and finishes across the whole house', until: '2029-02-19' },
  { id: 'w_3', org_id: ORG_ID, project_id: PROJECT.id, item: 'Roof covering', provider: 'Supplier warranty via EGMH', covers: 'Metal roof sheets against leakage', until: '2036-02-19' },
  { id: 'w_4', org_id: ORG_ID, project_id: PROJECT.id, item: 'Water and electrical fittings', provider: 'EGMH', covers: 'Installed taps, sanitary ware, switches and sockets', until: '2028-02-19' },
];

export const WARRANTY_REQUESTS: WarrantyRequest[] = [];

export const NOTIFICATIONS: Notification[] = [
  { id: 'nt_1', org_id: ORG_ID, profile_id: PROFILE.id, created_at: '2026-08-29T15:50:00+08:00', title: 'Release 2 is with KPSM for authorisation', body: 'EGMH has claimed for the foundation and structural milestone, and the evidence has passed technical verification. KPSM is reviewing it now. Nothing is needed from you.', channel: 'payment', read: false, link: '/app/payments' },
  { id: 'nt_2', org_id: ORG_ID, profile_id: PROFILE.id, created_at: '2026-08-27T09:15:00+08:00', title: 'New site update and photographs', body: 'The main house structure is complete. Roof installation is next.', channel: 'progress', read: false, link: '/app/progress' },
  { id: 'nt_3', org_id: ORG_ID, profile_id: PROFILE.id, created_at: '2026-08-18T14:25:00+08:00', title: 'Income confirmation expires on 30 September', body: 'Your income confirmation is on file and still valid. Please upload a fresh one before it expires so nothing holds up the later payment releases.', channel: 'action', read: true, link: '/app/documents' },
  { id: 'nt_4', org_id: ORG_ID, profile_id: PROFILE.id, created_at: '2026-04-25T16:35:00+08:00', title: 'Release 1 has been paid', body: 'KPSM has recorded payment of RM 35,700 to EGMH for mobilisation and contract commencement.', channel: 'payment', read: true, link: '/app/payments' },
];

export const AUDIT: AuditRecord[] = [
  { id: 'au_9', org_id: ORG_ID, at: '2026-08-29T15:45:00+08:00', actor_name: 'Nurul Aisyah', actor_role: 'kobis', action: 'Technical verification recorded', entity: 'payment_stage', entity_ref: 'CLM-0417-02', detail: 'Structural milestone evidence checked against the site record and the concrete test results. Passed to KPSM for authorisation.', human_authorised: true },
  { id: 'au_8', org_id: ORG_ID, at: '2026-08-27T10:12:00+08:00', actor_name: 'Sim Chee Hong', actor_role: 'egmh', action: 'Payment claim submitted', entity: 'payment_stage', entity_ref: 'CLM-0417-02', detail: 'Release 2 claimed for RM 71,400 with structural completion evidence attached.', human_authorised: true },
  { id: 'au_7', org_id: ORG_ID, at: '2026-08-27T09:10:00+08:00', actor_name: 'Nurul Aisyah', actor_role: 'kobis', action: 'Progress update published', entity: 'progress_update', entity_ref: 'pu_5', detail: 'Member wording reviewed and approved before publishing.', human_authorised: true },
  { id: 'au_6', org_id: ORG_ID, at: '2026-04-25T16:30:00+08:00', actor_name: 'KPSM finance', actor_role: 'kpsm', action: 'Payment recorded', entity: 'payment_stage', entity_ref: 'CLM-0417-01', detail: 'RM 35,700 paid to EGMH. Reference KPSM/TT/26/00812.', human_authorised: true },
  { id: 'au_5', org_id: ORG_ID, at: '2026-04-24T11:05:00+08:00', actor_name: 'Hj. Zulkifli Awang', actor_role: 'kpsm', action: 'Payment authorised', entity: 'payment_stage', entity_ref: 'CLM-0417-01', detail: 'Release 1 authorised after verification of the signed contract and mobilisation record.', human_authorised: true },
  { id: 'au_4', org_id: ORG_ID, at: '2026-04-08T10:00:00+08:00', actor_name: 'Nurul Aisyah', actor_role: 'kobis', action: 'Contract recorded as signed', entity: 'project', entity_ref: 'EGMH-BAU-0417', detail: 'Building contract signed by the member and EGMH, witnessed by KOBIS.', human_authorised: true },
  { id: 'au_3', org_id: ORG_ID, at: '2026-03-14T16:05:00+08:00', actor_name: 'Amir bin Rahman', actor_role: 'member', action: 'Application submitted', entity: 'application', entity_ref: 'L2H-2026-0417', detail: 'The Harmoni (Family Series) selected. Six sections completed.', human_authorised: true },
  { id: 'au_2', org_id: ORG_ID, at: '2026-03-09T11:40:00+08:00', actor_name: 'Nurul Aisyah', actor_role: 'kobis', action: 'Land verified', entity: 'land', entity_ref: 'BAU/NT/22-1148', detail: 'Title and boundary confirmed against the land office extract.', human_authorised: true },
  { id: 'au_1', org_id: ORG_ID, at: '2026-03-02T09:15:00+08:00', actor_name: 'KPSM registry', actor_role: 'kpsm', action: 'Membership verified', entity: 'member_profile', entity_ref: 'KPSM-04127', detail: 'Membership number and standing confirmed against the KPSM register.', human_authorised: true },
];
