'use client'

import { Component, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import * as Sentry from '@sentry/nextjs'
import { getEnv } from '@/lib/env'

const { NEXT_PUBLIC_VIDEO_VENUE } = getEnv()

class ModelErrorBoundary extends Component<{ children: ReactNode; fallbackText: string }, { failed: boolean }> {
  override state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  override componentDidCatch(error: Error) { Sentry.captureException(error) }
  override render() {
    if (this.state.failed) return (
      <div className="w-full h-full flex items-center justify-center text-text-muted text-xs uppercase tracking-widest">
        {this.props.fallbackText}
      </div>
    )
    return this.props.children
  }
}

const VenueModel = dynamic(() => import('@/components/ui/VenueModel'), { ssr: false })


export default function Venue() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('venue')
  const [isMobile, setIsMobile] = useState(false)
  const [load3D, setLoad3D] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(window.matchMedia('(max-width: 768px)').matches)
  }, [])

  const cards = [
    { title: t('access_car_title'), body: t('access_car_body') },
    { title: t('access_metro_title'), body: t('access_metro_body') },
    { title: t('access_bus_title'), body: t('access_bus_body') },
    {
      title: t('access_parking_title'),
      body: t('access_parking_body'),
      link: { href: 'https://maps.google.com/maps/search/estacionamento/@38.7659217,-9.1187136,16z', label: t('access_parking_link') }
    },
  ]

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const play = () => void video.play()?.catch(() => undefined)

    const load = () => {
      if (video.src) return
      // Set src only when section enters viewport â€” users who never scroll here
      // never download this video.
      video.src = NEXT_PUBLIC_VIDEO_VENUE
      video.playbackRate = 0.5
      if (!mq.matches) play()
    }

    const onMotion = (e: MediaQueryListEvent) => {
      if (e.matches) { video.pause(); video.currentTime = 0 }
      else if (video.src) play()
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') video.pause()
      else if (!mq.matches && video.src) play()
    }

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) { load(); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(section)

    mq.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      observer.disconnect()
      mq.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <section id="venue" className="relative overflow-hidden">

      {/* Full-width image hero */}
      <div className="relative h-[70vh] min-h-[500px]">
        <Image
          src="/goalfest-og.jpg"
          alt="Vale do SilÃªncio"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.60) 60%, rgba(13,26,13,1) 100%)'
        }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 -mt-16">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[#43B02A] text-sm uppercase tracking-[0.4em] mb-3 drop-shadow-lg font-semibold"
          >
            {t('tag')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-wide drop-shadow-2xl"
          >
            {t('venue_title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/80 text-lg mt-4 max-w-xl drop-shadow-md font-medium"
          >
            {t('sub')}
          </motion.p>
        </div>
      </div>

      {/* Video background for info section */}
      <div className="relative" ref={sectionRef}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: '5% 70%',
            transform: 'scaleX(-1) translateZ(0)',
            zIndex: 0,
            filter: isMobile
              ? 'brightness(0.32) saturate(0.55) hue-rotate(15deg) contrast(1.05)'
              : undefined,
          }}
        />
        {!isMobile && (
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(13,26,13,1) 0%, rgba(0,0,0,0.78) 20%, rgba(0,0,0,0.78) 80%, rgba(13,26,13,1) 100%)',
            transform: 'translate3d(0,0,0)',
            zIndex: 1,
            willChange: 'transform',
          }} />
        )}
        {isMobile && (
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to bottom, rgba(13,26,13,1) 0%, transparent 18%, transparent 82%, rgba(13,26,13,1) 100%)',
            zIndex: 1,
          }} />
        )}

      {/* Info section */}
      <div className="relative z-10 px-4 md:px-8 pb-12 md:pb-24 max-w-7xl mx-auto">

        {/* Address block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20 pt-10 md:pt-16"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-12 bg-[#43B02A]/40" />
            <p className="text-[#43B02A] text-xs uppercase tracking-[0.3em] font-medium">{t('how')}</p>
            <span className="h-px w-12 bg-[#43B02A]/40" />
          </div>
          <p className="text-white text-xl md:text-2xl font-bold mb-1">{t('venue_title')}</p>
          <p className="text-white/70 text-sm">{t('addr')}</p>

          <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-full border border-[#43B02A]/25 bg-[#43B02A]/5 px-6 py-3">
            <span className="text-[#43B02A] text-xs uppercase tracking-[0.25em] font-semibold">{t('hours_title')}</span>
            <span className="hidden sm:block h-4 w-px bg-white/15" />
            <span className="text-white/85 text-sm font-medium">{t('hours_weekday')}</span>
            <span className="hidden sm:block h-4 w-px bg-white/15" />
            <span className="text-white/85 text-sm font-medium">{t('hours_weekend')}</span>
          </div>

          <a
            href="https://maps.google.com/?q=38.7659217,-9.1187136"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-[#43B02A]/10 border border-[#43B02A]/40 text-[#43B02A] hover:bg-[#43B02A] hover:text-white text-xs font-semibold px-5 py-2.5 rounded-full uppercase tracking-widest transition-all duration-200 group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {t('maps')}
          </a>
        </motion.div>

        {/* Access cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative group rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/12 rounded-2xl transition-[border-color,box-shadow] duration-300 group-hover:border-[#C8102E]/30 group-hover:shadow-[0_0_30px_rgba(200,16,46,0.15)]" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8102E]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-4">
                <p className="text-[#43B02A]/30 text-xs font-mono font-bold mb-3 tracking-widest">0{i + 1}</p>
                <h3 className="text-text-primary font-semibold text-xs uppercase tracking-wider mb-2">{card.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{card.body}</p>
                {'link' in card && card.link && (
                  <a href={card.link.href} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[#43B02A] text-xs hover:underline">
                    {card.link.label}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Entrances note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex items-center gap-3 rounded-2xl border border-[#43B02A]/20 bg-[#43B02A]/5 px-5 py-4"
        >
          <p className="text-text-muted text-sm leading-relaxed">
            {t.rich('entrances', {
              bold: (chunks) => <span className="text-text-primary font-semibold">{chunks}</span>
            })}
          </p>
        </motion.div>

        {/* 3D Model */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20"
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="h-px w-12 bg-[#43B02A]/40" />
            <p className="text-[#43B02A] text-xs uppercase tracking-[0.3em] font-medium">{t('model')}</p>
            <span className="h-px w-12 bg-[#43B02A]/40" />
          </div>
          <div className="w-full h-[240px] md:h-[340px] rounded-2xl overflow-hidden border border-white/8 bg-bg-3d/50 backdrop-blur-sm shadow-[0_0_60px_rgba(0,200,81,0.05)] relative">
            {isMobile && !load3D ? (
              <button
                type="button"
                onClick={() => setLoad3D(true)}
                className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                aria-label="Carregar modelo 3D"
              >
                <Image src="/goalfest-og.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" aria-hidden />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-[#43B02A]/20 border-2 border-[#43B02A] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#43B02A" strokeWidth={2.5} className="w-6 h-6" aria-hidden>
                      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                    </svg>
                  </div>
                  <span className="text-[#43B02A] text-xs uppercase tracking-[0.25em] font-semibold">Ver em 3D</span>
                  <span className="text-text-muted/70 text-[10px] uppercase tracking-widest">~6 MB</span>
                </div>
              </button>
            ) : (
              <ModelErrorBoundary fallbackText={t('model_unavailable')}>
                <VenueModel loadingText={t('loading')} />
              </ModelErrorBoundary>
            )}
          </div>
          <p className="text-text-muted/60 text-xs text-center mt-4 tracking-wide">{t('drag')}</p>
        </motion.div>

        {/* Mapa do recinto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16"
        >
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="h-px w-12 bg-[#43B02A]/40" />
            <p className="text-[#43B02A] text-xs uppercase tracking-[0.3em] font-medium">{t('map')}</p>
            <span className="h-px w-12 bg-[#43B02A]/40" />
          </div>
          <div className="w-full rounded-2xl overflow-hidden border border-white/8 bg-bg-3d/50 backdrop-blur-sm shadow-[0_0_60px_rgba(0,200,81,0.05)] p-2 sm:p-4">
            <Image
              src="/versao11_legenda.png"
              alt={t('map_alt')}
              width={8001}
              height={4500}
              sizes="(max-width: 768px) 100vw, 900px"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  )
}
