import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-bg-surface border-t border-white/10 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display text-gold text-lg tracking-widest uppercase">Fanzone Lisboa</span>
        <nav className="flex gap-6 text-text-muted text-sm">
          <Link href={`/${locale}/faq`} className="hover:text-gold transition-colors">FAQ</Link>
          <Link href={`/${locale}/bilhetes`} className="hover:text-gold transition-colors">Bilhetes</Link>
        </nav>
        <p className="text-text-muted text-xs">{t('copyright')}</p>
      </div>
    </footer>
  )
}
