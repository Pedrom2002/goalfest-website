'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import {
  DoorOpen,
  DoorClosed,
  Music2,
  Mic2,
  Trophy,
  Star,
} from 'lucide-react'
import type { ProgramaDay, ProgramaEventType } from '@/data/programa'
import HeadlinerCarousel from '@/components/sections/HeadlinerCarousel'

const EVENT_CONFIG: Record<
  ProgramaEventType,
  { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; color: string; bg: string }
> = {
  abertura:     { icon: DoorOpen,   color: '#43B02A', bg: 'bg-[#43B02A]/15' },
  encerramento: { icon: DoorClosed, color: '#43B02A', bg: 'bg-[#43B02A]/15' },
  dj:           { icon: Music2,     color: '#8B5CF6', bg: 'bg-[#8B5CF6]/15' },
  concerto:     { icon: Mic2,       color: '#C8102E', bg: 'bg-[#C8102E]/15' },
  jogo:         { icon: Trophy,     color: '#3B82F6', bg: 'bg-[#3B82F6]/15' },
  atividade:    { icon: Star,       color: '#F97316', bg: 'bg-[#F97316]/15' },
}

export default function Programa({ days }: { days: ProgramaDay[] }) {
  const t = useTranslations('programa')
  const locale = useLocale()
  const [activeIdx, setActiveIdx] = useState(0)
  const activeDay = days[activeIdx]

  if (!activeDay) return null

  return (
    <section id="programa" className="py-20 px-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 justify-center mb-4">
        <span className="h-px w-12 bg-[#43B02A]/40" />
        <p className="text-[#43B02A] text-xs uppercase tracking-[0.3em] font-medium">
          {t('subtitle')}
        </p>
        <span className="h-px w-12 bg-[#43B02A]/40" />
      </div>
      <h2 className="font-display text-4xl sm:text-5xl font-black text-text-primary uppercase tracking-wide text-center mb-12">
        {t('heading')}
      </h2>

      {/* Headliners */}
      <div className="relative mb-10">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <Star size={12} className="text-[#43B02A]" />
          <p className="text-text-muted text-xs uppercase tracking-[0.25em] font-medium">
            {t('headliners_label')}
          </p>
        </div>
        <HeadlinerCarousel />
      </div>

      {/* Tabs */}
      <div
        className="flex gap-2.5 mb-10 overflow-x-auto no-scrollbar pt-2 pb-2 px-4 -mx-4 justify-start sm:justify-center sm:px-1 sm:mx-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {days.map((day, i) => (
          <button
            key={day.date}
            onClick={() => setActiveIdx(i)}
            className={`relative flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
              i === activeIdx
                ? 'border-[#43B02A] text-[#43B02A] bg-[#43B02A]/10 shadow-[0_0_20px_rgba(67,176,42,0.3)]'
                : 'border-white/10 text-text-muted hover:border-white/25 hover:text-text-primary hover:bg-white/5'
            }`}
          >
            {i === activeIdx && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#43B02A] animate-pulse" />
            )}
            {day.displayDate}
            <span className="ml-1.5 text-xs font-normal opacity-70">
              {locale === 'pt' ? day.dayLabel.pt : day.dayLabel.en}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay.date}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          {/* Vertical line */}
          <div
            className="absolute left-[2.35rem] top-3 bottom-3 w-px"
            style={{ background: 'linear-gradient(to bottom, rgba(67,176,42,0.5), rgba(255,255,255,0.08) 50%, rgba(67,176,42,0.5))' }}
          />

          <div className="flex flex-col gap-2">
            {activeDay.events.map((event, i) => {
              const cfg = EVENT_CONFIG[event.type]
              const Icon = cfg.icon

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                  className="flex items-start gap-4"
                >
                  {/* Time */}
                  <span className="w-12 text-right text-xs font-mono font-bold text-text-muted tabular-nums pt-2.5 flex-shrink-0">
                    {event.time}
                  </span>

                  {/* Dot */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-2">
                    <div
                      className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                      style={{ borderColor: cfg.color, backgroundColor: `${cfg.color}33`, boxShadow: `0 0 10px ${cfg.color}88` }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 mb-1 flex-1 border border-transparent transition-all duration-200 hover:scale-[1.015] ${cfg.bg}`}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${cfg.color}55` }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent' }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cfg.color}22` }}
                    >
                      <Icon size={14} style={{ color: cfg.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text-primary leading-tight">
                        {event.title}
                      </p>
                      {event.detail && (
                        <p className="text-xs text-text-muted mt-0.5 truncate">
                          {event.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
