import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-bg-surface border-t border-white/10 py-5 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <Image src="/Design sem nome(3).png" alt="Fanzone Lisboa" height={20} width={64} className="object-contain" />
        <p className="text-text-muted text-xs opacity-60">{t('copyright')}</p>
      </div>
    </footer>
  )
}
