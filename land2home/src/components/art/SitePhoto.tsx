import { cn } from '@/lib/cn';

/* Stand-ins for site photographs. Each plate actually depicts the stage it
   is captioned with, so a member reading the progress page sees the work
   change over time rather than the same grey box. Swap these for real
   photographs from Supabase storage in production (see README). */

type Plate = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

const SKY = 'oklch(0.62 0.050 148)';
const SKY_2 = 'oklch(0.78 0.045 92)';
const EARTH = 'oklch(0.45 0.050 78)';
const EARTH_2 = 'oklch(0.36 0.042 78)';
const CONCRETE = 'oklch(0.70 0.014 100)';
const TIMBER = 'oklch(0.66 0.075 74)';
const STEEL = 'oklch(0.52 0.020 240)';

export function SitePhoto({ plate, className }: { plate: string; className?: string }) {
  const key = (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(plate) ? plate : 'a') as Plate;
  return (
    <svg viewBox="0 0 320 200" className={cn('block h-full w-full', className)} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SKY} />
          <stop offset="100%" stopColor={SKY_2} />
        </linearGradient>
        <linearGradient id={`earth-${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={EARTH} />
          <stop offset="100%" stopColor={EARTH_2} />
        </linearGradient>
      </defs>

      <rect width="320" height="200" fill={`url(#sky-${key})`} />
      <path d="M0 96 L52 82 L104 94 L162 74 L222 92 L276 78 L320 90 L320 200 L0 200 Z" fill="oklch(0.34 0.042 156)" />
      <rect y="118" width="320" height="82" fill={`url(#earth-${key})`} />

      {key === 'g' && <Cleared />}
      {key === 'f' && <Excavation />}
      {key === 'd' && <GroundBeams />}
      {key === 'e' && <SlabPrep />}
      {key === 'c' && <Columns />}
      {key === 'a' && <RoofBeams />}
      {key === 'b' && <Elevation />}
    </svg>
  );
}

const Cleared = () => (
  <g>
    <path d="M64 150 L160 128 L262 148 L164 172 Z" fill="oklch(0.52 0.048 82)" />
    <path d="M64 150 L160 128 L262 148 L164 172 Z" fill="none" stroke="oklch(0.80 0.09 86)" strokeWidth="1.3" strokeDasharray="5 4" />
    {[[64, 150], [160, 128], [262, 148], [164, 172]].map(([x, y]) => (
      <line key={x} x1={x} y1={y} x2={x} y2={y - 13} stroke="oklch(0.84 0.10 86)" strokeWidth="2" strokeLinecap="round" />
    ))}
  </g>
);

const Excavation = () => (
  <g>
    <path d="M70 156 L158 134 L254 154 L162 178 Z" fill="oklch(0.38 0.046 78)" />
    {[[96, 152], [148, 141], [200, 150], [148, 164]].map(([x, y], i) => (
      <rect key={i} x={x - 13} y={y - 6} width="26" height="12" rx="2" fill="oklch(0.28 0.038 78)" />
    ))}
    <g stroke={STEEL} strokeWidth="1.4" opacity="0.9">
      <path d="M84 148 h34 M84 152 h34 M140 138 h34 M140 142 h34" />
    </g>
  </g>
);

const GroundBeams = () => (
  <g>
    <path d="M68 154 L158 132 L256 152 L162 176 Z" fill={CONCRETE} />
    <path d="M68 154 L158 132 L256 152 L162 176 Z" fill="none" stroke="oklch(0.80 0.012 100)" strokeWidth="1.4" />
    <path d="M112 145 L206 163 M112 163 L206 145" stroke="oklch(0.60 0.014 100)" strokeWidth="4" />
  </g>
);

const SlabPrep = () => (
  <g>
    <path d="M66 156 L158 132 L258 154 L162 178 Z" fill="oklch(0.60 0.020 100)" />
    <g stroke={STEEL} strokeWidth="1.1" opacity="0.85">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={80 + i * 30} y1={152 - i * 4} x2={110 + i * 30} y2={172 - i * 4} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={`b${i}`} x1={84 + i * 12} y1={158 + i * 5} x2={220 + i * 12} y2={140 + i * 5} />
      ))}
    </g>
  </g>
);

const Columns = () => (
  <g>
    <path d="M70 154 L158 133 L252 152 L162 174 Z" fill={CONCRETE} />
    <g stroke={CONCRETE} strokeWidth="7" strokeLinecap="square">
      <line x1="88" y1="150" x2="88" y2="104" />
      <line x1="158" y1="136" x2="158" y2="88" />
      <line x1="234" y1="150" x2="234" y2="104" />
      <line x1="162" y1="170" x2="162" y2="122" />
    </g>
    <g stroke={STEEL} strokeWidth="1.3" opacity="0.9">
      <path d="M88 104 v-12 M84 100 v-12 M92 100 v-12 M158 88 v-12 M154 84 v-12 M162 84 v-12 M234 104 v-12 M230 100 v-12 M238 100 v-12" />
    </g>
  </g>
);

const RoofBeams = () => (
  <g>
    <path d="M70 154 L158 133 L252 152 L162 174 Z" fill={CONCRETE} />
    <g stroke={CONCRETE} strokeWidth="7" strokeLinecap="square">
      <line x1="88" y1="150" x2="88" y2="100" />
      <line x1="158" y1="136" x2="158" y2="84" />
      <line x1="234" y1="150" x2="234" y2="100" />
      <line x1="162" y1="170" x2="162" y2="118" />
    </g>
    <g stroke={CONCRETE} strokeWidth="6" strokeLinecap="round" fill="none">
      <path d="M88 100 L158 84 L234 100" />
      <path d="M88 100 L162 118 L234 100" />
    </g>
    <g stroke={TIMBER} strokeWidth="2" opacity="0.8">
      <path d="M104 96 h116 M112 92 h100" />
    </g>
  </g>
);

const Elevation = () => (
  <g>
    <path d="M52 160 L158 134 L268 158 L162 182 Z" fill="oklch(0.50 0.046 82)" />
    <g stroke={CONCRETE} strokeWidth="8" strokeLinecap="square">
      <line x1="86" y1="152" x2="86" y2="96" />
      <line x1="158" y1="136" x2="158" y2="78" />
      <line x1="236" y1="152" x2="236" y2="96" />
    </g>
    <path d="M86 96 L158 78 L236 96" stroke={CONCRETE} strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M86 96 L158 60 L236 96" stroke={TIMBER} strokeWidth="3" fill="none" strokeLinecap="round" />
    <line x1="158" y1="60" x2="158" y2="78" stroke={TIMBER} strokeWidth="3" strokeLinecap="round" />
    <path d="M20 176 h280" stroke="oklch(0.32 0.040 78)" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
  </g>
);
