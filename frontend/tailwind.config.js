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
        polis: {
          dark: '#0a0d14',
          card: '#121826',
          border: '#1f293d',
          accent: '#3b82f6',
          gold: '#f59e0b',
          emerald: '#10b981',
          crimson: '#ef4444',
          parchment: '#fef3c7',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
