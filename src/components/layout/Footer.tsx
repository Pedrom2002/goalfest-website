'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const isPt = locale === 'pt'

  return (
    <footer className="bg-bg-surface border-t border-white/10 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image src="/Design sem nome(3).png" alt="Fanzone Lisboa" height={28} width={84} className="object-contain" />
        <p className="text-text-muted text-xs opacity-60">{t('copyright')}</p>
        <div className="flex items-center gap-5 flex-wrap justify-center">
          <a
            href="mailto:goalfest@quic.pt"
            className="text-text-muted/50 text-xs hover:text-green-pt transition-colors"
          >
            goalfest@quic.pt
          </a>
          <span className="text-white/10 text-xs">|</span>
          <Link
            href={`/${locale}/privacidade`}
            className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-green-pt transition-colors"
          >
            {isPt ? 'Privacidade' : 'Privacy'}
          </Link>
          <span className="text-white/10 text-xs">|</span>
          <Link
            href={`/${locale}/termos`}
            className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-green-pt transition-colors"
          >
            {isPt ? 'Termos' : 'Terms'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
