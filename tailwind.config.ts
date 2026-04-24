import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--color-brand)',
          light: 'var(--color-brand-light)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          muted: 'var(--color-surface-muted)',
        },
        line: 'var(--color-line)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
        prose: '720px',
      },
      spacing: {
        section: '96px',
        'section-sm': '64px',
      },
      boxShadow: {
        lift: '0 4px 20px -4px rgba(32, 101, 161, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
