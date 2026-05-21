'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { useEffect, useRef } from 'react'

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
          className="w-1 rounded-full bg-[#43B02A]"
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

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const play = () => void video.play()?.catch(() => undefined)

    if (!mq.matches) play()

    const onMotion = (e: MediaQueryListEvent) => {
      if (e.matches) { video.pause(); video.currentTime = 0 } else play()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') video.pause()
      else if (!mq.matches) play()
    }
    // Loop apenas primeiros 30s
    const onTimeUpdate = () => {
      if (video.currentTime >= 30) video.currentTime = 0
    }

    mq.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    video.addEventListener('timeupdate', onTimeUpdate)

    return () => {
      mq.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
      video.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-8">
      {/* Video background — mundial.mp4 (primeiros 30s em loop) */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          src="/mundial.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scale(1.25)', transformOrigin: 'center' }}
          aria-hidden="true"
        />
      </div>

      {/* Fade overlay — apenas bottom fade para transição suave */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(13,26,13,0.90) 100%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 1.06, y: -14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex flex-col items-center -mt-32"
        >
          <div className="relative">
            <Image
              src="/goalfest-main-logo.webp"
              alt="Goalfest Lisboa"
              width={700}
              height={700}
              sizes="(max-width: 640px) 420px, (max-width: 768px) 560px, 700px"
              className="object-contain relative z-10 w-[420px] sm:w-[560px] md:w-[700px]"
              style={{ filter: 'brightness(1.05) saturate(1.05) drop-shadow(0 0 12px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(0,0,0,0.7)) drop-shadow(0 0 60px rgba(0,0,0,0.5))' }}
              quality={100}
              priority
            />
          </div>
          <h1 className="sr-only">Goalfest Lisboa - Fanzone Oficial do Mundial 2026 no Parque das NaÃ§Ãµes</h1>
          <p className="tracking-[0.2em] text-sm sm:text-base md:text-lg uppercase relative z-20 -mt-28 sm:-mt-36 md:-mt-44" style={{ fontFamily: 'var(--font-bebas)', color: 'rgba(255,255,255,0.75)', textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}>{t('dates')}</p>
          <p className="tracking-[0.15em] text-base sm:text-lg md:text-xl uppercase relative z-20 mt-1" style={{ fontFamily: 'var(--font-bebas)', color: 'rgba(255,255,255,0.9)', textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}>{t('subtitle')}</p>
          <div className="flex flex-col items-center gap-0.5 mt-3 relative z-20">
            <span className="text-white text-[9px] uppercase tracking-widest leading-none" style={{ textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}>powered by</span>
            <Image
              src="/quicnation-logo.png"
              alt="Quic"
              width={56}
              height={20}
              className="object-contain w-[56px] h-auto"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.9)) drop-shadow(0 0 14px rgba(0,0,0,0.7))' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-3 mt-4"
        >
          <p className="text-white text-sm sm:text-base font-semibold uppercase tracking-[0.25em]" style={{ textShadow: '0 0 12px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1)' }}>Countdown para o Mundial 2026</p>
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
          className="w-px h-12 bg-gradient-to-b from-[#43B02A] to-transparent"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
