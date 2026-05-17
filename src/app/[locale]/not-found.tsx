import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gap-8">
      <p className="text-green-pt font-display text-8xl font-black">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-text-primary text-2xl font-bold uppercase tracking-wide">{t('heading')}</h1>
        <p className="text-text-muted text-sm">{t('body')}</p>
      </div>
      <Link
        href="/"
        className="border border-green-pt text-green-pt hover:bg-green-pt hover:text-bg-primary font-bold px-8 py-3 rounded uppercase tracking-wide transition-all duration-200"
      >
        {t('back')}
      </Link>
    </div>
  )
}
