'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import InfoTicker from '@/components/ui/InfoTicker'
import { useEffect, useRef } from 'react'

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
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-8 bg-black">
      {/* Video background — mundial.mp4 (primeiros 30s em loop) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage: 'url(/mundial-poster.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
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
          poster="/mundial-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'scaleX(-1) scale(1.25)', transformOrigin: 'center' }}
          aria-hidden="true"
        />
      </div>

      {/* Fade overlay — apenas bottom fade para transição suave */}
      <div className="absolute inset-0 z-[2]" style={{ background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(13,26,13,0.90) 100%)' }} />

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          className="relative flex flex-col items-center -mt-32 hero-fade-in"
          style={{ animationDelay: '0.35s' }}
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
        </div>

        <div
          className="flex flex-col items-center gap-3 mt-4 hero-fade-up"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-white text-sm sm:text-base font-semibold uppercase tracking-[0.25em]" style={{ textShadow: '0 0 12px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1)' }}>Vale do Silêncio, Lisboa</p>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-scroll-fade">
        <div className="w-px h-12 bg-gradient-to-b from-[#43B02A] to-transparent hero-scroll-line" />
      </div>

      <InfoTicker />
    </section>
  )
}
