'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt">
      <body style={{ margin: 0, background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Ocorreu um erro inesperado / An unexpected error occurred
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#888', maxWidth: '24rem' }}>
          Tenta recarregar a página. / Please reload the page.
        </p>
        <button
          onClick={reset}
          style={{ padding: '0.5rem 1.25rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
          Tentar novamente / Try again
        </button>
      </body>
    </html>
  )
}
