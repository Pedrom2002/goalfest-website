'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      setPastHero(window.scrollY > window.innerHeight * 0.3)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'pt' ? 'en' : 'pt'
  const switchLocale = () => {
    const segments = pathname.split('/')
    segments[1] = otherLocale
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    router.push(segments.join('/') + hash)
    setMenuOpen(false)
  }

  const switchLocaleKeepMenu = () => {
    const segments = pathname.split('/')
    segments[1] = otherLocale
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    router.push(segments.join('/') + hash)
    setMenuOpen(false)
  }

  const navLinks = [
    { href: `/${locale}/#goalfest`, label: t('goalfest') },
    { href: `/${locale}/#venue`, label: t('venue') },
    { href: `/${locale}/#sponsors`, label: t('sponsors') },
    { href: `/${locale}/#faq`, label: t('faq') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-primary/97 backdrop-blur-md shadow-lg border-b border-green-pt/25' : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href={`/${locale}`} className={`block transition-all duration-300 hover:scale-105 ${pastHero ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-label="Ir para página principal">
          <Image src="/Design sem nome(3).png" alt="Fanzone Lisboa" height={28} width={84} className="object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted hover:text-gold transition-colors duration-200 text-[13px] font-medium uppercase tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              {link.label}
            </Link>
          ))}
          {/* <Link
            href={`/${locale}/bilhetes`}
            className="bg-red-pt text-white px-4 py-2 rounded text-sm font-semibold uppercase tracking-wide hover:bg-red-pt/80 transition-colors"
          >
            {t('bilhetes')}
          </Link> */}
          <button
            onClick={switchLocale}
            className="text-text-muted hover:text-gold text-[12px] font-medium border border-text-muted/30 px-2 py-1 rounded hover:border-gold transition-colors" style={{ fontFamily: 'var(--font-orbitron)' }}
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
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-72 bg-bg-primary border-l border-white/10 z-40 flex flex-col"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
                <span className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">Menu</span>
                <button onClick={() => setMenuOpen(false)} className="text-text-muted hover:text-white transition-colors" aria-label="Fechar menu">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col flex-1 px-6 py-8 gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-4 border-b border-white/6 text-text-primary hover:text-green-pt text-base font-semibold uppercase tracking-wide transition-colors group"
                    >
                      {link.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom: locale switch */}
              <div className="px-6 py-6 border-t border-white/10">
                <button
                  onClick={switchLocaleKeepMenu}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/20 rounded-lg text-text-muted hover:text-white hover:border-white/40 text-sm font-medium transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20M2 12h20"/>
                  </svg>
                  {locale === 'pt' ? 'English' : 'Português'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
