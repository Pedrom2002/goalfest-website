'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CountdownTimer from '@/components/ui/CountdownTimer'

const EQUALIZER_BARS = [
  { delay: 0,    duration: 0.6 },
  { delay: 0.15, duration: 0.5 },
  { delay: 0.05, duration: 0.7 },
  { delay: 0.2,  duration: 0.55 },
  { delay: 0.1,  duration: 0.65 },
  { delay: 0.25, duration: 0.5 },
  { delay: 0.08, duration: 0.6 },
]

function EqualizerBars() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="flex items-end gap-1 h-8" aria-hidden>
      {EQUALIZER_BARS.map((b, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-green-pt"
          style={{ opacity: 0.25 }}
          animate={{ scaleY: [0.3, 1, 0.5, 0.8, 0.3] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
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
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/122965-726547934.mp4"
        />
      </div>

      {/* Fade overlays */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(36,53,36,0.85) 100%)' }} />
      {/* Edge vignette */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.28) 100%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 1.15, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative flex flex-col items-center"
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(0,200,81,0.15) 0%, transparent 70%)', filter: 'blur(20px)' }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Image
            src="/Design sem nome(3).png"
            alt="Goalfest Lisboa"
            width={360}
            height={360}
            className="object-contain relative z-10 w-[220px] sm:w-[300px] md:w-[360px]"
            priority
          />
          <p className="text-text-muted tracking-[0.5em] text-sm uppercase mt-4">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <CountdownTimer />
          <EqualizerBars />
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={`/${locale}/bilhetes`}
              className="block bg-red-pt hover:bg-red-pt/80 text-white font-bold px-8 py-3 rounded uppercase tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(200,16,46,0.3)] hover:shadow-[0_0_30px_rgba(200,16,46,0.5)]"
            >
              {t('cta_tickets')}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#jogos"
              className="block border border-green-pt text-green-pt hover:bg-green-pt hover:text-bg-primary font-bold px-8 py-3 rounded uppercase tracking-wide transition-all duration-200 shadow-[0_0_20px_rgba(0,200,81,0.2)] hover:shadow-[0_0_30px_rgba(0,200,81,0.4)]"
            >
              {t('cta_matches')}
            </a>
          </motion.div>
        </motion.div> */}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-green-pt to-transparent"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
