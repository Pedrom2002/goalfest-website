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
        // Infra lib files requiring external services (Supabase, Brevo, Upstash, Cloudflare)
        'src/lib/email.ts',
        'src/lib/rate-limit.ts',
        'src/lib/qr-token.ts',
        'src/lib/logger.ts',
        'src/lib/turnstile.ts',
        'src/lib/i18n.tsx',
        'src/lib/admin-guard.ts',
        'src/lib/with-admin-guard.ts',
        'src/lib/audit.ts',
        'src/lib/constants.ts',
        'src/lib/qr.ts',
        'src/lib/supabase/**',
        // Admin panel components (complex, depend on Supabase — no unit tests yet)
        'src/components/admin/**',
        // Feature components added without tests
        'src/components/accreditation-client.tsx',
        'src/components/accreditation-form.tsx',
        'src/components/acreditado-actions.tsx',
        'src/components/confirmado-actions.tsx',
        'src/components/invite-client.tsx',
        'src/components/lang-switcher.tsx',
        'src/components/lineup.tsx',
        'src/components/rsvp-form.tsx',
        'src/components/scene.tsx',
        'src/components/turnstile.tsx',
        'src/components/blobs.tsx',
        'src/components/sections/NewsletterSection.tsx',
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
