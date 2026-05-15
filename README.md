# Goalfest Lisboa 2026

Official fanzone website for Goalfest Lisboa — the biggest FIFA World Cup 2026 fanzone in Lisbon, at Vale do Silêncio, Parque das Nações. 11 June to 19 July 2026.

Live at: **[goalfest.pt](https://goalfest.pt)**

## What it is

- Bilingual landing page (PT/EN) with i18n routing via `next-intl`
- Full match schedule for all 104 World Cup games with filters (all / groups / knockouts / Portugal)
- Countdown timer to tournament start
- Interactive 3D venue model (Three.js / React Three Fiber)
- Mapbox-powered venue map
- Sponsor showcase
- FAQ section

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| 3D | Three.js + React Three Fiber |
| Maps | Mapbox GL + react-map-gl |
| i18n | next-intl (PT + EN) |
| Tests | Vitest + jsdom |
| Deploy | Vercel |

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox public token from [mapbox.com](https://mapbox.com) (free tier works) |

### Run

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
npm run test     # run tests once
npm run test:coverage  # run tests with coverage report
```

## Project structure

```
src/
  app/              # Next.js App Router (root layout + locale segment)
    [locale]/       # PT and EN routes
  components/
    layout/         # Navbar, Footer
    sections/       # Page sections (Hero, Venue, JogosSchedule, FAQ, ...)
    ui/             # Reusable UI components (CountdownTimer, FaqAccordion, MatchCard, ...)
  data/             # Static data (schedule, matches, faq, sponsors)
  i18n/             # next-intl routing and request config
  lib/              # Pure utility functions (countdown, matchFilters, matchPhase, ...)
  types/            # Shared TypeScript types
```

## Testing

Tests cover `src/lib/`, `src/data/`, and key UI components (FaqAccordion, MatchCard, PhotoLightbox, JogosSchedule). Coverage thresholds are enforced (70% lines/functions/statements, 65% branches) and run in CI.

```bash
npm run test             # run all tests
npm run test:watch       # watch mode
npm run test:coverage    # coverage report (html + terminal)
```

## Deployment

Deployed on Vercel. Pushes to `master` trigger automatic deployments. Set the environment variables in the Vercel project settings — `NEXT_PUBLIC_MAPBOX_TOKEN` is required at runtime for the interactive map.

## Security

- CSP headers with per-request nonce (set in middleware)
- HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- No secrets committed (see `.env.local.example`)
