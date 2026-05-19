# Design: Migrate goalfest RSVP system into Fanzone Website

**Date:** 2026-05-19
**Status:** Approved

## Overview

Merge the goalfest RSVP/invite/admin system (currently a standalone Next.js app at
`C:\Users\P02\Downloads\goalfest`) into the Fanzone Website repo
(`https://github.com/Pedrom2002/goalfest-website`), which already serves `goalfest.pt`.

The goalfest project becomes obsolete after this migration. One repo, one Vercel deploy,
one Supabase project.

## Approach

Direct code copy (Option A). No monorepo, no proxy rewrites. All routes, libs, components,
and API handlers from goalfest are copied into the Fanzone Website src tree. The goalfest
project is decommissioned afterward.

## 1. Route Structure

Invite/admin routes live **outside** `src/app/[locale]/` (no `/pt/` or `/en/` prefix).
Rationale: invite links are shared as direct URLs (prefix would break existing links),
admin is PT-only.

```
src/app/
├── [locale]/                  # next-intl (PT/EN) — existing Fanzone public site
│   ├── page.tsx
│   ├── jogos/
│   ├── faq/
│   ├── privacidade/
│   └── termos/
├── i/[code]/                  # invite page (from goalfest)
├── a/[code]/                  # accreditation public page
├── confirmado/[token]/        # RSVP confirmation
├── acreditado/[token]/        # accreditation confirmation
├── privacidade/               # goalfest PT-only version (distinct from [locale]/privacidade)
├── admin/                     # admin dashboard (PT only, outside i18n)
│   ├── login/
│   └── (authed)/
│       ├── page.tsx           # guests dashboard
│       ├── invites/
│       ├── acreditacoes/
│       ├── audit/
│       ├── scan/
│       └── account/
├── auth/callback/             # Supabase auth callback
└── api/
    ├── rsvp/                  # POST — public RSVP submission
    ├── accreditation-rsvp/    # POST — accreditation submission
    ├── qr/[token]/            # GET — QR code image
    ├── ics/[token]/           # GET — calendar file
    ├── invites/[code]/        # GET — invite validation
    ├── a/[code]/              # GET — accreditation link validation
    ├── cron/email-retry/      # GET|POST — email retry cron job
    ├── csp-report/            # POST — CSP violation reporting
    ├── sentry-tunnel/         # POST — Sentry tunnel
    ├── health/                # GET — health check
    └── admin/                 # all admin API routes (auth, guests, invites, etc.)
```

## 2. Dependencies

Add to `package.json` dependencies:

```json
"@supabase/ssr": "^0.5.2",
"@supabase/supabase-js": "^2.47.10",
"pino": "^10.3.1",
"qrcode": "^1.5.4",
"html5-qrcode": "^2.3.8",
"react-hook-form": "^7.54.2",
"@hookform/resolvers": "^3.9.1"
```

`zod` already exists at v4. The goalfest uses v3. One breaking change to fix in
`validators.ts`: `z.string().nonempty()` becomes `z.string().min(1)`. All other
goalfest zod usage is v3/v4 compatible.

## 3. Environment Variables

Add to Vercel Dashboard (Settings > Environment Variables) and `.env.local`:

```bash
# Supabase — same project as goalfest
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Email
BREVO_API_KEY=
EMAIL_FROM=

# Rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Captcha (real keys, not test keys)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Token signing
QR_TOKEN_SECRET=        # >= 32 bytes random
CRON_SECRET=            # >= 32 bytes random

# Video hero
NEXT_PUBLIC_VIDEO_HERO=/hero.mp4

# Sentry already configured in Fanzone — reuse existing DSN vars
```

## 4. Middleware Merge

Combine `goalfest/src/middleware.ts` and `fanzone/src/middleware.ts` into one file.

Execution order:

1. **Canonical redirect** (prod): any request to `*.vercel.app` or non-canonical host
   redirects 308 to `www.goalfest.pt`. Sourced from goalfest middleware.
2. **Nonce generation** — single nonce per request.
3. **Route classification:**
   - i18n routes: anything under `[locale]` — run `intlMiddleware` (next-intl)
   - goalfest routes: `/i/*`, `/a/*`, `/confirmado/*`, `/acreditado/*`, `/admin/*`,
     `/auth/*`, `/api/*` — skip intlMiddleware
4. **CSRF guard** (goalfest): non-safe methods on `/api/*` must have matching
   `Origin` header or `Sec-Fetch-Site: same-origin`. Exception: `/api/csp-report`.
5. **Body size cap** (goalfest): reject requests with `Content-Length > 64KB`.
6. **Inject headers**: `x-nonce`, `x-request-id` (reuse upstream or generate UUID).
7. **CSP** (merged policy, applied to all HTML routes):

```
default-src 'self'
script-src 'self' 'nonce-{n}' 'strict-dynamic' 'wasm-unsafe-eval'   (prod)
style-src 'self' 'nonce-{n}' https://fonts.googleapis.com            (prod, no unsafe-inline)
font-src 'self' https://fonts.gstatic.com data:
img-src 'self' data: blob: https://*.supabase.co https://va.vercel-scripts.com
        https://*.public.blob.vercel-storage.com https://images.unsplash.com
media-src 'self' blob: https://*.public.blob.vercel-storage.com
connect-src 'self' https://*.supabase.co https://*.supabase.com
           https://va.vercel-scripts.com https://challenges.cloudflare.com
           https://*.mapbox.com https://*.mapbox.net https://api.mapbox.com
           https://events.mapbox.com https://*.public.blob.vercel-storage.com blob:
worker-src 'self' blob:
frame-src 'self' https://challenges.cloudflare.com
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
object-src 'none'
upgrade-insecure-requests
report-uri /api/csp-report
report-to csp-endpoint
```

Note: `unsafe-inline` removed from `style-src` in prod (goalfest stricter policy wins).
The Fanzone layout already passes nonce to Next.js via `x-nonce` header — no change needed.

## 5. Libs to Copy

Copy from `goalfest/src/lib/` to `fanzone/src/lib/`:

```
supabase/client.ts
supabase/server.ts
supabase/admin.ts
validators.ts          # fix zod v3 → v4 (nonempty → min(1))
rate-limit.ts
turnstile.ts
email.ts
ics.ts
qr.ts
qr-token.ts
invite-code.ts
audit.ts
limits.ts
logger.ts
admin-guard.ts
with-admin-guard.ts
i18n.tsx               # goalfest's own PT/EN system, does not conflict with next-intl
env.ts
```

## 6. Components to Copy

Copy from `goalfest/src/components/` to `fanzone/src/components/`:

```
rsvp-form.tsx
invite-client.tsx
confirmado-actions.tsx
acreditado-actions.tsx
turnstile.tsx
scene.tsx
blobs.tsx
lang-switcher.tsx
accreditation-form.tsx
accreditation-client.tsx
admin/                 # entire folder
```

## 7. Public Assets to Copy

Copy from `goalfest/public/` to `fanzone/public/`:

```
hero.mp4
goalfest-logo.webp
quicnation-logo.png
logo-mundial.png
Sem título-1.webp
patrocinadores/        # folder with sponsor logos
```

## 8. vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["lhr1"],
  "trailingSlash": false,
  "redirects": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "goalfest.pt" }],
      "destination": "https://www.goalfest.pt/$1",
      "permanent": true
    }
  ],
  "crons": [
    {
      "path": "/api/cron/email-retry",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## 9. Error Handling

- Zod v4 migration: fix `nonempty()` calls in `validators.ts` before running build.
- CSP `unsafe-inline` removal: the Fanzone layout already passes nonce via
  `x-nonce` header — Tailwind/Next inline styles use nonce, so no visual regressions
  expected. Verify in staging after deploy.
- RSVP_OPEN kill-switch: env var from goalfest. Not set = open. Set to `"false"` = 503.

## 10. Out of Scope

- Fanzone Website i18n translations for RSVP/admin pages — these stay PT-only.
- Database migrations — Supabase schema already exists (same project).
- Sentry DSN — already configured in Fanzone, reuse existing vars.
- goalfest standalone deploy — decommissioned after migration verified in prod.
