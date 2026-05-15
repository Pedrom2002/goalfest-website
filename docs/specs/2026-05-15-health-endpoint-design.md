# Health Endpoint Design

**Goal:** Add `GET /api/health` so an external uptime monitor can verify the site is responding.

**Architecture:** Single Next.js App Router route handler. Returns JSON with status and timestamp. No auth, no external dependencies checked. Pair with UptimeRobot (free) pinging every 5 minutes.

**Tech Stack:** Next.js App Router route handler, Vitest + @testing-library/jest-dom for the unit test, UptimeRobot (external, manual setup).

---

## Route Handler

File: `src/app/api/health/route.ts`

- `GET /api/health` returns HTTP 200 with `{"status":"ok","ts":"<ISO timestamp>"}`
- `Cache-Control: no-store` header so monitors always hit the live server
- No authentication (public endpoint)
- No external dependency checks (Mapbox, Sentry) — this is a static Next.js site; the only meaningful signal is "server responds"

## Test

File: `src/app/api/health/route.test.ts`

- Import the `GET` handler directly and call it
- Assert response status is 200
- Assert response JSON contains `status: "ok"` and a `ts` string

## UptimeRobot Setup (manual, after deploy)

1. Create free account at uptimerobot.com
2. Add monitor: type HTTP(S), URL `https://goalfest.pt/api/health`, interval 5 minutes
3. Add alert contact: email (and optionally Telegram)
4. UptimeRobot sends alert when endpoint returns non-200 or times out, and again when it recovers

## Out of Scope

- Build version / git SHA in response
- Memory or CPU metrics
- Checks for Mapbox or Sentry availability
- Authentication on the endpoint
