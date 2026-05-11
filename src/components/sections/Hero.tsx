'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CountdownTimer from '@/components/ui/CountdownTimer'

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => i)
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#C8102E' : '#006600',
            opacity: 0.3,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <Particles />

      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-surface opacity-80" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <h1 className="font-display text-6xl md:text-8xl font-black text-gold tracking-widest uppercase leading-none">
            FANZONE
          </h1>
          <div className="flex gap-2 my-2">
            <span className="block h-1 w-12 bg-red-pt rounded" />
            <span className="block h-1 w-12 bg-green-pt rounded" />
            <span className="block h-1 w-12 bg-gold rounded" />
          </div>
          <p className="text-text-muted tracking-[0.5em] text-sm uppercase">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CountdownTimer />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href={`/${locale}/bilhetes`}
            className="bg-red-pt hover:bg-red-pt/80 text-white font-bold px-8 py-3 rounded uppercase tracking-wide transition-colors duration-200"
          >
            {t('cta_tickets')}
          </Link>
          <a
            href="#jogos"
            className="border border-gold text-gold hover:bg-gold hover:text-bg-primary font-bold px-8 py-3 rounded uppercase tracking-wide transition-all duration-200"
          >
            {t('cta_matches')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
