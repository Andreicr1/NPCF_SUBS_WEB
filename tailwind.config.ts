import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: 'var(--brand-900)',
          700: 'var(--brand-700)',
          600: 'var(--brand-600)',
          500: 'var(--brand-500)',
          400: 'var(--brand-400)',
        },
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
        },
        muted: {
          400: 'var(--muted-400)',
          200: 'var(--muted-200)',
        },
        bg: {
          50: 'var(--bg-50)',
        },
        white: 'var(--white)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px rgba(0,0,0,0.04)',
        cta: '0 4px 12px rgba(0, 51, 102, 0.25)',
        ctaHover: '0 6px 16px rgba(0, 51, 102, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
      spacing: {
        4: '1rem',
        6: '1.5rem',
        8: '2rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out both',
      },
      maxWidth: {
        container: '1040px',
      },
    },
  },
  plugins: [],
}

export default config

