import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

/* One vocabulary for every screen. Buttons, fields and status marks look
   and behave the same in the member portal, the KPSM view and the EGMH
   view, so nothing reads as a different control doing the same job. */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out4 ' +
  'focus-visible:outline-none focus-visible:ring-4 active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-forest-800 text-forest-50 shadow-low hover:bg-forest-700 focus-visible:ring-forest-600/25 ' +
    'disabled:hover:bg-forest-800',
  secondary:
    'border border-line-2 bg-raised text-ink hover:border-forest-600 hover:text-forest-800 ' +
    'focus-visible:ring-forest-600/20 disabled:hover:border-line-2 disabled:hover:text-ink',
  ghost:
    'text-forest-800 hover:bg-forest-100/70 focus-visible:ring-forest-600/20',
  danger:
    'border border-alert/35 bg-alert-bg text-alert hover:border-alert/60 focus-visible:ring-alert/20',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem]',
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-12 px-6 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
});

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: {
  to: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentProps<typeof Link>, 'to' | 'className' | 'children'>) {
  return (
    <Link to={to} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
    </Link>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
    />
  );
}

/* ── Status marks ───────────────────────────────────────────────── */

export type Tone = 'neutral' | 'ok' | 'warn' | 'alert' | 'info' | 'gold';

const TONES: Record<Tone, string> = {
  neutral: 'bg-forest-100 text-forest-800',
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  alert: 'bg-alert-bg text-alert',
  info: 'bg-info-bg text-info',
  gold: 'bg-gold-100 text-gold-700',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-semibold leading-none',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = 'neutral' }: { tone?: Tone }) {
  const fill: Record<Tone, string> = {
    neutral: 'bg-ink-3',
    ok: 'bg-ok',
    warn: 'bg-warn',
    alert: 'bg-alert',
    info: 'bg-info',
    gold: 'bg-gold-600',
  };
  return <span aria-hidden className={cn('h-1.5 w-1.5 shrink-0 rounded-full', fill[tone])} />;
}

/* ── Form controls ──────────────────────────────────────────────── */

interface FieldShellProps {
  label: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function FieldShell({ label, hint, error, required, htmlFor, children, action }: FieldShellProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label className="label" htmlFor={htmlFor}>
          {label}
          {!required && <span className="ml-1.5 font-medium text-ink-3">optional</span>}
        </label>
        {action}
      </div>
      {children}
      {error ? (
        <p className="mt-1.5 text-sm font-medium text-alert">{error}</p>
      ) : hint ? (
        <p className="hint">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className, invalid, ...rest }, ref) {
    return <input ref={ref} className={cn('field', invalid && 'field-invalid', className)} aria-invalid={invalid || undefined} {...rest} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ className, invalid, ...rest }, ref) {
    return <textarea ref={ref} className={cn('field min-h-[7rem] resize-y', invalid && 'field-invalid', className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cn('field appearance-none bg-[right_0.9rem_center] bg-no-repeat pr-10', className)} style={arrow} {...rest}>
      {children}
    </select>
  );
});

const arrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5l5-5' fill='none' stroke='%235c6b60' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
} as const;

/* ── Structure ──────────────────────────────────────────────────── */

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('panel', className)}>{children}</section>;
}

export function PanelHeader({
  title,
  description,
  action,
  as: Tag = 'h2',
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h2' | 'h3';
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <Tag className="text-[0.95rem] font-bold tracking-[-0.01em] text-ink">{title}</Tag>
        {description && <p className="mt-1 max-w-prose text-sm text-ink-2">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-2">{children}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

/* A note that says who is accountable for something, or what the portal
   deliberately does not do. Used wherever a member might otherwise assume
   the software decided something. */
export function Assurance({ children, icon = 'lock' }: { children: ReactNode; icon?: 'lock' | 'person' | 'info' }) {
  return (
    <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-2">
      <Icon name={icon} className="mt-0.5 shrink-0 text-forest-600" />
      <span>{children}</span>
    </p>
  );
}

/* ── Icons: one line-drawn set, 1.6 stroke, no fills ────────────── */

const PATHS: Record<string, ReactNode> = {
  lock: <><rect x="4" y="8" width="12" height="8" rx="2" /><path d="M7 8V6a3 3 0 0 1 6 0v2" /></>,
  person: <><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" /></>,
  info: <><circle cx="10" cy="10" r="7.2" /><path d="M10 9.2v4.3M10 6.6v.1" /></>,
  check: <path d="m4.5 10.5 3.6 3.6L15.5 6.7" />,
  arrow: <path d="M4 10h11m-4.2-4.4L15.2 10l-4.4 4.4" />,
  home: <><path d="m3.5 9.4 6.5-5.6 6.5 5.6" /><path d="M5.5 8.6V16h9V8.6" /></>,
  land: <><path d="M2.6 13.4 10 4.6l7.4 8.8" /><path d="M2.6 15.6h14.8" /></>,
  plan: <><rect x="4" y="3.2" width="12" height="13.6" rx="2" /><path d="M7 7.4h6M7 10.4h6M7 13.4h3.4" /></>,
  build: <><path d="M3.4 16.6h13.2" /><path d="M5.6 16.6V8.2l4.4-3.2 4.4 3.2v8.4" /><path d="M8.6 16.6v-4h2.8v4" /></>,
  search: <><circle cx="9" cy="9" r="5.2" /><path d="m12.8 12.8 3.4 3.4" /></>,
  key: <><circle cx="7" cy="9.6" r="3.4" /><path d="M10.2 8.6h6.2m-2 0v2.4m-2-2.4v3.2" /></>,
  bell: <><path d="M5.8 8.6a4.2 4.2 0 0 1 8.4 0c0 3.4 1.2 4.6 1.2 4.6H4.6s1.2-1.2 1.2-4.6Z" /><path d="M8.4 15.8a1.8 1.8 0 0 0 3.2 0" /></>,
  photo: <><rect x="3.2" y="4.6" width="13.6" height="10.8" rx="2" /><path d="m4.4 13.2 3.4-3.4 2.6 2.6 2.2-2 3 3" /><circle cx="12.6" cy="8" r="1" /></>,
  doc: <><path d="M11.2 3.4H6.4a1.6 1.6 0 0 0-1.6 1.6v10a1.6 1.6 0 0 0 1.6 1.6h7.2a1.6 1.6 0 0 0 1.6-1.6V7.4Z" /><path d="M11.2 3.4v4h4" /></>,
  money: <><rect x="2.8" y="5.4" width="14.4" height="9.2" rx="2" /><circle cx="10" cy="10" r="2.2" /></>,
  clock: <><circle cx="10" cy="10" r="7" /><path d="M10 6v4.2l2.6 1.6" /></>,
  phone: <path d="M6.4 3.6 8 3.4l1.6 3.2-1.6 1.2a8.6 8.6 0 0 0 4.2 4.2l1.2-1.6 3.2 1.6-.2 1.6a1.6 1.6 0 0 1-1.8 1.4C9.8 14.6 5.4 10.2 5 5.4a1.6 1.6 0 0 1 1.4-1.8Z" />,
  chevron: <path d="m7.6 5.2 4.8 4.8-4.8 4.8" />,
  alert: <><path d="M10 3.6 17.2 16H2.8L10 3.6Z" /><path d="M10 8.4v3.2M10 13.8v.1" /></>,
  menu: <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />,
  close: <path d="m5.5 5.5 9 9m0-9-9 9" />,
  sparkle: <path d="M10 3.4 11.5 8 16 9.5 11.5 11 10 15.6 8.5 11 4 9.5 8.5 8 10 3.4Z" />,
  logout: <><path d="M12 6.2V4.6a1.6 1.6 0 0 0-1.6-1.6H5.2a1.6 1.6 0 0 0-1.6 1.6v10.8a1.6 1.6 0 0 0 1.6 1.6h5.2a1.6 1.6 0 0 0 1.6-1.6v-1.6" /><path d="M8.4 10h8m-2.6-2.6L16.4 10l-2.6 2.6" /></>,
};

export function Icon({ name, className, size = 20 }: { name: keyof typeof PATHS | string; className?: string; size?: number }) {
  const path = PATHS[name] ?? PATHS.info;
  return (
    <svg
      aria-hidden
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
    >
      {path}
    </svg>
  );
}
