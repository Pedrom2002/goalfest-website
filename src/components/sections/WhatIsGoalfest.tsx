'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

type Feature = { titleKey: string; bodyKey: string; isMatches?: boolean }

const FEATURES: Feature[] = [
  { titleKey: 'features.matches_title', bodyKey: 'features.matches_body', isMatches: true },
  { titleKey: 'features.concerts_title', bodyKey: 'features.concerts_body' },
  { titleKey: 'features.gaming_title', bodyKey: 'features.gaming_body' },
  { titleKey: 'features.football_title', bodyKey: 'features.football_body' },
  { titleKey: 'features.kids_title', bodyKey: 'features.kids_body' },
  { titleKey: 'features.food_title', bodyKey: 'features.food_body' },
  { titleKey: 'features.fun_title', bodyKey: 'features.fun_body' },
  { titleKey: 'features.golden_title', bodyKey: 'features.golden_body' },
  { titleKey: 'features.vip_title', bodyKey: 'features.vip_body' },
]

export default function WhatIsGoalfest() {
  const t = useTranslations('whatIsGoalfest')
  const locale = useLocale()

  return (
    <section id="goalfest" className="relative py-12 md:py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,200,81,0.06) 0%, transparent 70%)'
      }} />

      <div className="max-w-7xl mx-auto relative">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center gap-3 justify-center mb-5">
            <span className="h-px w-12 bg-green-pt/40" />
            <p className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">{t('tag')}</p>
            <span className="h-px w-12 bg-green-pt/40" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-text-primary uppercase tracking-wide mb-6">
            {t('title_before')} <span className="text-green-pt">{t('title_highlight')}</span>?
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('desc')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 md:gap-12 my-12 md:my-16"
        >
          {(['matches', 'concerts', 'hours'] as const).map((key) => (
            <div key={key} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-black text-green-pt">{t(`stats.${key}_value`)}</p>
              <p className="text-text-muted text-xs uppercase tracking-widest mt-1">{t(`stats.${key}_label`)}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl p-6 bg-bg-surface/80 border border-white/12 hover:border-green-pt/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,200,81,0.08)] backdrop-blur-sm"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-pt/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
              <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-2">{t(f.titleKey)}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{t(f.bodyKey)}</p>
              {f.isMatches && (
                <Link href={`/${locale}/jogos`} className="inline-block mt-3 text-green-pt text-xs font-semibold hover:underline uppercase tracking-widest">
                  {t('view_schedule')}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
