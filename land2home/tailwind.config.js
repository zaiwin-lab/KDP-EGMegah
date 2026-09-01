/** @type {import('tailwindcss').Config} */
const c = (name) => `oklch(var(${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: c('--forest-950'),
          900: c('--forest-900'),
          800: c('--forest-800'),
          700: c('--forest-700'),
          600: c('--forest-600'),
          300: c('--forest-300'),
          100: c('--forest-100'),
          50: c('--forest-50'),
        },
        gold: {
          700: c('--gold-700'),
          600: c('--gold-600'),
          500: c('--gold-500'),
          200: c('--gold-200'),
          100: c('--gold-100'),
        },
        onyx: c('--onyx'),
        paper: c('--paper'),
        surface: c('--surface'),
        raised: c('--raised'),
        ink: c('--ink'),
        'ink-2': c('--ink-2'),
        'ink-3': c('--ink-3'),
        line: c('--line'),
        'line-2': c('--line-2'),
        ok: c('--ok'),
        'ok-bg': c('--ok-bg'),
        warn: c('--warn'),
        'warn-bg': c('--warn-bg'),
        alert: c('--alert'),
        'alert-bg': c('--alert-bg'),
        info: c('--info'),
        'info-bg': c('--info-bg'),
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Petrona', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: { xl2: '1.125rem' },
      boxShadow: {
        low: '0 1px 2px oklch(var(--forest-950) / 0.06), 0 1px 3px oklch(var(--forest-950) / 0.04)',
        mid: '0 2px 4px oklch(var(--forest-950) / 0.05), 0 8px 24px -8px oklch(var(--forest-950) / 0.12)',
        high: '0 12px 48px -16px oklch(var(--forest-950) / 0.28)',
      },
      transitionTimingFunction: {
        out4: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      zIndex: { dropdown: '100', sticky: '200', backdrop: '300', modal: '400', toast: '500' },
      maxWidth: { prose: '68ch' },
      opacity: { 12: '0.12', 15: '0.15', 18: '0.18', 35: '0.35', 45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85' },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'fade-up': 'fade-up 260ms cubic-bezier(0.165,0.84,0.44,1) both',
        'fade-in': 'fade-in 200ms ease-out both',
      },
    },
  },
  plugins: [],
};
