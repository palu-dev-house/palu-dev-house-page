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
          DEFAULT: '#2065A1',
          light: '#EDF4F8',
          dark: '#4A8FCC',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          muted: '#525252',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F7F7F8',
        },
        line: '#E5E5E5',
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
