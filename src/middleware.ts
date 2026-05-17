import createIntlMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

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
  const isProd = process.env.NODE_ENV === 'production'

  // In production: strict-dynamic propagates nonce to dynamically loaded scripts.
  // In dev: unsafe-eval needed for HMR; nonce-only (no unsafe-inline) keeps dev/prod parity.
  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'wasm-unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'unsafe-eval' 'wasm-unsafe-eval'`

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com ${VERCEL_BLOB_HOST}`,
    `media-src 'self' blob: ${VERCEL_BLOB_HOST}`,
    `connect-src 'self' ${VERCEL_BLOB_HOST} ${MAPBOX_HOSTS} blob:`,
    `worker-src 'self' blob:`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
  ].join('; ')
}

export default async function middleware(request: NextRequest) {
  const nonce = generateNonce()
  const csp = buildCsp(nonce)

  // Run next-intl on the original NextRequest — preserves nextUrl/pathname
  // so locale detection from the URL works correctly.
  const intlResponse = intlMiddleware(request)

  // Attach nonce to request headers so RSC layout can read it via headers().
  // next-intl may return a redirect/rewrite response; clone and inject headers.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = intlResponse ?? NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('x-middleware-request-x-nonce', nonce)
  response.headers.set('Content-Security-Policy', csp)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.hdr|.*\\.glb|.*\\.mp4).*)',
  ],
}
