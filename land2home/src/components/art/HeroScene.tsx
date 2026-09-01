/* Hand-built scene rather than stock photography: a cleared plot on a
   Sarawak hillside with a house frame going up. Renders identically for
   every visitor, needs no network request, and can be replaced with a real
   site photograph later (see README, "Replacing the artwork"). */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 560"
      className={className}
      role="img"
      aria-label="A cleared plot on a hillside at first light, with the timber frame of a family house standing on a fresh foundation and forested ridges behind it."
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.30 0.048 158)" />
          <stop offset="52%" stopColor="oklch(0.46 0.055 150)" />
          <stop offset="100%" stopColor="oklch(0.70 0.070 92)" />
        </linearGradient>
        <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.36 0.040 158)" />
          <stop offset="100%" stopColor="oklch(0.30 0.038 158)" />
        </linearGradient>
        <linearGradient id="ridgeMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.29 0.046 156)" />
          <stop offset="100%" stopColor="oklch(0.235 0.042 156)" />
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.315 0.036 120)" />
          <stop offset="100%" stopColor="oklch(0.205 0.030 120)" />
        </linearGradient>
        <linearGradient id="plot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.475 0.052 88)" />
          <stop offset="100%" stopColor="oklch(0.355 0.044 88)" />
        </linearGradient>
        <radialGradient id="glow" cx="0.72" cy="0.86" r="0.55">
          <stop offset="0%" stopColor="oklch(0.86 0.12 88)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.86 0.12 88)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="560" fill="url(#sky)" />
      <circle cx="576" cy="300" r="34" fill="oklch(0.88 0.10 88)" opacity="0.9" />
      <rect width="800" height="560" fill="url(#glow)" />

      {/* Far ridge */}
      <path
        d="M0 318 L74 286 L138 306 L206 262 L284 300 L352 268 L430 302 L512 258 L590 296 L668 270 L740 300 L800 282 L800 560 L0 560 Z"
        fill="url(#ridgeFar)"
      />
      {/* Near ridge with a suggestion of forest canopy */}
      <path
        d="M0 372 L58 350 L118 366 L184 336 L252 362 L322 340 L398 368 L470 342 L548 370 L624 348 L700 372 L764 352 L800 366 L800 560 L0 560 Z"
        fill="url(#ridgeMid)"
      />
      <g fill="oklch(0.26 0.040 156)" opacity="0.85">
        {[40, 96, 152, 214, 268, 330, 392, 452, 512, 578, 640, 706, 766].map((x, i) => (
          <ellipse key={x} cx={x} cy={366 + (i % 3) * 6} rx={22 + (i % 4) * 5} ry={11 + (i % 3) * 3} />
        ))}
      </g>

      {/* Ground */}
      <path d="M0 404 C 180 388, 320 400, 460 396 C 600 392, 700 402, 800 394 L800 560 L0 560 Z" fill="url(#ground)" />

      {/* The plot: cleared, levelled, pegged out */}
      <path d="M182 470 L410 424 L664 458 L452 524 Z" fill="url(#plot)" />
      <path d="M182 470 L410 424 L664 458 L452 524 Z" fill="none" stroke="oklch(0.62 0.09 86)" strokeWidth="1.6" strokeDasharray="7 6" opacity="0.75" />
      {[
        [182, 470], [410, 424], [664, 458], [452, 524],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <line x1={x} y1={y} x2={x} y2={y - 17} stroke="oklch(0.80 0.10 86)" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx={x} cy={y - 20} r="3" fill="oklch(0.84 0.11 86)" />
        </g>
      ))}

      {/* Foundation slab */}
      <path d="M286 466 L424 438 L562 462 L424 492 Z" fill="oklch(0.545 0.022 100)" />
      <path d="M286 466 L424 438 L562 462 L424 492 Z" fill="none" stroke="oklch(0.66 0.024 100)" strokeWidth="1.4" />

      {/* House frame going up */}
      <g stroke="oklch(0.80 0.075 82)" strokeWidth="3.4" strokeLinecap="round" fill="none">
        {/* Corner posts */}
        <line x1="300" y1="464" x2="300" y2="382" />
        <line x1="424" y1="440" x2="424" y2="352" />
        <line x1="548" y1="462" x2="548" y2="380" />
        <line x1="424" y1="490" x2="424" y2="404" />
        {/* Wall plates */}
        <path d="M300 382 L424 352 L548 380" />
        <path d="M300 382 L424 404 L548 380" />
        {/* Roof frame */}
        <path d="M300 382 L424 316 L548 380" />
        <line x1="424" y1="316" x2="424" y2="352" />
        <path d="M362 349 L424 334 L486 349" opacity="0.75" />
      </g>
      {/* Rafters */}
      <g stroke="oklch(0.72 0.070 82)" strokeWidth="2" strokeLinecap="round" opacity="0.8">
        <line x1="336" y1="363" x2="360" y2="392" />
        <line x1="380" y1="340" x2="404" y2="370" />
        <line x1="468" y1="340" x2="444" y2="370" />
        <line x1="512" y1="363" x2="488" y2="392" />
      </g>

      {/* Two figures looking at the frame: the members whose house this is */}
      <g fill="oklch(0.20 0.030 150)">
        <circle cx="628" cy="486" r="6.5" />
        <path d="M621 528 v-22 a7 7 0 0 1 14 0 v22 Z" />
        <circle cx="652" cy="491" r="5.8" />
        <path d="M646 528 v-19 a6.2 6.2 0 0 1 12.4 0 v19 Z" />
      </g>

      {/* Foreground scrub */}
      <g fill="oklch(0.175 0.028 150)">
        <path d="M0 522 C 60 508, 120 528, 186 516 C 250 504, 300 526, 360 520 L360 560 L0 560 Z" />
        <path d="M700 528 C 740 514, 770 530, 800 520 L800 560 L700 560 Z" />
      </g>
    </svg>
  );
}
