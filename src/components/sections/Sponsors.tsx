'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { SponsorsData } from '@/types'

function SponsorLogo({ name, logo, url, large, logoScale, index }: { name: string; logo: string | null; url?: string; large?: boolean; logoScale?: number; index: number }) {
  const scale = logoScale ?? 1
  const pct = `${scale * 100}%`
  const inner = (
    <>
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={large ? 160 : 100}
          height={large ? 72 : 44}
          className="object-contain"
          style={{ width: pct, height: pct, maxWidth: scale > 1 ? 'none' : undefined }}
        />
      ) : (
        <span className="text-text-muted font-semibold uppercase tracking-wide text-xs">{name}</span>
      )}
    </>
  )

  const card = (
    <motion.div
      initial={{ opacity: 0, scale: large ? 0.8 : 0.9, y: large ? 0 : 10 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.08, boxShadow: large ? '0 0 24px rgba(255,215,0,0.2)' : '0 0 16px rgba(255,255,255,0.1)' }}
      className={`bg-white/8 border border-white/14 rounded-xl flex items-center justify-center transition-all duration-300 hover:border-white/35 p-4 overflow-hidden ${
        large ? 'w-36 h-16 md:w-48 md:h-24' : 'w-36 h-16 md:w-44 md:h-24'
      }`}
    >
      {inner}
    </motion.div>
  )

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
      {card}
    </a>
  ) : card
}

export default function Sponsors({ data }: { data: SponsorsData }) {
  const t = useTranslations('sponsors')

  return (
    <section id="sponsors" className="relative py-12 md:py-24 px-4" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 70%)' }}>
      <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

        {/* Left: Patrocinadores */}
        <div className="flex flex-col items-center gap-8 px-4 md:px-8 pb-12 md:pb-0 border-b border-white/10 md:border-b-0 md:border-r md:border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 justify-center"
          >
            <span className="h-px w-12 bg-gold/40" />
            <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">{t('title')}</h2>
            <span className="h-px w-12 bg-gold/40" />
          </motion.div>
          <div className="flex gap-6 flex-wrap justify-center">
            {data.principal.map((s, i) => (
              <SponsorLogo key={s.id} name={s.name} logo={s.logo} {...(s.url !== undefined && { url: s.url })} {...(s.logoScale !== undefined && { logoScale: s.logoScale })} large index={i} />
            ))}
          </div>
        </div>

        {/* Right: Parceiros */}
        <div className="flex flex-col items-center gap-8 px-4 md:px-8 pt-12 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 justify-center"
          >
            <span className="h-px w-12 bg-white/20" />
            <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">{t('partners_label')}</h2>
            <span className="h-px w-12 bg-white/20" />
          </motion.div>
          <div className="flex gap-4 flex-wrap justify-center">
            {data.parceiros.map((s, i) => (
              <SponsorLogo key={s.id} name={s.name} logo={s.logo} {...(s.url !== undefined && { url: s.url })} {...(s.logoScale !== undefined && { logoScale: s.logoScale })} index={i} />
            ))}
          </div>
        </div>

      </div>
      </div>
    </section>
  )
}
