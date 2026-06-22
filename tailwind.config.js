/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Monochrome system — white is the "accent". The page background is
        // plain `black`; no `base` token, because a color named "base" would
        // generate a `text-base` color utility that clobbers Tailwind's
        // `text-base` font-size utility.
        surface: '#0A0A0A',
        surface2: '#161616',
        accent: '#FFFFFF',
        'accent-soft': '#161616',
        border: '#262626',
        success: '#E5E5E5',
        muted: '#A1A1AA',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.03em',
        tag: '0.15em',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'grid-move': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 30px -10px rgba(255,255,255,0.18)' },
          '50%': { boxShadow: '0 0 50px -5px rgba(255,255,255,0.32)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'grid-move': 'grid-move 8s linear infinite',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        glow: 'glow 4s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
}
