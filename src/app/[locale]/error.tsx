'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import * as Sentry from '@sentry/nextjs'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    Sentry.captureException(error)
    console.error(`[error] ${error.message}${error.digest ? ` (digest: ${error.digest})` : ''}`, error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-8">
      <p className="text-red-pt font-display text-7xl font-black">500</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-text-primary text-2xl font-bold uppercase tracking-wide">{t('heading')}</h1>
        <p className="text-text-muted text-sm">{t('body')}</p>
      </div>
      <button
        onClick={reset}
        className="border border-green-pt text-green-pt hover:bg-green-pt hover:text-bg-primary font-bold px-8 py-3 rounded uppercase tracking-wide transition-all duration-200"
      >
        {t('retry')}
      </button>
    </div>
  )
}
