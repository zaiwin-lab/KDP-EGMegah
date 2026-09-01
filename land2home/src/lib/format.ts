export const myr = (n: number | null | undefined, opts?: { compact?: boolean }) => {
  if (n === null || n === undefined) return '—';
  if (opts?.compact && n >= 1000) {
    return `RM ${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  }
  return `RM ${n.toLocaleString('en-MY', { maximumFractionDigits: 0 })}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const shortDate = (iso: string | undefined | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const dayMonth = (iso: string | undefined | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

export const dateTime = (iso: string | undefined | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${shortDate(iso)}, ${hh}:${mm}`;
};

export const relative = (iso: string | undefined | null) => {
  if (!iso) return '';
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? 'last month' : `${months} months ago`;
};

export const sqft = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : `${n.toLocaleString('en-MY')} sq ft`;

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
