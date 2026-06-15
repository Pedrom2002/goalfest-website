import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
const MAX_BODY_BYTES = 64 * 1024
const isProd = process.env.NODE_ENV === 'production'

// Routes that belong to goalfest (outside [locale]) — skip next-intl
const GOALFEST_ROUTE_PREFIXES = ['/i/', '/a/', '/confirmado/', '/acreditado/', '/admin', '/auth/', '/api/', '/tabela']

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

  // React inline style attrs cannot receive nonces, so prod requires 'unsafe-inline'
  // for style-src (script-src remains strict-dynamic+nonce).
  const styleSrc = `'self' 'unsafe-inline' https://fonts.googleapis.com`

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

  // 2. CSRF guard for API mutations
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
    response = NextResponse.next({ request: { headers: requestHeaders } })
  } else {
    const intlResponse = intlMiddleware(request)
    response = (intlResponse as NextResponse) ?? NextResponse.next({ request: { headers: requestHeaders } })
    response.headers.set('x-middleware-request-x-nonce', nonce)
  }

  // 5. Apply CSP and request-id
  const isHtmlRoute =
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next/') &&
    !pathname.startsWith('/tabela') &&
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
