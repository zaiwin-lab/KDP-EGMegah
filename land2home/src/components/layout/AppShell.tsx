import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePortal } from '@/state/portal';
import { Badge, Button, Icon } from '@/components/ui';
import { Wordmark } from './Wordmark';
import { Signature } from '@/components/Signature';
import { cn } from '@/lib/cn';
import type { Role } from '@/lib/types';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles: Role[];
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: '/app', label: 'Dashboard', icon: 'home', roles: ['member'], end: true },
  { to: '/app/journey', label: 'My journey', icon: 'land', roles: ['member'] },
  { to: '/app/progress', label: 'Build progress', icon: 'build', roles: ['member'] },
  { to: '/app/payments', label: 'Payments', icon: 'money', roles: ['member'] },
  { to: '/app/inspection', label: 'Inspection & keys', icon: 'key', roles: ['member'] },
  { to: '/app/documents', label: 'Documents', icon: 'doc', roles: ['member'] },
  { to: '/app/profile', label: 'My details', icon: 'person', roles: ['member'] },

  { to: '/admin', label: 'Overview', icon: 'home', roles: ['kobis', 'kpsm'], end: true },
  { to: '/admin/payments', label: 'Payment releases', icon: 'money', roles: ['kobis', 'kpsm'] },
  { to: '/admin/updates', label: 'Progress updates', icon: 'photo', roles: ['kobis', 'kpsm'] },
  { to: '/admin/documents', label: 'Member documents', icon: 'doc', roles: ['kobis', 'kpsm'] },
  { to: '/admin/audit', label: 'Audit trail', icon: 'lock', roles: ['kobis', 'kpsm'] },

  { to: '/egmh', label: 'Project', icon: 'build', roles: ['egmh'], end: true },
  { to: '/egmh/update', label: 'Submit update', icon: 'photo', roles: ['egmh'] },
  { to: '/egmh/claim', label: 'Payment claim', icon: 'money', roles: ['egmh'] },
  { to: '/egmh/rectification', label: 'Rectification', icon: 'search', roles: ['egmh'] },
];

const ROLE_LABEL: Record<Role, string> = {
  member: 'Member',
  kobis: 'KOBIS Berhad',
  kpsm: 'KPSM',
  egmh: 'EGMH',
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, unreadCount, signOut, mode } = usePortal();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const role = user?.role ?? 'member';
  const items = NAV.filter((item) => item.roles.includes(role));

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-dvh bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-lg focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-forest-50"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-sticky border-b border-forest-50/10 bg-onyx text-forest-50">
        <div className="mx-auto flex h-16 w-full max-w-[86rem] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            className="-ml-1 grid h-10 w-10 place-items-center rounded-lg text-forest-50/80 transition-colors hover:bg-forest-800 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="app-nav"
          >
            <Icon name={open ? 'close' : 'menu'} />
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>

          <Link to={role === 'member' ? '/app' : role === 'egmh' ? '/egmh' : '/admin'} className="flex items-center gap-2.5">
            <Wordmark tone="light" showPartners />
          </Link>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {mode === 'demo' && (
              <span className="hidden rounded-full border border-gold-500/35 px-2.5 py-1 text-2xs font-semibold uppercase tracking-wide text-gold-200 sm:inline-block">
                Demonstration data
              </span>
            )}
            {role === 'member' && (
              <Link
                to="/app"
                className="relative grid h-10 w-10 place-items-center rounded-lg text-forest-50/85 transition-colors hover:bg-forest-800"
              >
                <Icon name="bell" />
                <span className="sr-only">{unreadCount} unread updates</span>
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold-500 px-1 text-2xs font-bold text-forest-950">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <div className="hidden text-right sm:block">
              <p className="text-[0.8125rem] font-semibold leading-tight">{user?.display_name}</p>
              <p className="text-2xs leading-tight text-forest-50/65">{ROLE_LABEL[role]}</p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="grid h-10 w-10 place-items-center rounded-lg text-forest-50/85 transition-colors hover:bg-forest-800"
            >
              <Icon name="logout" />
              <span className="sr-only">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[86rem] gap-8 px-4 sm:px-6">
        <nav
          id="app-nav"
          className={cn(
            'shrink-0 lg:block lg:w-56 lg:py-8',
            open
              ? 'fixed inset-x-0 top-16 z-dropdown block border-b border-line bg-surface px-4 py-4 shadow-mid lg:static lg:border-0 lg:bg-transparent lg:shadow-none'
              : 'hidden',
          )}
        >
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-150',
                      isActive ? 'bg-forest-100 text-forest-800' : 'text-ink-2 hover:bg-forest-50 hover:text-ink',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon name={item.icon} className={isActive ? 'text-forest-700' : 'text-ink-3'} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main id="main" className="min-w-0 flex-1 py-6 sm:py-8">
          {children}
          <div className="mt-12 border-t border-line pt-7 pb-4">
            <Signature tone="dark" />
          </div>
        </main>
      </div>
    </div>
  );
}

export function PageHead({
  title,
  lead,
  action,
  badge,
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
  badge?: { tone: 'ok' | 'warn' | 'alert' | 'info' | 'gold' | 'neutral'; text: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[1.75rem] leading-tight tracking-[-0.015em] text-ink sm:text-[2rem]">{title}</h1>
          {badge && <Badge tone={badge.tone}>{badge.text}</Badge>}
        </div>
        {lead && <p className="mt-2 max-w-prose leading-relaxed text-ink-2">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export { Button };
