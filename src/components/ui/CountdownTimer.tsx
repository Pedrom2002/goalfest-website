'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

const TARGET = new Date('2026-06-11T15:00:00Z')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET.getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-20 md:w-24 md:h-28">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={display}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-bg-surface border border-gold/20 rounded-lg font-display text-3xl md:text-5xl font-bold text-gold"
          >
            {display}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-text-muted text-xs uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function CountdownTimer() {
  const t = useTranslations('hero')
  const [time, setTime] = useState<TimeLeft>(calcTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <FlipUnit value={time.days} label={t('countdown_days')} />
      <span className="text-gold text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.hours} label={t('countdown_hours')} />
      <span className="text-gold text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.minutes} label={t('countdown_minutes')} />
      <span className="text-gold text-3xl font-bold mb-4">:</span>
      <FlipUnit value={time.seconds} label={t('countdown_seconds')} />
    </div>
  )
}
