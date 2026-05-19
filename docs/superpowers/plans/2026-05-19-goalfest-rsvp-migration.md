# Goalfest RSVP Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the goalfest RSVP/invite/admin system into the Fanzone Website repo so that `goalfest.pt` serves both the public festival site and the invite/RSVP/admin system from a single Next.js app.

**Architecture:** Direct code copy from `C:\Users\P02\Downloads\goalfest` into `C:\Users\P02\Downloads\Fanzone Website`. Routes live outside `[locale]` (no i18n prefix). Middleware is merged from both projects into one file. The goalfest project is decommissioned after migration is verified.

**Tech Stack:** Next.js 16, Supabase, Brevo, Cloudflare Turnstile, Upstash Redis, Zod v4, next-intl, Pino, react-hook-form

---

## File Map

**New files (copied from goalfest):**
- `src/lib/supabase/client.ts` — browser Supabase client
- `src/lib/supabase/server.ts` — server Supabase client (SSR cookies)
- `src/lib/supabase/admin.ts` — service role Supabase client
- `src/lib/validators.ts` — Zod schemas (rsvp, invite, accreditation)
- `src/lib/rate-limit.ts` — Upstash Redis rate limiter
- `src/lib/turnstile.ts` — Cloudflare Turnstile verification
- `src/lib/email.ts` — Brevo email sender
- `src/lib/ics.ts` — ICS calendar builder
- `src/lib/qr.ts` — QR code data URL generator
- `src/lib/qr-token.ts` — signed QR token sign/verify
- `src/lib/invite-code.ts` — invite code regex + validator
- `src/lib/audit.ts` — IP extraction from headers
- `src/lib/limits.ts` — rate limit constants + RSVP_OPEN flag
- `src/lib/logger.ts` — Pino logger
- `src/lib/admin-guard.ts` — admin session guard helper
- `src/lib/with-admin-guard.ts` — HOC wrapper for admin API routes
- `src/lib/i18n.tsx` — goalfest PT/EN i18n context (does not conflict with next-intl)
- `src/lib/env.ts` — NEXT_PUBLIC_VIDEO_HERO env accessor
- `src/components/rsvp-form.tsx`
- `src/components/invite-client.tsx`
- `src/components/confirmado-actions.tsx`
- `src/components/acreditado-actions.tsx`
- `src/components/turnstile.tsx`
- `src/components/scene.tsx`
- `src/components/blobs.tsx`
- `src/components/lang-switcher.tsx`
- `src/components/accreditation-form.tsx`
- `src/components/accreditation-client.tsx`
- `src/components/admin/` (entire folder — 8 files)
- `src/app/i/[code]/page.tsx`
- `src/app/a/[code]/page.tsx`
- `src/app/confirmado/[token]/page.tsx`
- `src/app/acreditado/[token]/page.tsx`
- `src/app/privacidade/page.tsx` (goalfest PT-only version)
- `src/app/admin/login/page.tsx`
- `src/app/admin/(authed)/layout.tsx`
- `src/app/admin/(authed)/page.tsx`
- `src/app/admin/(authed)/invites/page.tsx`
- `src/app/admin/(authed)/acreditacoes/page.tsx`
- `src/app/admin/(authed)/audit/page.tsx`
- `src/app/admin/(authed)/scan/page.tsx`
- `src/app/admin/(authed)/account/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/api/rsvp/route.ts`
- `src/app/api/accreditation-rsvp/route.ts`
- `src/app/api/qr/[token]/route.ts`
- `src/app/api/ics/[token]/route.ts`
- `src/app/api/invites/[code]/route.ts`
- `src/app/api/a/[code]/route.ts`
- `src/app/api/cron/email-retry/route.ts`
- `src/app/api/csp-report/route.ts`
- `src/app/api/sentry-tunnel/route.ts`
- `src/app/api/health/route.ts`
- `src/app/api/admin/sign-in/route.ts`
- `src/app/api/admin/sign-in/otp/route.ts`
- `src/app/api/admin/signout/route.ts`
- `src/app/api/admin/account/password/route.ts`
- `src/app/api/admin/guest/[id]/route.ts`
- `src/app/api/admin/guest/[id]/export/route.ts`
- `src/app/api/admin/invites/route.ts`
- `src/app/api/admin/invites/[id]/route.ts`
- `src/app/api/admin/resend-email/route.ts`
- `src/app/api/admin/checkin/route.ts`
- `src/app/api/admin/export/route.ts`
- `src/app/api/admin/toggle-vip/route.ts`
- `src/app/api/admin/vip-access/route.ts`
- `src/app/api/admin/acreditacoes/route.ts`
- `src/app/api/admin/acreditacoes/[id]/route.ts`

**Modified files:**
- `package.json` — add 7 deps
- `src/middleware.ts` — merge both middlewares
- `vercel.json` — add crons block
- `src/app/layout.tsx` — add `<meta name="csp-nonce">` for goalfest routes

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add deps**

In `C:\Users\P02\Downloads\Fanzone Website`, run:

```bash
npm install @supabase/ssr@^0.5.2 @supabase/supabase-js@^2.47.10 pino@^10.3.1 qrcode@^1.5.4 html5-qrcode@^2.3.8 react-hook-form@^7.54.2 @hookform/resolvers@^3.9.1
```

- [ ] **Step 2: Add type for qrcode**

```bash
npm install --save-dev @types/qrcode@^1.5.5 pino-pretty@^13.1.3
```

- [ ] **Step 3: Verify install**

```bash
npm ls @supabase/supabase-js @supabase/ssr pino qrcode html5-qrcode react-hook-form @hookform/resolvers
```

Expected: all 7 packages listed without errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add supabase, pino, qrcode, react-hook-form deps for RSVP migration"
```

---

## Task 2: Copy lib files

**Files:**
- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/admin.ts`
- Create: `src/lib/validators.ts`, `src/lib/rate-limit.ts`, `src/lib/turnstile.ts`
- Create: `src/lib/email.ts`, `src/lib/ics.ts`, `src/lib/qr.ts`, `src/lib/qr-token.ts`
- Create: `src/lib/invite-code.ts`, `src/lib/audit.ts`, `src/lib/limits.ts`, `src/lib/logger.ts`
- Create: `src/lib/admin-guard.ts`, `src/lib/with-admin-guard.ts`, `src/lib/i18n.tsx`, `src/lib/env.ts`

- [ ] **Step 1: Copy supabase lib folder**

```powershell
$src = "C:\Users\P02\Downloads\goalfest\src\lib\supabase"
$dst = "C:\Users\P02\Downloads\Fanzone Website\src\lib\supabase"
New-Item -ItemType Directory -Force $dst
Copy-Item "$src\client.ts" $dst
Copy-Item "$src\server.ts" $dst
Copy-Item "$src\admin.ts" $dst
```

- [ ] **Step 2: Copy remaining lib files**

```powershell
$src = "C:\Users\P02\Downloads\goalfest\src\lib"
$dst = "C:\Users\P02\Downloads\Fanzone Website\src\lib"
$files = @(
  "rate-limit.ts","turnstile.ts","email.ts","ics.ts","qr.ts","qr-token.ts",
  "invite-code.ts","audit.ts","limits.ts","logger.ts",
  "admin-guard.ts","with-admin-guard.ts","i18n.tsx","env.ts"
)
foreach ($f in $files) { Copy-Item "$src\$f" $dst }
```

- [ ] **Step 3: Copy validators.ts**

```powershell
Copy-Item "C:\Users\P02\Downloads\goalfest\src\lib\validators.ts" "C:\Users\P02\Downloads\Fanzone Website\src\lib\validators.ts"
```

- [ ] **Step 4: Fix zod v4 compatibility in validators.ts**

Zod v4 removed `.nonempty()`. Check if any exist:

```powershell
Select-String -Path "C:\Users\P02\Downloads\Fanzone Website\src\lib\validators.ts" -Pattern "nonempty"
```

If matches found, replace each `.nonempty(` with `.min(1,`. In this file there are none (already uses `.min(2, ...)`), but verify to be safe.

- [ ] **Step 5: Fix zod v4 compatibility — `.datetime()` method**

In zod v4, `z.string().datetime()` moved to `z.iso.datetime()`. Check:

```powershell
Select-String -Path "C:\Users\P02\Downloads\Fanzone Website\src\lib\validators.ts" -Pattern "\.datetime\(\)"
```

If matches found in `inviteCreateSchema` and `accreditationLinkCreateSchema`, replace:
- `z.string().datetime()` → `z.iso.datetime()`

- [ ] **Step 6: Commit**

```bash
git add src/lib/
git commit -m "feat: copy goalfest lib files (supabase, email, qr, rate-limit, validators)"
```

---

## Task 3: Copy public assets

**Files:**
- Create: `public/hero.mp4`, `public/goalfest-logo.webp`, `public/quicnation-logo.png`
- Create: `public/logo-mundial.png`, `public/Sem título-1.webp`
- Create: `public/patrocinadores/` (4 sponsor files)

- [ ] **Step 1: Copy assets**

```powershell
$src = "C:\Users\P02\Downloads\goalfest\public"
$dst = "C:\Users\P02\Downloads\Fanzone Website\public"

Copy-Item "$src\hero.mp4" $dst -Force
Copy-Item "$src\goalfest-logo.webp" $dst -Force
Copy-Item "$src\quicnation-logo.png" $dst -Force
Copy-Item "$src\logo-mundial.png" $dst -Force
# Filename with accent — use glob
Get-ChildItem "$src\*.webp" | Copy-Item -Destination $dst -Force

$patrocinadores = "$dst\patrocinadores"
New-Item -ItemType Directory -Force $patrocinadores
Copy-Item "$src\patrocinadores\*" $patrocinadores -Force
```

- [ ] **Step 2: Verify**

```powershell
Get-ChildItem "C:\Users\P02\Downloads\Fanzone Website\public" | Select-Object Name
```

Expected: `hero.mp4`, `goalfest-logo.webp`, `quicnation-logo.png`, `logo-mundial.png`, and all existing Fanzone assets present.

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: add goalfest public assets (hero video, logos, sponsors)"
```

---

## Task 4: Copy components

**Files:**
- Create: `src/components/rsvp-form.tsx`, `src/components/invite-client.tsx`
- Create: `src/components/confirmado-actions.tsx`, `src/components/acreditado-actions.tsx`
- Create: `src/components/turnstile.tsx`, `src/components/scene.tsx`, `src/components/blobs.tsx`
- Create: `src/components/lang-switcher.tsx`, `src/components/accreditation-form.tsx`
- Create: `src/components/accreditation-client.tsx`
- Create: `src/components/admin/` (8 files)

- [ ] **Step 1: Copy public-facing components**

```powershell
$src = "C:\Users\P02\Downloads\goalfest\src\components"
$dst = "C:\Users\P02\Downloads\Fanzone Website\src\components"
$files = @(
  "rsvp-form.tsx","invite-client.tsx","confirmado-actions.tsx",
  "acreditado-actions.tsx","turnstile.tsx","scene.tsx","blobs.tsx",
  "lang-switcher.tsx","accreditation-form.tsx","accreditation-client.tsx"
)
foreach ($f in $files) { Copy-Item "$src\$f" $dst }
```

- [ ] **Step 2: Copy admin components folder**

```powershell
$adminSrc = "C:\Users\P02\Downloads\goalfest\src\components\admin"
$adminDst = "C:\Users\P02\Downloads\Fanzone Website\src\components\admin"
New-Item -ItemType Directory -Force $adminDst
Copy-Item "$adminSrc\*" $adminDst -Recurse -Force
```

- [ ] **Step 3: Commit**

```bash
git add src/components/
git commit -m "feat: copy goalfest components (rsvp-form, invite-client, admin panel)"
```

---

## Task 5: Copy app routes (public)

**Files:**
- Create: `src/app/i/[code]/page.tsx`
- Create: `src/app/a/[code]/page.tsx`
- Create: `src/app/confirmado/[token]/page.tsx`
- Create: `src/app/acreditado/[token]/page.tsx`
- Create: `src/app/privacidade/page.tsx`
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Copy public route pages**

```powershell
$src = "C:\Users\P02\Downloads\goalfest\src\app"
$dst = "C:\Users\P02\Downloads\Fanzone Website\src\app"

# invite
New-Item -ItemType Directory -Force "$dst\i\[code]"
Copy-Item "$src\i\[code]\page.tsx" "$dst\i\[code]\page.tsx"

# accreditation public
New-Item -ItemType Directory -Force "$dst\a\[code]"
Copy-Item "$src\a\[code]\page.tsx" "$dst\a\[code]\page.tsx"

# confirmado
New-Item -ItemType Directory -Force "$dst\confirmado\[token]"
Copy-Item "$src\confirmado\[token]\page.tsx" "$dst\confirmado\[token]\page.tsx"

# acreditado
New-Item -ItemType Directory -Force "$dst\acreditado\[token]"
Copy-Item "$src\acreditado\[token]\page.tsx" "$dst\acreditado\[token]\page.tsx"

# privacidade (PT-only, separate from [locale]/privacidade)
New-Item -ItemType Directory -Force "$dst\privacidade"
Copy-Item "$src\privacidade\page.tsx" "$dst\privacidade\page.tsx"

# auth callback
New-Item -ItemType Directory -Force "$dst\auth\callback"
Copy-Item "$src\auth\callback\route.ts" "$dst\auth\callback\route.ts"
```

- [ ] **Step 2: Commit**

```bash
git add src/app/i/ src/app/a/ src/app/confirmado/ src/app/acreditado/ src/app/privacidade/ src/app/auth/
git commit -m "feat: add invite, confirmado, acreditado, auth callback routes"
```

---

## Task 6: Copy app routes (admin)

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/(authed)/layout.tsx`
- Create: `src/app/admin/(authed)/page.tsx`
- Create: `src/app/admin/(authed)/invites/page.tsx`
- Create: `src/app/admin/(authed)/acreditacoes/page.tsx`
- Create: `src/app/admin/(authed)/audit/page.tsx`
- Create: `src/app/admin/(authed)/scan/page.tsx`
- Create: `src/app/admin/(authed)/account/page.tsx`

- [ ] **Step 1: Copy admin pages**

```powershell
$src = "C:\Users\P02\Downloads\goalfest\src\app\admin"
$dst = "C:\Users\P02\Downloads\Fanzone Website\src\app\admin"

# login
New-Item -ItemType Directory -Force "$dst\login"
Copy-Item "$src\login\page.tsx" "$dst\login\page.tsx"

# (authed) group
New-Item -ItemType Directory -Force "$dst\(authed)"
Copy-Item "$src\(authed)\layout.tsx" "$dst\(authed)\layout.tsx"
Copy-Item "$src\(authed)\page.tsx" "$dst\(authed)\page.tsx"

foreach ($sub in @("invites","acreditacoes","audit","scan","account")) {
  New-Item -ItemType Directory -Force "$dst\(authed)\$sub"
  Copy-Item "$src\(authed)\$sub\page.tsx" "$dst\(authed)\$sub\page.tsx"
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/
git commit -m "feat: add admin dashboard routes (login, guests, invites, scan, audit)"
```

---

## Task 7: Copy API routes

**Files:** all `src/app/api/` routes listed in the file map above

- [ ] **Step 1: Copy top-level API routes**

```powershell
$src = "C:\Users\P02\Downloads\goalfest\src\app\api"
$dst = "C:\Users\P02\Downloads\Fanzone Website\src\app\api"

foreach ($route in @("rsvp","accreditation-rsvp","csp-report","sentry-tunnel","health")) {
  New-Item -ItemType Directory -Force "$dst\$route"
  Copy-Item "$src\$route\route.ts" "$dst\$route\route.ts"
}
```

- [ ] **Step 2: Copy parameterised API routes**

```powershell
# qr/[token]
New-Item -ItemType Directory -Force "$dst\qr\[token]"
Copy-Item "$src\qr\[token]\route.ts" "$dst\qr\[token]\route.ts"

# ics/[token]
New-Item -ItemType Directory -Force "$dst\ics\[token]"
Copy-Item "$src\ics\[token]\route.ts" "$dst\ics\[token]\route.ts"

# invites/[code]
New-Item -ItemType Directory -Force "$dst\invites\[code]"
Copy-Item "$src\invites\[code]\route.ts" "$dst\invites\[code]\route.ts"

# a/[code]
New-Item -ItemType Directory -Force "$dst\a\[code]"
Copy-Item "$src\a\[code]\route.ts" "$dst\a\[code]\route.ts"

# cron/email-retry
New-Item -ItemType Directory -Force "$dst\cron\email-retry"
Copy-Item "$src\cron\email-retry\route.ts" "$dst\cron\email-retry\route.ts"
```

- [ ] **Step 3: Copy admin API routes**

```powershell
$adminRoutes = @(
  "sign-in","signout","resend-email","checkin","export","toggle-vip","vip-access"
)
foreach ($r in $adminRoutes) {
  New-Item -ItemType Directory -Force "$dst\admin\$r"
  Copy-Item "$src\admin\$r\route.ts" "$dst\admin\$r\route.ts"
}

# sign-in/otp (nested)
New-Item -ItemType Directory -Force "$dst\admin\sign-in\otp"
Copy-Item "$src\admin\sign-in\otp\route.ts" "$dst\admin\sign-in\otp\route.ts"

# account/password (nested)
New-Item -ItemType Directory -Force "$dst\admin\account\password"
Copy-Item "$src\admin\account\password\route.ts" "$dst\admin\account\password\route.ts"

# guest/[id] and guest/[id]/export
New-Item -ItemType Directory -Force "$dst\admin\guest\[id]\export"
Copy-Item "$src\admin\guest\[id]\route.ts" "$dst\admin\guest\[id]\route.ts"
Copy-Item "$src\admin\guest\[id]\export\route.ts" "$dst\admin\guest\[id]\export\route.ts"

# invites/[id]
New-Item -ItemType Directory -Force "$dst\admin\invites\[id]"
Copy-Item "$src\admin\invites\route.ts" "$dst\admin\invites\route.ts"
Copy-Item "$src\admin\invites\[id]\route.ts" "$dst\admin\invites\[id]\route.ts"

# acreditacoes and acreditacoes/[id]
New-Item -ItemType Directory -Force "$dst\admin\acreditacoes\[id]"
Copy-Item "$src\admin\acreditacoes\route.ts" "$dst\admin\acreditacoes\route.ts"
Copy-Item "$src\admin\acreditacoes\[id]\route.ts" "$dst\admin\acreditacoes\[id]\route.ts"
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/
git commit -m "feat: add RSVP, QR, ICS, cron and admin API routes"
```

---

## Task 8: Update root layout for nonce

**Files:**
- Modify: `src/app/layout.tsx`

The Fanzone root layout (`src/app/layout.tsx`) wraps all routes including the new goalfest routes. It needs to read the nonce from headers and inject `<meta name="csp-nonce">` so Next.js inline scripts work under the strict CSP.

- [ ] **Step 1: Read current root layout**

Open `C:\Users\P02\Downloads\Fanzone Website\src\app\layout.tsx`.

The current file is minimal (sets fonts, analytics). It does NOT currently read nonce.

- [ ] **Step 2: Add nonce to root layout**

Replace the existing `src/app/layout.tsx` with:

```tsx
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://goalfest.pt'),
}

export const viewport: Viewport = {
  themeColor: '#16a34a',
  colorScheme: 'dark',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce') ?? undefined

  return (
    <html suppressHydrationWarning>
      <head>
        {nonce && <meta name="csp-nonce" content={nonce} />}
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

Note: `[locale]/layout.tsx` handles fonts, Navbar, Footer, and locale-specific metadata for the public site. This root layout is intentionally minimal — it only provides the nonce meta and analytics wrappers.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add csp-nonce meta to root layout for goalfest routes"
```

---

## Task 9: Merge middleware

**Files:**
- Modify: `src/middleware.ts`

This is the most complex task. Replace the existing Fanzone middleware with a merged version that handles both next-intl routing AND goalfest security (CSRF, body-size cap, canonical redirect).

- [ ] **Step 1: Write merged middleware**

Replace `C:\Users\P02\Downloads\Fanzone Website\src\middleware.ts` with:

```typescript
import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const MAX_BODY_BYTES = 64 * 1024
const isProd = process.env.NODE_ENV === 'production'

// Routes that belong to goalfest (outside [locale]) — skip next-intl
const GOALFEST_ROUTE_PREFIXES = ['/i/', '/a/', '/confirmado/', '/acreditado/', '/admin', '/auth/', '/api/']

function isGoalfestRoute(pathname: string): boolean {
  return GOALFEST_ROUTE_PREFIXES.some(p => pathname.startsWith(p))
}

function generateNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!)
  return btoa(bin)
}

const VERCEL_BLOB_HOST = 'https://*.public.blob.vercel-storage.com'
const MAPBOX_HOSTS = 'https://*.mapbox.com https://*.mapbox.net https://api.mapbox.com https://events.mapbox.com'

function buildCsp(nonce: string): string {
  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'unsafe-eval' 'wasm-unsafe-eval' https://va.vercel-scripts.com https://challenges.cloudflare.com`

  const styleSrc = isProd
    ? `'self' 'nonce-${nonce}' https://fonts.googleapis.com`
    : `'self' 'unsafe-inline' https://fonts.googleapis.com`

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    `font-src 'self' https://fonts.gstatic.com data:`,
    `img-src 'self' data: blob: https://*.supabase.co https://va.vercel-scripts.com ${VERCEL_BLOB_HOST} https://images.unsplash.com https://plus.unsplash.com`,
    `media-src 'self' blob: ${VERCEL_BLOB_HOST}`,
    `connect-src 'self' https://*.supabase.co https://*.supabase.com https://va.vercel-scripts.com https://challenges.cloudflare.com ${MAPBOX_HOSTS} ${VERCEL_BLOB_HOST} blob:`,
    `worker-src 'self' blob:`,
    `frame-src 'self' https://challenges.cloudflare.com`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
    `report-uri /api/csp-report`,
    `report-to csp-endpoint`,
  ].join('; ')
}

const REPORTING_ENDPOINTS = 'csp-endpoint="/api/csp-report"'

function originAllowed(origin: string | null, host: string | null): boolean {
  if (!origin) return false
  try {
    const u = new URL(origin)
    if (host && u.host === host) return true
    const allowed = process.env.NEXT_PUBLIC_SITE_URL
    if (allowed) {
      try { return u.origin === new URL(allowed).origin } catch { return false }
    }
    return false
  } catch { return false }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host')
  const allowedSite = process.env.NEXT_PUBLIC_SITE_URL

  // 1. Canonical redirect: block *.vercel.app and non-canonical hosts in prod
  if (isProd && allowedSite && host) {
    try {
      const allowedHost = new URL(allowedSite).host
      if (host !== allowedHost) {
        const url = request.nextUrl.clone()
        url.host = allowedHost
        url.protocol = 'https:'
        url.port = ''
        return NextResponse.redirect(url, 308)
      }
    } catch { /* malformed allowedSite — fail open */ }
  }

  // 2. CSRF guard for API mutations (goalfest routes only)
  const isCspReport = pathname === '/api/csp-report'
  if (pathname.startsWith('/api/') && !SAFE_METHODS.has(request.method) && !isCspReport) {
    const origin = request.headers.get('origin')
    const sfs = request.headers.get('sec-fetch-site')
    const sameOrigin = sfs === 'same-origin'
    if (!sameOrigin && !originAllowed(origin, host)) {
      return NextResponse.json({ error: 'Origin não permitida.' }, { status: 403 })
    }
    const cl = request.headers.get('content-length')
    if (cl) {
      const n = parseInt(cl, 10)
      if (!Number.isNaN(n) && n > MAX_BODY_BYTES) {
        return NextResponse.json({ error: 'Pedido demasiado grande.' }, { status: 413 })
      }
    }
  }

  // 3. Nonce for CSP
  const nonce = generateNonce()
  const csp = buildCsp(nonce)

  // 4. Route to next-intl or passthrough
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  let requestId = request.headers.get('x-request-id')
  if (!requestId) {
    requestId = crypto.randomUUID()
    requestHeaders.set('x-request-id', requestId)
  }

  let response: NextResponse
  if (isGoalfestRoute(pathname)) {
    // Goalfest routes: skip next-intl, just pass through with security headers
    response = NextResponse.next({ request: { headers: requestHeaders } })
  } else {
    // Fanzone [locale] routes: run next-intl locale detection
    const intlResponse = intlMiddleware(request)
    response = (intlResponse as NextResponse) ?? NextResponse.next({ request: { headers: requestHeaders } })
    // Re-inject nonce into the intl response headers
    response.headers.set('x-middleware-request-x-nonce', nonce)
  }

  // 5. Apply CSP and request-id to all responses
  const isHtmlRoute =
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next/') &&
    !pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|ttf|map|txt|xml|mp4|hdr|glb)$/i)

  if (isProd && isHtmlRoute) {
    response.headers.set('Content-Security-Policy', csp)
    response.headers.set('Reporting-Endpoints', REPORTING_ENDPOINTS)
  }
  response.headers.set('x-request-id', requestId)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.hdr|.*\\.glb|.*\\.mp4).*)',
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: merge goalfest security middleware with next-intl (CSRF, CSP, canonical redirect)"
```

---

## Task 10: Update vercel.json

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add crons block**

Replace `C:\Users\P02\Downloads\Fanzone Website\vercel.json` with:

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

- [ ] **Step 2: Commit**

```bash
git add vercel.json
git commit -m "chore: add email-retry cron to vercel.json"
```

---

## Task 11: Add environment variables

**Files:** `.env.local` (local dev only, never committed)

- [ ] **Step 1: Add to .env.local**

Append to `C:\Users\P02\Downloads\Fanzone Website\.env.local` (create if it doesn't exist):

```bash
# ========= SUPABASE (same project as goalfest) =========
NEXT_PUBLIC_SUPABASE_URL=https://zsssynnmqnchjtdstfpc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy from goalfest .env.local>
SUPABASE_SERVICE_ROLE_KEY=<copy from goalfest .env.local>

# ========= BREVO =========
BREVO_API_KEY=<copy from goalfest .env.local>
EMAIL_FROM="QUIC Festival <noreply@quic.pt>"

# ========= RATE LIMIT =========
UPSTASH_REDIS_REST_URL=<copy from goalfest .env.local>
UPSTASH_REDIS_REST_TOKEN=<copy from goalfest .env.local>

# ========= TURNSTILE (use REAL keys, not test keys) =========
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<real key from dash.cloudflare.com>
TURNSTILE_SECRET_KEY=<real key from dash.cloudflare.com>

# ========= TOKEN SECRETS =========
QR_TOKEN_SECRET=<copy from goalfest — same Supabase = same tokens>
CRON_SECRET=<generate: node -e "require('crypto').randomBytes(32).toString('base64')|console.log">

# ========= SITE =========
NEXT_PUBLIC_SITE_URL=https://www.goalfest.pt
NEXT_PUBLIC_VIDEO_HERO=/hero.mp4
```

- [ ] **Step 2: Verify .env.local is in .gitignore**

```bash
grep ".env.local" .gitignore
```

Expected: `.env.local` listed.

- [ ] **Step 3: Add env vars to Vercel**

Go to Vercel Dashboard > Project `quic-festival` > Settings > Environment Variables.

Add each variable from the list above for the `Production` environment. The Supabase, Brevo, Upstash, Turnstile, and QR_TOKEN_SECRET vars may already exist (they do — verified earlier). Only add missing ones: `NEXT_PUBLIC_VIDEO_HERO`, `NEXT_PUBLIC_SITE_URL` (update to `https://www.goalfest.pt` if currently `https://quic-festi…`), `CRON_SECRET` if not present.

No commit needed (env vars are not committed).

---

## Task 12: Build verification

- [ ] **Step 1: Run TypeScript check**

```bash
cd "C:\Users\P02\Downloads\Fanzone Website"
npx tsc --noEmit
```

Expected: no errors. Common errors to fix:
- Missing `@types/qrcode` — already installed in Task 1
- Import path mismatches — check `@/lib/` aliases work (tsconfig has `paths`)
- Any zod v4 breakage — fix in `src/lib/validators.ts`

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: successful build showing all routes including:
- `ƒ /i/[code]`
- `ƒ /confirmado/[token]`
- `ƒ /admin`
- `ƒ /api/rsvp`
- `ƒ /api/cron/email-retry`

- [ ] **Step 3: Fix any build errors**

Common issues:
- `Cannot find module '@/lib/supabase/client'` — check the file was copied to `src/lib/supabase/client.ts`
- `Type error in validators.ts` — re-check zod v4 compat (Task 2 Step 5)
- `Cannot find module 'html5-qrcode'` — verify npm install completed

- [ ] **Step 4: Commit if clean**

```bash
git add -A
git commit -m "fix: resolve build errors after RSVP migration"
```

---

## Task 13: Smoke test locally

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test invite route**

Open `http://localhost:3000/i/test123` in browser.
Expected: invite page renders (may show "convite inválido" — that's correct, no Supabase data in dev).

- [ ] **Step 3: Test admin login**

Open `http://localhost:3000/admin`.
Expected: redirects to `http://localhost:3000/admin/login`.

- [ ] **Step 4: Test existing Fanzone routes**

Open `http://localhost:3000/pt` and `http://localhost:3000/en`.
Expected: Fanzone homepage renders correctly with Navbar, Footer, 3D scene.

- [ ] **Step 5: Test API health**

```bash
curl http://localhost:3000/api/health
```

Expected: `{"ok":true}` or similar.

---

## Task 14: Push and deploy

- [ ] **Step 1: Push to GitHub**

```bash
git push origin master
```

- [ ] **Step 2: Verify Vercel build**

Go to `https://vercel.com/pedrom2002s-projects/quic-festival/deployments` and wait for the deployment triggered by the push to complete.

Expected: green build, no errors in the Vercel build log.

- [ ] **Step 3: Smoke test production**

- `https://www.goalfest.pt/pt` — Fanzone homepage loads
- `https://www.goalfest.pt/i/` + any real invite code — invite form renders
- `https://www.goalfest.pt/admin` — redirects to `/admin/login`
- `https://www.goalfest.pt/api/health` — returns `{"ok":true}`

- [ ] **Step 4: Verify cron is registered**

Go to Vercel Dashboard > Project `quic-festival` > Cron Jobs.
Expected: `/api/cron/email-retry` listed with `*/15 * * * *` schedule.

---

## Self-Review Notes

**Spec coverage check:**
- Routes: Tasks 5, 6, 7 cover all routes from spec section 1.
- Deps: Task 1 covers all 7 deps + types from spec section 2.
- Env vars: Task 11 covers all vars from spec section 3.
- Middleware: Task 9 covers full merged middleware from spec section 4.
- Libs: Task 2 covers all 18 lib files from spec section 5.
- Components: Task 4 covers all components from spec section 6.
- Assets: Task 3 covers all assets from spec section 7.
- vercel.json: Task 10 covers spec section 8.
- Error handling: zod fix in Task 2, CSP note in Task 9.

**No placeholders detected.**

**Type consistency:** `supabaseAdmin()` used in API routes matches export from `src/lib/supabase/admin.ts`. `signQrToken` / `verifyQrToken` from `src/lib/qr-token.ts`. All consistent with goalfest originals (no renames).
