import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PortalProvider, usePortal } from '@/state/portal';
import { AppShell } from '@/components/layout/AppShell';
import { Skeleton } from '@/components/ui';
import type { Role } from '@/lib/types';

import Home from '@/pages/public/Home';
import Partnership from '@/pages/public/Partnership';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

import Dashboard from '@/pages/member/Dashboard';
import Journey from '@/pages/member/Journey';
import Apply from '@/pages/member/Apply';
import BuildProgress from '@/pages/member/BuildProgress';
import Payments from '@/pages/member/Payments';
import Inspection from '@/pages/member/Inspection';
import Documents from '@/pages/member/Documents';
import Profile from '@/pages/member/Profile';

import AdminOverview from '@/pages/admin/AdminOverview';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminUpdates from '@/pages/admin/AdminUpdates';
import AdminDocuments from '@/pages/admin/AdminDocuments';
import AuditTrail from '@/pages/admin/AuditTrail';

import EgmhProject from '@/pages/egmh/EgmhProject';
import EgmhUpdate from '@/pages/egmh/EgmhUpdate';
import EgmhClaim from '@/pages/egmh/EgmhClaim';
import EgmhRectification from '@/pages/egmh/EgmhRectification';

export default function App() {
  return (
    <PortalProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<Guard roles={['member']} />}>
          <Route index element={<Dashboard />} />
          <Route path="journey" element={<Journey />} />
          <Route path="apply" element={<Apply />} />
          <Route path="progress" element={<BuildProgress />} />
          <Route path="payments" element={<Payments />} />
          <Route path="inspection" element={<Inspection />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admin" element={<Guard roles={['kobis', 'kpsm']} />}>
          <Route index element={<AdminOverview />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="updates" element={<AdminUpdates />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="audit" element={<AuditTrail />} />
        </Route>

        <Route path="/egmh" element={<Guard roles={['egmh']} />}>
          <Route index element={<EgmhProject />} />
          <Route path="update" element={<EgmhUpdate />} />
          <Route path="claim" element={<EgmhClaim />} />
          <Route path="rectification" element={<EgmhRectification />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </PortalProvider>
  );
}

import { Outlet } from 'react-router-dom';

const HOME_FOR: Record<Role, string> = { member: '/app', kobis: '/admin', kpsm: '/admin', egmh: '/egmh' };

/* Roles reach only their own area. This is a usability guard, not the
   security boundary: row-level security in the database is what actually
   stops one member reading another member's project. */
function Guard({ roles }: { roles: Role[] }) {
  const { ready, user } = usePortal();
  const location = useLocation();

  if (!ready) return <BootSkeleton />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(user.role)) return <Navigate to={HOME_FOR[user.role]} replace />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

function BootSkeleton() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="h-16 bg-forest-900" />
      <div className="shell space-y-4 py-10">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </div>
  );
}
