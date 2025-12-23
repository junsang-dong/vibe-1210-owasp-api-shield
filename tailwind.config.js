/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'critical': '#ef4444',
        'high': '#f97316',
        'medium': '#eab308',
        'low': '#22c55e',
        'ocean-blue': '#0077BE',
        'adaptive': {
          'primary': 'var(--adaptive-primary)',
          'bg': 'var(--adaptive-bg)',
          'surface': 'var(--adaptive-surface)',
          'text': 'var(--adaptive-text)',
          'border': 'var(--adaptive-border)',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-green-500',
    'bg-red-500/20',
    'bg-orange-500/20',
    'bg-yellow-500/20',
    'bg-green-500/20',
    'border-red-500/50',
    'border-orange-500/50',
    'border-yellow-500/50',
    'border-green-500/50',
  ],
}

