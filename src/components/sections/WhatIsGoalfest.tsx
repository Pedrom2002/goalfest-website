import { getTranslations, getLocale } from 'next-intl/server'
import { AnimatedHeader, AnimatedStats, AnimatedFeatureCard } from './WhatIsGoalfestAnimations'

const FEATURE_KEYS = [
  { titleKey: 'features.matches_title', bodyKey: 'features.matches_body', isMatches: true },
  { titleKey: 'features.concerts_title', bodyKey: 'features.concerts_body', isConcerts: true },
  { titleKey: 'features.gaming_title', bodyKey: 'features.gaming_body' },
  { titleKey: 'features.football_title', bodyKey: 'features.football_body' },
  { titleKey: 'features.kids_title', bodyKey: 'features.kids_body' },
  { titleKey: 'features.food_title', bodyKey: 'features.food_body' },
  { titleKey: 'features.fun_title', bodyKey: 'features.fun_body' },
  { titleKey: 'features.golden_title', bodyKey: 'features.golden_body' },
  { titleKey: 'features.vip_title', bodyKey: 'features.vip_body' },
] as const

export default async function WhatIsGoalfest() {
  const t = await getTranslations('whatIsGoalfest')
  const locale = await getLocale()

  const features = FEATURE_KEYS.map((f) => ({
    title: t(f.titleKey),
    body: t(f.bodyKey),
    isMatches: 'isMatches' in f && f.isMatches === true ? true : false,
    isConcerts: 'isConcerts' in f && f.isConcerts === true ? true : false,
  }))

  const stats = ((['matches', 'concerts', 'hours'] as const)).map((key) => ({
    value: t(`stats.${key}_value`),
    label: t(`stats.${key}_label`),
  }))

  return (
    <section id="goalfest" className="relative py-12 md:py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,200,81,0.06) 0%, transparent 70%)'
      }} />

      <div className="max-w-7xl mx-auto relative">

        <AnimatedHeader>
          <div className="flex items-center gap-3 justify-center mb-5">
            <span className="h-px w-12 bg-[#43B02A]/40" />
            <p className="text-[#43B02A] text-xs uppercase tracking-[0.3em] font-medium">{t('tag')}</p>
            <span className="h-px w-12 bg-[#43B02A]/40" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black text-text-primary uppercase tracking-wide mb-6">
            {t('title_before')} <span className="text-[#43B02A]">{t('title_highlight')}</span>?
          </h2>
          <p className="text-text-primary text-2xl md:text-3xl font-bold max-w-xl mx-auto leading-snug mb-3">
            {t('desc_hook')}
          </p>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('desc_body')}
          </p>
        </AnimatedHeader>

        <AnimatedStats stats={stats} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <AnimatedFeatureCard
              key={f.title}
              feature={f}
              index={i}
              locale={locale}
              viewScheduleLabel={t('view_schedule')}
              viewConcertsLabel={t('view_concerts')}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
