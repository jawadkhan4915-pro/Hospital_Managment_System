/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffaff',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        hms: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          primary: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          dim: 'var(--text-tertiary)',
          border: 'var(--border-color)',
          glass: 'var(--glass-bg)',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        'sm': 'var(--border-radius-sm)',
        'md': 'var(--border-radius-md)',
        'lg': 'var(--border-radius-lg)',
      },
      boxShadow: {
        'glow': 'var(--box-shadow-glow)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
