import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta institucional solicitada
        primary: '#003366', // Azul Navy
        secondary: '#1E4D7B', // Azul médio
        accent: '#2E7DBE', // Azul claro
        neutral: {
          100: '#FFFFFF',
          200: '#F5F7FA',
          300: '#E1E8ED',
          600: '#4A5568',
          900: '#1A202C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.06)',
        cta: '0 4px 12px rgba(0, 51, 102, 0.25)',
        ctaHover: '0 6px 16px rgba(0, 51, 102, 0.35)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease-out both',
        pulseSoft: 'pulseSoft 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
