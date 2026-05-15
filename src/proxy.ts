import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

export default function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' blob: data: https://*.mapbox.com`,
    `connect-src 'self' https://*.mapbox.com https://events.mapbox.com`,
    `worker-src blob:`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const intlResponse = intlMiddleware(
    new Request(request, { headers: requestHeaders })
  )

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Copy intl redirect/rewrite headers if present
  intlResponse.headers.forEach((value, key) => {
    if (key.startsWith('x-') || key === 'location' || key === 'set-cookie') {
      response.headers.set(key, value)
    }
  })
  if (intlResponse.headers.get('location')) {
    return NextResponse.redirect(intlResponse.headers.get('location')!, {
      headers: response.headers,
    })
  }

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('x-nonce', nonce)

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
