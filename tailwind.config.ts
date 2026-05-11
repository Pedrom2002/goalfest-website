import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0d0d0d',
        'bg-surface': '#1a1a1a',
        gold: '#FFD700',
        'red-pt': '#C8102E',
        'green-pt': '#006600',
        'text-primary': '#F5F5F5',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-oswald)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
