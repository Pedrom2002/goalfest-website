'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { useEffect, useRef } from 'react'
import { getEnv } from '@/lib/env'

const { NEXT_PUBLIC_VIDEO_HERO } = getEnv()

const EQ_BARS = [
  { delay: '0s',     dur: '0.6s' },
  { delay: '0.15s',  dur: '0.5s' },
  { delay: '0.05s',  dur: '0.7s' },
  { delay: '0.2s',   dur: '0.55s' },
  { delay: '0.1s',   dur: '0.65s' },
  { delay: '0.25s',  dur: '0.5s' },
  { delay: '0.08s',  dur: '0.6s' },
]

function EqualizerBars() {
  return (
    <div className="flex items-end gap-1 h-8" aria-hidden>
      {EQ_BARS.map((b, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-green-pt"
          style={{
            opacity: 0.25,
            height: '100%',
            willChange: 'transform',
            animation: `eqBar ${b.dur} ${b.delay} ease-in-out infinite`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  )
}

export default function Hero() {
  const t = useTranslations('hero')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set src client-side only — keeps it out of SSR HTML so crawlers/prerenderers
    // don't trigger Blob downloads.
    video.src = NEXT_PUBLIC_VIDEO_HERO

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const play = () => void video.play()?.catch(() => undefined)

    if (!mq.matches) play()

    const onMotion = (e: MediaQueryListEvent) => {
      if (e.matches) { video.pause(); video.currentTime = 0 } else play()
    }
    // Pause when tab is hidden — stops download/decoding in background.
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') video.pause()
      else if (!mq.matches) play()
    }

    mq.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      mq.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-8">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Fade overlays */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(13,26,13,0.85) 100%)' }} />
      {/* Edge vignette */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.28) 100%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 1.05, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative flex flex-col items-center"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(94,166,59,0.18) 0%, transparent 70%)', filter: 'blur(24px)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <Image
              src="/goalfest-logo.png"
              alt="Goalfest Lisboa"
              width={360}
              height={360}
              sizes="(max-width: 640px) 220px, (max-width: 768px) 300px, 360px"
              className="object-contain relative z-10 w-[220px] sm:w-[300px] md:w-[360px]"
              priority
            />
          </div>
          <div className="flex flex-col items-center gap-1 mt-3">
            <span className="text-white/60 text-[10px] uppercase tracking-widest leading-none">powered by</span>
            <Image
              src="/quicnation-logo.png"
              alt="Quic"
              width={60}
              height={22}
              className="object-contain"
            />
          </div>
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
