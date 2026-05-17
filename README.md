# Goalfest Lisboa

Official fanzone website for the 2026 FIFA World Cup in Lisbon, deployed at [goalfest.pt](https://goalfest.pt).

Giant screens, food trucks, concerts, and a 3D venue preview — all at Vale do Silêncio, Olivais, from 11 June to 19 July 2026.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, SSG) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (locales: `pt`, `en`) |
| 3D / WebGL | React Three Fiber + Drei |
| Map | Mapbox GL via react-map-gl |
| Animations | Framer Motion |
| Error tracking | Sentry |
| Analytics | Vercel Analytics + Speed Insights |
| Media hosting | Vercel Blob |
| Unit tests | Vitest + Testing Library + jest-axe |
| E2E tests | Playwright |
| CI | GitHub Actions |
| Deploy | Vercel |

---

## Getting started

**Prerequisites:** Node >= 20, npm.

```bash
npm install
cp .env.local.example .env.local   # fill in required vars (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the middleware redirects `/` to `/pt`.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox public token for the interactive venue map |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN (client-side error tracking) |
| `SENTRY_DSN` | No | Sentry DSN (server/edge) |
| `SENTRY_ORG` | No | Sentry org slug (source maps upload in CI) |
| `SENTRY_PROJECT` | No | Sentry project slug |
| `SENTRY_AUTH_TOKEN` | No | Sentry auth token (source maps upload) |
| `NEXT_PUBLIC_APP_URL` | No | Canonical base URL (default: `https://goalfest.pt`) |
| `NEXT_PUBLIC_VIDEO_HERO` | No | Hero background video URL (defaults to Vercel Blob) |
| `NEXT_PUBLIC_VIDEO_VENUE` | No | Venue tour video URL (defaults to Vercel Blob) |
| `NEXT_PUBLIC_MODEL_VENUE` | No | Venue 3D model path (default: `/venue_optimized.glb`) |
| `NEXT_PUBLIC_ENV_VENUE` | No | HDR environment map URL for the 3D scene |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token |

All variables are validated at startup via Zod in [`src/lib/env.ts`](src/lib/env.ts). Missing required variables throw with a clear error message at build time rather than silently failing at runtime.

---

## Project structure

```
src/
  app/
    [locale]/           # All user-facing routes (SSG via generateStaticParams)
      layout.tsx        # Locale layout: fonts, Navbar, Footer, skip link, hreflang
      page.tsx          # Home (Hero, WhatIsGoalfest, Venue, Sponsors, FAQ)
      jogos/            # Match schedule page
      faq/              # FAQ page
      privacidade/      # Privacy policy
      termos/           # Terms of service
    api/health/         # Health check: GET /api/health → { status, ts }
    global-error.tsx    # Root error boundary (reports to Sentry)
  components/
    layout/             # Navbar (with focus-trapped mobile menu), Footer
    sections/           # Hero, Venue, Sponsors, WhatIsGoalfest, FaqSection, JogosSchedule
    ui/                 # FaqAccordion, MatchCard, CountdownTimer, VenueMap, VenueModel, ...
  data/                 # Static data: schedule.ts, sponsors.json, faq.json
  i18n/                 # next-intl routing, request config, navigation helpers
  lib/                  # Utilities: env, constants, matchFilters, matchPhase, countdown
  middleware.ts         # CSP nonce generation + next-intl locale routing
messages/
  pt.json               # Portuguese translations
  en.json               # English translations (must have identical key set)
e2e/
  smoke.test.ts         # Playwright smoke tests
public/
  goalfest-logo.png
  goalfest-og.jpg       # OG / social share image (1600x900)
  quicnation-logo.png
  venue_optimized.glb   # 3D venue model (served locally)
  parceiros/            # Partner logos
  patrocinadores/       # Sponsor logos
```

---

## i18n

All user-facing routes live under the `[locale]` segment (`/pt/*`, `/en/*`). The root `/` redirects to `/pt` via `src/app/page.tsx`. The middleware handles locale detection and routing.

Translations live in [`messages/pt.json`](messages/pt.json) and [`messages/en.json`](messages/en.json). A CI test enforces key parity between both files — adding a key to one file without the other fails the build.

---

## Security

Content Security Policy is generated per-request in [`src/middleware.ts`](src/middleware.ts):

- **Production:** `strict-dynamic` + per-request nonce (no `unsafe-inline` for scripts)
- **Development:** `unsafe-eval` added for HMR

Additional security headers (set in [`next.config.ts`](next.config.ts)):

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## Testing

```bash
npm test                  # unit tests (single run)
npm run test:watch        # unit tests (watch mode)
npm run test:coverage     # unit tests + coverage report
npm run test:e2e          # Playwright E2E (starts production server automatically)
npm run test:e2e:ui       # Playwright with interactive UI
```

**Coverage thresholds** (enforced in CI — failing these fails the build):

| Metric | Threshold |
|--------|-----------|
| Statements | 80% |
| Branches | 75% |
| Functions | 75% |
| Lines | 80% |

**E2E smoke tests** ([`e2e/smoke.test.ts`](e2e/smoke.test.ts)) cover:

- PT and EN home page load with correct titles
- `/pt/jogos` and `/pt/faq` pages render
- Security headers present (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`)
- Skip link is focusable and points to `#main-content`

---

## CI/CD

GitHub Actions workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every push and PR to `master`:

1. **ci** job: lint, type-check (`tsc --noEmit`), unit tests with coverage, production build, `npm audit --audit-level=high`
2. **e2e** job (runs after `ci`): install Playwright browsers, production build, smoke tests

Vercel deploys automatically on merge to `master`. No manual deploy step needed.

---

## Bundle analysis

```bash
ANALYZE=true npm run build
```

Opens an interactive bundle treemap in the browser via `@next/bundle-analyzer`.

---

## Scripts reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type-check only |
| `npm test` | Unit tests (single run) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:coverage` | Unit tests with V8 coverage |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run test:e2e:ui` | Playwright with interactive UI |
