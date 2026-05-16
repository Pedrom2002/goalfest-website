'use client'

import { Component, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'

class ModelErrorBoundary extends Component<{ children: ReactNode; fallbackText: string }, { failed: boolean }> {
  override state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
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

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
    <path d="M5 17H3v-5l2.5-6h13L21 12v5h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="16.5" cy="17.5" r="2.5" />
    <path d="M5 12h14" />
  </svg>
)

const MetroIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
    <rect x="4" y="3" width="16" height="13" rx="2" />
    <path d="M8 16v3m8-3v3M6 19h12" />
    <path d="M8 7l2 3 2-3 2 3 2-3" />
  </svg>
)

const ParkingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </svg>
)

const BusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true">
    <path d="M8 6v6M3 6h18M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
    <circle cx="7" cy="17" r="1" />
    <circle cx="17" cy="17" r="1" />
  </svg>
)

export default function Venue() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const t = useTranslations('venue')

  const cards = [
    { Icon: CarIcon, title: t('access_car_title'), body: t('access_car_body') },
    { Icon: MetroIcon, title: t('access_metro_title'), body: t('access_metro_body') },
    { Icon: BusIcon, title: t('access_bus_title'), body: t('access_bus_body') },
    {
      Icon: ParkingIcon,
      title: t('access_parking_title'),
      body: t('access_parking_body'),
      link: { href: 'https://maps.google.com/maps/search/estacionamento/@38.7659217,-9.1187136,16z', label: `${t('access_parking_link')} ↗` }
    },
  ]

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5
  }, [])

  return (
    <section id="venue" className="relative overflow-hidden">

      {/* Full-width image hero */}
      <div className="relative h-[70vh] min-h-[500px]">
        <Image
          src="/01_Sofia_ConcertoValeSilencio_0609_16x9.jpg"
          alt="Vale do Silêncio"
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
            className="text-green-pt text-sm uppercase tracking-[0.4em] mb-3 drop-shadow-lg font-semibold"
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
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '5% 70%', transform: 'scaleX(-1)' }}
          src="https://phwtscjrqihtamdy.public.blob.vercel-storage.com/136530-764417335-E3vSmNxFr1b7rZyCVuUefga9T4BlLL.mp4"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(13,26,13,1) 0%, rgba(0,0,0,0.78) 20%, rgba(0,0,0,0.78) 80%, rgba(13,26,13,1) 100%)'
        }} />

      {/* Info section */}
      <div className="relative px-4 md:px-8 pb-12 md:pb-24 max-w-7xl mx-auto">

        {/* Address block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20 pt-10 md:pt-16"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-12 bg-green-pt/40" />
            <p className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">{t('how')}</p>
            <span className="h-px w-12 bg-green-pt/40" />
          </div>
          <p className="text-white text-xl md:text-2xl font-bold mb-1">{t('venue_title')}</p>
          <p className="text-white/70 text-sm">{t('addr')}</p>
          <a
            href="https://maps.google.com/?q=38.7659217,-9.1187136"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 bg-green-pt/10 border border-green-pt/40 text-green-pt hover:bg-green-pt hover:text-bg-primary text-xs font-semibold px-5 py-2.5 rounded-full uppercase tracking-widest transition-all duration-200 group"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            {t('maps')}
            <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">↗</span>
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
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/12 rounded-2xl transition-all duration-300 group-hover:border-green-pt/30 group-hover:shadow-[0_0_30px_rgba(0,200,81,0.10)]" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-pt/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-4">
                <p className="text-green-pt/30 text-xs font-mono font-bold mb-3 tracking-widest">0{i + 1}</p>
                <card.Icon />
                <h3 className="text-text-primary font-semibold text-xs uppercase tracking-wider mb-2 mt-2">{card.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed">{card.body}</p>
                {'link' in card && card.link && (
                  <a href={card.link.href} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-green-pt text-xs hover:underline">
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
          className="mt-6 flex items-center gap-3 rounded-2xl border border-green-pt/20 bg-green-pt/5 px-5 py-4"
        >
          <span className="text-green-pt text-lg shrink-0" aria-hidden="true">↔</span>
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
            <span className="h-px w-12 bg-green-pt/40" />
            <p className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">{t('model')}</p>
            <span className="h-px w-12 bg-green-pt/40" />
          </div>
          <div className="w-full h-[240px] md:h-[340px] rounded-2xl overflow-hidden border border-white/8 bg-bg-surface shadow-[0_0_60px_rgba(0,200,81,0.05)]">
            <ModelErrorBoundary fallbackText={t('model_unavailable')}>
              <VenueModel />
            </ModelErrorBoundary>
          </div>
          <p className="text-text-muted/60 text-xs text-center mt-4 tracking-wide">{t('drag')}</p>
        </motion.div>
      </div>
      </div>
    </section>
  )
}
