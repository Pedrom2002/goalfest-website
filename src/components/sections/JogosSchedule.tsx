'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import type { BroadcastDay } from '@/data/schedule'
import { TEAM_FLAG } from '@/data/teamFlags'
import { phaseOf, phaseLabel } from '@/lib/matchPhase'
import * as Flags from 'country-flag-icons/react/3x2'

type FlagCode = keyof typeof Flags

function Flag({ team }: { team: string }) {
  const code = TEAM_FLAG[team] as FlagCode | undefined
  if (!code) return null
  const FlagComp = Flags[code]
  if (!FlagComp) return null
  return <FlagComp className="w-6 h-4 rounded-sm object-cover shadow-sm" />
}

export default function JogosSchedule({ schedule }: { schedule: BroadcastDay[] }) {
  const t = useTranslations('jogos')
  const locale = useLocale()
  const [filter, setFilter] = useState<'all' | 'group' | 'knockout'>('all')

  const filtered = schedule.filter(d => filter === 'all' || phaseOf(d.date) === filter)

  const FILTERS = [
    { key: 'all',      label: t('filter_all') },
    { key: 'knockout', label: t('filter_eliminatorias') },
  ] as const

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="flex items-center gap-3 justify-center mb-4">
          <span className="h-px w-12 bg-green-pt/40" />
          <p className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">
            {t('subtitle')}
          </p>
          <span className="h-px w-12 bg-green-pt/40" />
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-text-primary uppercase tracking-wide mb-3">
          {t('heading')}
        </h1>
        <p className="text-text-muted text-sm">
          {t('count')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-center gap-2 mb-8"
      >
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as typeof filter)}
            aria-pressed={filter === f.key}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
              filter === f.key
                ? 'bg-green-pt text-bg-primary shadow-[0_0_20px_rgba(94,166,59,0.4)]'
                : 'border border-white/15 text-text-muted hover:border-green-pt/40 hover:text-green-pt'
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      <div className="flex flex-col gap-3">
        {filtered.map((day, di) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: di * 0.04 }}
            className="rounded-2xl border border-white/10 bg-bg-surface/60 backdrop-blur-sm overflow-hidden hover:border-green-pt/20 transition-colors duration-300 group"
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 bg-white/3">
              <span className="font-display text-green-pt font-black text-lg">{day.displayDate}</span>
              <span className="h-3 w-px bg-white/20" />
              <span className="text-text-muted/60 text-xs uppercase tracking-widest">{phaseLabel(day.date, locale === 'pt' ? 'pt' : 'en')}</span>
            </div>

            <div className="divide-y divide-white/5">
              {day.matches.map((m, i) => (
                <div key={i} className="flex items-center px-5 py-3.5 gap-4 hover:bg-white/3 transition-colors">
                  <span className="text-green-pt font-mono text-xs font-bold w-12 shrink-0 tabular-nums">{m.time}</span>
                  {m.home === 'TBA' ? (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                        <span className="text-text-muted/40 text-xs italic tracking-widest uppercase">{t('tba')}</span>
                      </div>
                      <span className="text-text-muted/40 text-xs font-bold shrink-0 w-6 text-center">vs</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-text-muted/40 text-xs italic tracking-widest uppercase">{t('tba')}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                        <span className="text-text-primary text-sm font-semibold truncate">{m.home}</span>
                        <Flag team={m.home} />
                      </div>
                      <span className="text-text-muted/40 text-xs font-bold shrink-0 w-6 text-center">vs</span>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Flag team={m.away} />
                        <span className="text-text-primary text-sm font-semibold truncate">{m.away}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-10"
      >
        <Link href={`/${locale}`} className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-green-pt transition-colors">
          ← {t('back')}
        </Link>
      </motion.div>
    </div>
  )
}
