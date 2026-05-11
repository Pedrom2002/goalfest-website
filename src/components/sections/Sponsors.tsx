'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import type { SponsorsData } from '@/types'

function SponsorPlaceholder({ name, large }: { name: string; large?: boolean }) {
  return (
    <div
      className={`bg-bg-surface border border-white/10 rounded-lg flex items-center justify-center transition-all duration-200 grayscale hover:grayscale-0 hover:border-gold/40 cursor-pointer ${
        large ? 'w-48 h-24 text-base' : 'w-32 h-16 text-xs'
      }`}
    >
      <span className="text-text-muted font-semibold uppercase tracking-wide">{name}</span>
    </div>
  )
}

export default function Sponsors({ data }: { data: SponsorsData }) {
  const t = useTranslations('sponsors')

  return (
    <section id="sponsors" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-16 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      <div className="flex flex-col items-center gap-4 mb-12">
        <p className="text-text-muted text-xs uppercase tracking-widest">{t('principal_label')}</p>
        <div className="flex gap-6 flex-wrap justify-center">
          {data.principal.map((s) => (
            <SponsorPlaceholder key={s.id} name={s.name} large />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-text-muted text-xs uppercase tracking-widest">{t('partners_label')}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          {data.parceiros.map((s) => (
            <SponsorPlaceholder key={s.id} name={s.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
