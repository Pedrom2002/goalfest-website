'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import Image from 'next/image'
import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.85)
      setPastHero(window.scrollY > window.innerHeight * 0.85)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const el = menuRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
    focusable[0]?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeMenu(); return }
      if (e.key !== 'Tab') return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen, closeMenu])

  const otherLocale = locale === 'pt' ? 'en' : 'pt'
  const switchLocale = () => {
    sessionStorage.setItem('locale-switch-scroll', String(window.scrollY))
    router.push(pathname, { locale: otherLocale })
    closeMenu()
  }

  const navLinks = [
    { href: '/#goalfest', label: t('goalfest') },
    { href: '/#venue', label: t('venue') },
    { href: '/#sponsors', label: t('sponsors') },
    { href: '/#faq', label: t('faq') },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg-primary/97 backdrop-blur-md shadow-lg border-b border-green-pt/25' : 'bg-black/10 backdrop-blur-[2px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <button
          onClick={() => {
            if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
            else router.push('/')
          }}
          className={`block transition-all duration-300 hover:scale-105 ${pastHero || pathname !== '/' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label={locale === 'pt' ? 'Ir para página principal' : 'Go to home page'}
        >
          <Image src="/goalfest-logo.png" alt="Fanzone Lisboa" height={28} width={84} className="object-contain" />
        </button>

        <nav className="hidden md:flex items-center gap-8" aria-label={locale === 'pt' ? 'Navegação principal' : 'Main navigation'}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-white hover:text-gold transition-colors duration-200 text-[17px] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-bebas)' }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={switchLocale}
            aria-label={locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            className="text-white hover:text-gold text-[15px] border border-white/30 px-2 py-1 rounded hover:border-gold transition-colors tracking-[0.1em]" style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {otherLocale.toUpperCase()}
          </button>
        </nav>

        <button
          ref={hamburgerRef}
          className="md:hidden text-text-primary bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? (locale === 'pt' ? 'Fechar menu' : 'Close menu') : (locale === 'pt' ? 'Abrir menu' : 'Open menu')}
        >
          <div className="w-6 flex flex-col gap-1.5" aria-hidden="true">
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={locale === 'pt' ? 'Menu de navegação' : 'Navigation menu'}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-72 border-l border-green-pt/20 z-40 flex flex-col" style={{ backgroundColor: '#0d1a0d' }}
            >
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
                <span className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium" aria-hidden="true">Menu</span>
                <button onClick={closeMenu} className="text-text-muted hover:text-white transition-colors" aria-label={locale === 'pt' ? 'Fechar menu' : 'Close menu'}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-5 h-5" aria-hidden="true">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <nav className="flex flex-col flex-1 px-6 py-8 gap-1" aria-label={locale === 'pt' ? 'Navegação mobile' : 'Mobile navigation'}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <a
                      href={`/${locale}${link.href}`}
                      onClick={closeMenu}
                      className="flex items-center justify-between py-4 border-b border-white/6 text-text-primary hover:text-green-pt text-xl uppercase tracking-[0.12em] transition-colors group" style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      {link.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" aria-hidden="true">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </a>
                  </motion.div>
                ))}
              </nav>

              <div className="px-6 py-6 border-t border-white/10">
                <button
                  onClick={switchLocale}
                  aria-label={locale === 'pt' ? 'Switch to English' : 'Mudar para Português'}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/20 rounded-lg text-text-muted hover:text-white hover:border-white/40 text-sm font-medium transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className="w-4 h-4" aria-hidden="true">
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
