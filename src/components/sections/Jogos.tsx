'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import type { Match } from '@/types'
import MatchCard from '@/components/ui/MatchCard'
import { applyFilter, type Filter } from '@/lib/matchFilters'

const filters: Filter[] = ['all', 'grupos', 'eliminatorias', 'portugal']
const filterKeys: Record<Filter, string> = {
  all: 'filter_all',
  grupos: 'filter_grupos',
  eliminatorias: 'filter_eliminatorias',
  portugal: 'filter_portugal',
}

export default function Jogos({ matches }: { matches: Match[] }) {
  const t = useTranslations('jogos')
  const [active, setActive] = useState<Filter>('all')
  const filtered = applyFilter(matches, active)

  return (
    <section id="jogos" className="relative py-24 px-4" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,200,81,0.07) 0%, transparent 60%)' }}>
      <div className="max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-12 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`relative px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
              active === f
                ? 'text-bg-primary'
                : 'bg-bg-surface text-text-muted hover:text-gold border border-white/10'
            }`}
          >
            {active === f && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 bg-green-pt rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{t(filterKeys[f])}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((match, i) => (
            <motion.div
              key={match.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <MatchCard match={match} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </div>
    </section>
  )
}
