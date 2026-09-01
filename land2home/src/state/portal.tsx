import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Application, Defect, DocumentRecord, Handover, Inspection, LandParcel, MemberProfile,
  Milestone, Notification, PaymentStage, ProgressUpdate, Project, UserAccount, WarrantyItem,
  WarrantyRequest,
} from '@/lib/types';
import { repository } from '@/data';
import type { Actor } from '@/data/repository';
import { buildJourney, memberActions } from '@/lib/journey';

interface PortalState {
  ready: boolean;
  user: UserAccount | null;
  profile: MemberProfile | null;
  land: LandParcel | null;
  application: Application | null;
  project: Project | null;
  milestones: Milestone[];
  updates: ProgressUpdate[];
  payments: PaymentStage[];
  documents: DocumentRecord[];
  inspection: Inspection | null;
  defects: Defect[];
  handover: Handover | null;
  warranties: WarrantyItem[];
  warrantyRequests: WarrantyRequest[];
  notifications: Notification[];
}

const EMPTY: PortalState = {
  ready: false, user: null, profile: null, land: null, application: null, project: null,
  milestones: [], updates: [], payments: [], documents: [], inspection: null, defects: [],
  handover: null, warranties: [], warrantyRequests: [], notifications: [],
};

interface PortalValue extends PortalState {
  actor: Actor;
  journey: ReturnType<typeof buildJourney>;
  actions: ReturnType<typeof memberActions>;
  unreadCount: number;
  signIn: (email: string) => Promise<UserAccount>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  mode: 'demo' | 'supabase';
}

const PortalContext = createContext<PortalValue | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const repo = useMemo(() => repository(), []);
  const [state, setState] = useState<PortalState>(EMPTY);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    const user = await repo.getSession();
    if (!user) {
      if (mounted.current) setState({ ...EMPTY, ready: true });
      return;
    }

    /* Staff roles look at the same demonstration project as the member,
       through views scoped to what their role is allowed to do. */
    const profile = await repo.getProfile('usr_member');
    if (!profile) {
      if (mounted.current) setState({ ...EMPTY, ready: true, user });
      return;
    }

    const [land, application, project, documents, notifications] = await Promise.all([
      repo.getLand(profile.id),
      repo.getApplication(profile.id),
      repo.getProjectForProfile(profile.id),
      repo.listDocuments(profile.id),
      repo.listNotifications(profile.id),
    ]);

    let milestones: Milestone[] = [];
    let updates: ProgressUpdate[] = [];
    let payments: PaymentStage[] = [];
    let inspection: Inspection | null = null;
    let defects: Defect[] = [];
    let handover: Handover | null = null;
    let warranties: WarrantyItem[] = [];
    let warrantyRequests: WarrantyRequest[] = [];

    if (project) {
      [milestones, updates, payments, inspection, defects, handover, warranties, warrantyRequests] =
        await Promise.all([
          repo.listMilestones(project.id),
          repo.listProgressUpdates(project.id, { includeUnpublished: user.role !== 'member' }),
          repo.listPaymentStages(project.id),
          repo.getInspection(project.id),
          repo.listDefects(project.id),
          repo.getHandover(project.id),
          repo.listWarranties(project.id),
          repo.listWarrantyRequests(project.id),
        ]);
    }

    if (mounted.current) {
      setState({
        ready: true, user, profile, land, application, project, milestones, updates, payments,
        documents, inspection, defects, handover, warranties, warrantyRequests, notifications,
      });
    }
  }, [repo]);

  useEffect(() => {
    void load();
  }, [load]);

  const signIn = useCallback(
    async (email: string) => {
      const user = await repo.signIn(email);
      await load();
      return user;
    },
    [repo, load],
  );

  const signOut = useCallback(async () => {
    await repo.signOut();
    setState({ ...EMPTY, ready: true });
  }, [repo]);

  const value = useMemo<PortalValue>(() => {
    const journeyInput = {
      profile: state.profile,
      land: state.land,
      application: state.application,
      project: state.project,
      inspection: state.inspection,
      defects: state.defects,
      handover: state.handover,
    };
    return {
      ...state,
      mode: repo.mode,
      actor: {
        name: state.user?.display_name ?? 'Unknown user',
        role: state.user?.role ?? 'member',
      },
      journey: buildJourney(journeyInput),
      actions: memberActions({ ...journeyInput, documents: state.documents, payments: state.payments }),
      unreadCount: state.notifications.filter((n) => !n.read).length,
      signIn,
      signOut,
      refresh: load,
    };
  }, [state, repo.mode, signIn, signOut, load]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside PortalProvider');
  return ctx;
}

export const useRepo = () => repository();
