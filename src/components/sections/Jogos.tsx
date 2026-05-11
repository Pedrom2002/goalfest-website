'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import type { Match } from '@/types'
import MatchCard from '@/components/ui/MatchCard'

type Filter = 'all' | 'grupos' | 'eliminatorias' | 'portugal'

const filters: Filter[] = ['all', 'grupos', 'eliminatorias', 'portugal']
const filterKeys: Record<Filter, string> = {
  all: 'filter_all',
  grupos: 'filter_grupos',
  eliminatorias: 'filter_eliminatorias',
  portugal: 'filter_portugal',
}

function applyFilter(matches: Match[], filter: Filter): Match[] {
  if (filter === 'all') return matches
  if (filter === 'grupos') return matches.filter((m) => m.phase === 'grupo')
  if (filter === 'eliminatorias') return matches.filter((m) => m.phase !== 'grupo')
  if (filter === 'portugal') {
    return matches.filter(
      (m) => m.home.nameEn === 'Portugal' || m.away.nameEn === 'Portugal'
    )
  }
  return matches
}

export default function Jogos({ matches }: { matches: Match[] }) {
  const t = useTranslations('jogos')
  const locale = useLocale()
  const [active, setActive] = useState<Filter>('all')
  const filtered = applyFilter(matches, active)

  return (
    <section id="jogos" className="py-24 px-4 max-w-7xl mx-auto">
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
            className={`px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
              active === f
                ? 'bg-gold text-bg-primary'
                : 'bg-bg-surface text-text-muted hover:text-gold border border-white/10'
            }`}
          >
            {t(filterKeys[f])}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((match, i) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <MatchCard match={match} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
