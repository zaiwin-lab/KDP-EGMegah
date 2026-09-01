import type {
  Application, Defect, DocumentRecord, Handover, Inspection, JourneyStage, LandParcel,
  MemberAction, MemberProfile, Milestone, PaymentStage, PaymentStageStatus, Project, StageKey,
} from './types';

export const STAGE_ORDER: StageKey[] = ['land', 'home', 'plan', 'build', 'inspection', 'keys'];

export const STAGE_META: Record<StageKey, { title: string; blurb: string }> = {
  land: { title: 'My Land', blurb: 'Membership, land and eligibility confirmed.' },
  home: { title: 'My Home', blurb: 'Choose the house that fits your family and your land.' },
  plan: { title: 'My Plan', blurb: 'Site visit, price, financing, documents and contract.' },
  build: { title: 'My Build', blurb: 'Construction, photographs and expected dates.' },
  inspection: { title: 'My Inspection', blurb: 'Walk through the house and list anything to put right.' },
  keys: { title: 'My Keys', blurb: 'Handover, documents, warranties and aftercare.' },
};

interface JourneyInput {
  profile: MemberProfile | null;
  land: LandParcel | null;
  application: Application | null;
  project: Project | null;
  inspection: Inspection | null;
  defects: Defect[];
  handover: Handover | null;
}

export function buildJourney(input: JourneyInput): JourneyStage[] {
  const { profile, land, application, project, inspection, defects, handover } = input;

  const landDone = profile?.membership_status === 'verified' && land?.verification_status === 'verified';
  const homeDone = Boolean(application?.house_type);
  const planDone = Boolean(project?.contract_signed_at);
  const buildDone = (project?.overall_progress ?? 0) >= 100;
  const inspectionDone =
    inspection?.status === 'completed' && defects.every((d) => d.status === 'resolved');
  const keysDone = handover?.status === 'completed';

  const done: Record<StageKey, boolean> = {
    land: Boolean(landDone),
    home: homeDone,
    plan: planDone,
    build: buildDone,
    inspection: Boolean(inspectionDone),
    keys: Boolean(keysDone),
  };

  const summaries: Record<StageKey, string> = {
    land: landDone
      ? `Membership ${profile?.membership_no} and ${land?.lot_no} in ${land?.district} are both confirmed.`
      : land
        ? 'Your land details are with KOBIS for checking.'
        : 'Tell us about your membership and the land you want to build on.',
    home: homeDone
      ? `You chose ${application?.house_type === 'CUSTOM' ? 'a custom plan' : `Type ${application?.house_type}`}.`
      : 'Compare Type A, Type B, Type C or a custom plan.',
    plan: planDone
      ? `Contract signed and the price is fixed at the agreed contract sum.`
      : application?.status === 'quotation_issued'
        ? 'Your quotation is ready to review.'
        : 'EGMH visits your land, then prices the work.',
    build: project
      ? buildDone
        ? 'Construction is complete.'
        : `${project.construction_phase} — ${project.overall_progress}% of the whole build.`
      : 'Construction starts once the contract is signed.',
    inspection: inspection?.status === 'completed'
      ? `${defects.filter((d) => d.status !== 'resolved').length} item(s) still open.`
      : inspection?.status === 'scheduled'
        ? 'Your joint inspection is scheduled.'
        : 'You will walk through the house before you accept it.',
    keys: keysDone
      ? 'Handover complete. Your home file and warranties are in the portal.'
      : 'Handover, your digital home file, warranties and aftercare.',
  };

  let activeAssigned = false;
  return STAGE_ORDER.map((key) => {
    let status: JourneyStage['status'];
    if (done[key]) {
      status = 'complete';
    } else if (!activeAssigned) {
      status = 'active';
      activeAssigned = true;
    } else {
      status = 'locked';
    }
    return { key, title: STAGE_META[key].title, member_summary: summaries[key], status };
  });
}

/* Payment workflow, as the member and the officers both see it. */
export const PAYMENT_WORKFLOW = [
  { key: 'claim_submitted', label: 'EGMH submits claim and evidence', by: 'EGMH' },
  { key: 'technical_verification', label: 'Technical verification', by: 'KOBIS' },
  { key: 'awaiting_authorisation', label: 'KPSM authorisation', by: 'KPSM' },
  { key: 'authorised', label: 'Payment recorded', by: 'KPSM' },
  { key: 'paid', label: 'Member notified', by: 'KOBIS' },
] as const;

/* Index of the last COMPLETED step in PAYMENT_WORKFLOW; -1 = not started.
   A status names the step now in progress, so the step it names is not yet
   done: `awaiting_authorisation` means verification is complete and KPSM
   authorisation is still outstanding. */
export function workflowIndex(status: PaymentStageStatus): number {
  switch (status) {
    case 'not_due': return -1;
    case 'claim_submitted': return 0;
    case 'technical_verification': return 0;
    case 'awaiting_authorisation': return 1;
    case 'authorised': return 2;
    case 'paid': return 4;
  }
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStageStatus, string> = {
  not_due: 'Not due yet',
  claim_submitted: 'Claim submitted by EGMH',
  technical_verification: 'Being checked',
  awaiting_authorisation: 'With KPSM for authorisation',
  authorised: 'Authorised, payment being recorded',
  paid: 'Paid',
};

export function progressFromMilestones(milestones: Milestone[]): number {
  const total = milestones.reduce((sum, m) => sum + m.weight, 0);
  if (!total) return 0;
  const earned = milestones.reduce((sum, m) => {
    if (m.status === 'complete') return sum + m.weight;
    if (m.status === 'in_progress') return sum + m.weight * 0.35;
    return sum;
  }, 0);
  return Math.round((earned / total) * 100);
}

export function nextMilestone(milestones: Milestone[]): Milestone | null {
  return (
    milestones.find((m) => m.status === 'in_progress') ??
    milestones.find((m) => m.status === 'not_started') ??
    null
  );
}

interface ActionInput extends JourneyInput {
  documents: DocumentRecord[];
  payments: PaymentStage[];
}

/* What the member has to do, computed from state rather than hand-kept.
   An empty list is a real answer: "nothing needed from you right now". */
export function memberActions(input: ActionInput): MemberAction[] {
  const actions: MemberAction[] = [];
  const { profile, land, application, documents, defects, handover, inspection } = input;

  if (profile && profile.membership_status !== 'verified') {
    actions.push({
      id: 'verify-membership',
      title: 'Confirm your KPSM membership details',
      detail: 'KPSM checks your membership number before anything else can start.',
      cta: 'Complete membership details',
      href: '/app/apply',
      urgency: 'now',
    });
  }

  if (land && land.verification_status === 'query') {
    actions.push({
      id: 'land-query',
      title: 'A question about your land title',
      detail: land.verification_note ?? 'KOBIS needs one clarification before the land can be confirmed.',
      cta: 'Open land details',
      href: '/app/apply',
      urgency: 'now',
    });
  }

  if (application && application.status === 'draft') {
    actions.push({
      id: 'finish-application',
      title: 'Finish your application',
      detail: `You are on section ${application.last_step} of 6. Everything you have entered is saved.`,
      cta: 'Continue where you left off',
      href: '/app/apply',
      urgency: 'now',
    });
  }

  /* A valid document is never requested again. Only ones that are
     genuinely expiring are surfaced. */
  const soon = Date.now() + 60 * 86400000;
  documents
    .filter((d) => d.valid_until && new Date(d.valid_until).getTime() < soon && d.status === 'verified')
    .forEach((d) => {
      actions.push({
        id: `renew-${d.id}`,
        title: `Replace your ${d.title.toLowerCase()} before it expires`,
        detail: 'It is still valid and accepted. Uploading a fresh copy now keeps the later payment releases moving.',
        cta: 'Upload a newer copy',
        href: '/app/documents',
        urgency: 'soon',
        due: d.valid_until,
      });
    });

  const resolvedUnconfirmed = defects.filter((d) => d.status === 'resolved' && !d.member_confirmed);
  if (resolvedUnconfirmed.length) {
    actions.push({
      id: 'confirm-rectification',
      title: `Confirm ${resolvedUnconfirmed.length} repaired item${resolvedUnconfirmed.length > 1 ? 's' : ''}`,
      detail: 'EGMH says these are done. Have a look and tell us whether you are happy.',
      cta: 'Review the repairs',
      href: '/app/inspection',
      urgency: 'now',
    });
  }

  if (inspection?.status === 'scheduled' && inspection.scheduled_for) {
    actions.push({
      id: 'attend-inspection',
      title: 'Joint inspection booked',
      detail: 'Walk through the house with KOBIS and EGMH, and note anything that needs putting right.',
      cta: 'See what happens on the day',
      href: '/app/inspection',
      urgency: 'soon',
      due: inspection.scheduled_for,
    });
  }

  if (handover?.status === 'appointment_offered') {
    actions.push({
      id: 'confirm-handover',
      title: 'Confirm your handover appointment',
      detail: 'Pick the day you would like to collect your keys.',
      cta: 'Confirm the appointment',
      href: '/app/inspection',
      urgency: 'now',
      due: handover.appointment_at,
    });
  }

  return actions;
}
