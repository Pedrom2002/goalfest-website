import { getTranslations } from 'next-intl/server'

export default async function Loading() {
  const t = await getTranslations('common')
  return (
    <div className="min-h-screen flex items-center justify-center" role="status" aria-label={t('loading')}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-green-pt/30 border-t-green-pt rounded-full animate-spin" aria-hidden="true" />
        <p className="text-text-muted text-xs uppercase tracking-widest">{t('loading')}</p>
      </div>
    </div>
  )
}
