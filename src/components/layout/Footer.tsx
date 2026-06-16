'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/goalfest.26',
    app: 'instagram://user?username=goalfest.26',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.41.56.21.96.47 1.38.89.42.42.68.82.89 1.38.17.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.41 2.22-.21.56-.47.96-.89 1.38-.42.42-.82.68-1.38.89-.42.17-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.41a3.72 3.72 0 0 1-1.38-.89 3.72 3.72 0 0 1-.89-1.38c-.17-.42-.36-1.05-.41-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.41-2.22.21-.56.47-.96.89-1.38.42-.42.82-.68 1.38-.89.42-.17 1.05-.36 2.22-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.27-2.91.57a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .62 4.16c-.3.76-.51 1.63-.57 2.91C-.01 8.35-.02 8.76-.02 12s.01 3.65.07 4.93c.06 1.28.27 2.15.57 2.91.3.78.71 1.45 1.39 2.13.68.68 1.35 1.09 2.13 1.39.76.3 1.63.51 2.91.57C8.33 23.99 8.74 24 12 24s3.65-.01 4.93-.07c1.28-.06 2.15-.27 2.91-.57a5.9 5.9 0 0 0 2.13-1.39 5.9 5.9 0 0 0 1.39-2.13c.3-.76.51-1.63.57-2.91.06-1.28.07-1.69.07-4.93s-.01-3.65-.07-4.93c-.06-1.28-.27-2.15-.57-2.91a5.9 5.9 0 0 0-1.39-2.13A5.9 5.9 0 0 0 19.84.64c-.76-.3-1.63-.51-2.91-.57C15.65.01 15.24 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.84a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
      </svg>
    ),
  },
] as const

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const isPt = locale === 'pt'

  return (
    <footer className="relative z-10 bg-bg-surface border-t border-white/10 py-6 mt-10 pb-14" style={{ fontFamily: 'var(--font-dm-sans)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image src="/GOALFEST-logo2.webp" alt="Fanzone Lisboa" height={60} width={180} className="object-contain h-[60px] w-auto" />
        <p className="text-text-muted text-xs opacity-60">{t('copyright')}</p>

        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={('app' in s && s.app) ? s.app : s.href}
              onClick={(e) => {
                if (!('app' in s) || !s.app) return
                const fallback = window.setTimeout(() => { window.location.href = s.href }, 500)
                window.addEventListener('blur', () => window.clearTimeout(fallback), { once: true })
              }}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-text-muted/50 hover:text-[#43B02A] transition-colors"
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5 flex-wrap justify-center">
          <a
            href="mailto:goalfest@quic.pt"
            className="text-text-muted/50 text-xs hover:text-[#43B02A] transition-colors"
          >
            goalfest@quic.pt
          </a>
          <span className="text-white/10 text-xs">|</span>
          <a
            href={`#sponsors`}
            className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-[#43B02A] transition-colors"
          >
            {isPt ? 'Parceiros' : 'Partners'}
          </a>
          <span className="text-white/10 text-xs">|</span>
          <Link
            href="/privacidade"
            className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-[#43B02A] transition-colors"
          >
            {isPt ? 'Privacidade' : 'Privacy'}
          </Link>
          <span className="text-white/10 text-xs">|</span>
          <Link
            href="/termos"
            className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-[#43B02A] transition-colors"
          >
            {isPt ? 'Termos' : 'Terms'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
