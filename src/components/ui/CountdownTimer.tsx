'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { calcTimeLeft, type TimeLeft } from '@/lib/countdown'

function FlipUnit({ value, label, animate: doAnimate }: { value: number; label: string; animate?: boolean }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-20 md:w-24 md:h-28">
        {doAnimate ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={display}
              initial={{ rotateX: -70, opacity: 0, scale: 0.95 }}
              animate={{ rotateX: 0, opacity: 1, scale: 1 }}
              exit={{ rotateX: 70, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg font-display text-3xl md:text-5xl font-bold text-green-pt"
            >
              {display}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg font-display text-3xl md:text-5xl font-bold text-green-pt tabular-nums">
            {display}
          </div>
        )}
      </div>
      <span className="text-text-muted text-xs uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function CountdownTimer() {
  const t = useTranslations('hero')
  const [time, setTime] = useState<TimeLeft | 'started' | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(calcTimeLeft())
    const id = setInterval(() => setTime(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!time) return (
    <div className="flex items-center gap-4 md:gap-6">
      {['--', '--', '--', '--'].map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-16 h-20 md:w-24 md:h-28 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg font-display text-3xl md:text-5xl font-bold text-green-pt">{v}</div>
        </div>
      ))}
    </div>
  )

  if (time === 'started') return (
    <div className="flex items-center justify-center px-6 py-3 bg-green-pt/10 border border-green-pt/40 rounded-full">
      <span className="w-2 h-2 rounded-full bg-green-pt animate-pulse mr-3" />
      <span className="text-green-pt font-bold uppercase tracking-widest text-sm">{t('countdown_live')}</span>
    </div>
  )

  return (
    <div
      className="flex items-center gap-4 md:gap-6"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Contagem decrescente para o evento"
    >
      <FlipUnit value={time.days} label={t('countdown_days')} animate={false} />
      <span className="text-green-pt text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.hours} label={t('countdown_hours')} animate={false} />
      <span className="text-green-pt text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.minutes} label={t('countdown_minutes')} animate />
      <span className="text-green-pt text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.seconds} label={t('countdown_seconds')} animate />
    </div>
  )
}
