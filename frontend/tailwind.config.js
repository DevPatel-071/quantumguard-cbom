/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#040711',
          surface: '#080E1E',
          card: '#0D1730',
          cardHover: '#122044',
          border: '#1E2D4A',
          borderGlow: '#00F0FF',
          cyan: '#00F0FF',
          blue: '#38BDF8',
          electric: '#2563EB',
          purple: '#818CF8',
          violet: '#A855F7',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        'cyan-glow': '0 0 20px -5px rgba(0, 240, 255, 0.25)',
        'blue-glow': '0 0 20px -5px rgba(56, 189, 248, 0.25)',
        'purple-glow': '0 0 20px -5px rgba(129, 140, 248, 0.25)',
        'rose-glow': '0 0 20px -5px rgba(239, 68, 68, 0.25)',
        'command-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(30, 45, 74, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 14s linear infinite',
        'gauge-fill': 'gaugeFill 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }
    },
  },
  plugins: [],
}

