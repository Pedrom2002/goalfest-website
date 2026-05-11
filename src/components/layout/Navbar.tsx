'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'pt' ? 'en' : 'pt'
  const switchLocale = () => {
    const segments = pathname.split('/')
    segments[1] = otherLocale
    router.push(segments.join('/'))
  }

  const navLinks = [
    { href: `/${locale}/#jogos`, label: t('jogos') },
    { href: `/${locale}/#venue`, label: t('venue') },
    { href: `/${locale}/#galeria`, label: t('galeria') },
    { href: `/${locale}/faq`, label: t('faq') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-primary/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="font-display text-xl font-bold text-gold tracking-widest uppercase">
          Fanzone
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted hover:text-gold transition-colors duration-200 text-sm font-medium uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/bilhetes`}
            className="bg-red-pt text-white px-4 py-2 rounded text-sm font-semibold uppercase tracking-wide hover:bg-red-pt/80 transition-colors"
          >
            {t('bilhetes')}
          </Link>
          <button
            onClick={switchLocale}
            className="text-text-muted hover:text-gold text-sm font-medium border border-text-muted/30 px-2 py-1 rounded hover:border-gold transition-colors"
          >
            {otherLocale.toUpperCase()}
          </button>
        </nav>

        <button
          className="md:hidden text-text-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-64 bg-bg-surface z-40 flex flex-col gap-6 p-8 pt-20 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-text-primary hover:text-gold text-lg font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/bilhetes`}
              onClick={() => setMenuOpen(false)}
              className="bg-red-pt text-white px-4 py-2 rounded text-center font-semibold"
            >
              {t('bilhetes')}
            </Link>
            <button onClick={switchLocale} className="text-text-muted text-sm text-left">
              {locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
