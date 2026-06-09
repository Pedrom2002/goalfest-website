'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import type { Concert } from '@/data/concerts'
import ArtistCard from '@/components/ui/ArtistCard'

export default function ConcertosSchedule({ concerts }: { concerts: Concert[] }) {
  const t = useTranslations('concertos')
  const locale = useLocale()

  // Agrupa os concertos por dia, mantendo a ordem do array
  const days = concerts.reduce<{ date: string; displayDate: string; items: Concert[] }[]>((acc, c) => {
    const day = acc.find(d => d.date === c.date)
    if (day) day.items.push(c)
    else acc.push({ date: c.date, displayDate: c.displayDate, items: [c] })
    return acc
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="flex items-center gap-3 justify-center mb-4">
          <span className="h-px w-12 bg-[#43B02A]/40" />
          <p className="text-[#43B02A] text-xs uppercase tracking-[0.3em] font-medium">
            {t('subtitle')}
          </p>
          <span className="h-px w-12 bg-[#43B02A]/40" />
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-text-primary uppercase tracking-wide mb-3">
          {t('heading')}
        </h1>
        <p className="text-text-muted text-sm">
          {t('count')}
        </p>
      </motion.div>

      {days.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-bg-surface/60 backdrop-blur-sm px-6 py-16 text-center"
        >
          <p className="font-display text-2xl font-black text-text-primary uppercase tracking-wide mb-2">
            {t('empty_title')}
          </p>
          <p className="text-text-muted text-sm">
            {t('empty_body')}
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          {days.map((day, di) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: di * 0.04 }}
              className="rounded-2xl border border-white/10 bg-bg-surface/60 backdrop-blur-sm overflow-hidden hover:border-[#C8102E]/20 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/8 bg-white/3">
                <span className="font-display text-[#43B02A] font-black text-lg">{day.displayDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
                {day.items.map((c, i) => (
                  <ArtistCard key={i} concert={c} dateStr={day.displayDate} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
