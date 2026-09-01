import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { usePortal } from '@/state/portal';
import { Button, FieldShell, Icon, Input, Panel } from '@/components/ui';
import { Wordmark } from '@/components/layout/Wordmark';

const DEMO_ACCOUNTS = [
  { email: 'amir@demo.land2home.my', label: 'Amir bin Rahman', role: 'Member building in Bau, Sarawak' },
  { email: 'kobis@demo.land2home.my', label: 'Nurul Aisyah', role: 'Journey coordinator, KOBIS Berhad' },
  { email: 'kpsm@demo.land2home.my', label: 'Hj. Zulkifli Awang', role: 'Payment authorising officer, KPSM' },
  { email: 'egmh@demo.land2home.my', label: 'Sim Chee Hong', role: 'Site manager, EGMH' },
];

const HOME_FOR: Record<string, string> = { member: '/app', kobis: '/admin', kpsm: '/admin', egmh: '/egmh' };

export default function Login() {
  const { user, ready, signIn, mode } = usePortal();
  const navigate = useNavigate();
  const [email, setEmail] = useState('amir@demo.land2home.my');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (ready && user) return <Navigate to={HOME_FOR[user.role] ?? '/app'} replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const account = await signIn(email);
      navigate(HOME_FOR[account.role] ?? '/app', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not sign you in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink-2 hover:text-ink">
          <Wordmark />
        </Link>

        <div className="mx-auto flex w-full max-w-[24rem] flex-1 flex-col justify-center py-12">
          <p className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-3 py-1.5 text-[0.8125rem] font-semibold text-gold-700">
            <Icon name="key" size={14} />
            KPSM Bau members
          </p>
          <h1 className="mt-3 font-display text-[2rem] leading-tight tracking-[-0.015em] text-ink">Welcome back</h1>
          <p className="mt-2 leading-relaxed text-ink-2">
            Sign in to see where your house is, what has been done, and whether anything needs you.
            Your details are already here, so there is nothing to fill in twice.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <FieldShell label="Email address" htmlFor="email" required error={error ?? undefined}>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                invalid={Boolean(error)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </FieldShell>

            <FieldShell
              label="Password"
              htmlFor="password"
              required
              hint={mode === 'demo' ? 'Any password works in the demonstration.' : undefined}
            >
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FieldShell>

            <Button type="submit" size="lg" loading={busy} className="w-full">
              Sign in
            </Button>
          </form>

          {mode === 'demo' && (
            <Panel className="mt-8 overflow-hidden">
              <p className="border-b border-line bg-forest-50 px-4 py-2.5 text-[0.8125rem] font-semibold text-forest-800">
                Demonstration accounts
              </p>
              <ul className="divide-y divide-line">
                {DEMO_ACCOUNTS.map((account) => (
                  <li key={account.email}>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(account.email);
                        setError(null);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-forest-50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">{account.label}</span>
                        <span className="block truncate text-[0.8125rem] text-ink-2">{account.role}</span>
                      </span>
                      <Icon name="chevron" size={16} className="text-ink-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-onyx lg:block">
        <img
          src="/egmh/harmoni.jpg"
          alt="The Harmoni, a contemporary EGMH family home with a dark pitched roof and a deep covered porch."
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx via-onyx/85 to-transparent px-10 pb-10 pt-28">
          <p className="font-display text-2xl italic text-gold-200">From Land. To Vision. To Home.</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-forest-50/75">
            Built by EG Megah Holdings. Operated by KOBIS Berhad. Payments governed by KPSM Bau.
          </p>
        </div>
      </div>
    </div>
  );
}
