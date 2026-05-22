import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
})

// Lazy-load replay integration (saves ~150KB from main bundle)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const start = () => {
    Sentry.lazyLoadIntegration('replayIntegration').then((replay) => {
      Sentry.addIntegration(replay({ maskAllText: true, blockAllMedia: true }))
    }).catch(() => undefined)
  }
  if ('requestIdleCallback' in window) {
    ;(window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback?.(start)
  } else {
    setTimeout(start, 3000)
  }
}
