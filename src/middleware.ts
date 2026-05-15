import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
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

  const scriptSrc = isProd
    ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `'self' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com ${VERCEL_BLOB_HOST}`,
    `media-src 'self' blob: ${VERCEL_BLOB_HOST}`,
    `connect-src 'self' ${VERCEL_BLOB_HOST} ${MAPBOX_HOSTS} https://events.mapbox.com blob:`,
    `worker-src 'self' blob:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
  ].join('; ')
}

export default async function middleware(request: NextRequest) {
  const nonce = generateNonce()
  const csp = buildCsp(nonce)

  const intlResponse = intlMiddleware(request)
  const response = intlResponse ?? NextResponse.next()

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('x-nonce', nonce)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico|.*\\.webp|.*\\.hdr|.*\\.glb|.*\\.mp4).*)',
  ],
}
