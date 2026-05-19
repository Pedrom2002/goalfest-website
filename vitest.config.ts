import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'framer-motion': path.resolve(__dirname, './src/__mocks__/framer-motion.tsx'),
      'next-intl/server': path.resolve(__dirname, './src/__mocks__/next-intl-server.ts'),
      'next-intl': path.resolve(__dirname, './src/__mocks__/next-intl.ts'),
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
        'src/data/teamFlags.ts',
        'src/components/three/**',
        'src/components/ui/VenueMap.tsx',
        'src/components/ui/VenueModel.tsx',
        'src/components/ui/BackgroundFXClient.tsx',
        'src/components/ui/CountdownTimer.tsx',
        'src/components/sections/WhatIsGoalfest.tsx',
        'src/components/sections/WhatIsGoalfestAnimations.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 68,
        statements: 75,
      },
    },
  },
})
