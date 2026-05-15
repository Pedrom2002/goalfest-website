import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/data/**', 'src/components/**'],
      exclude: [
        'src/**/*.test.*',
        'src/**/*.d.ts',
        'src/data/sponsors.json',
        'src/data/faq.json',
        'src/data/matches.json',
        'src/data/gallery.json',
        'src/data/teamFlags.ts',
        'src/components/three/**',
        'src/components/ui/VenueMap.tsx',
        'src/components/ui/VenueModel.tsx',
        'src/components/ui/BackgroundFX.tsx',
        'src/components/ui/BackgroundFXClient.tsx',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
    },
  },
})
