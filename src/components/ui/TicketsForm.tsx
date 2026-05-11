'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import type { Match } from '@/types'
import { formatMatchDate } from '@/lib/utils'

export default function TicketsForm({ matches }: { matches: Match[] }) {
  const t = useTranslations('bilhetes')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])

  const toggleMatch = (id: string) => {
    setSelectedMatches((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)
    data.set('matches', selectedMatches.join(', '))

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID
    if (!formspreeId) {
      // No Formspree ID configured — simulate success for dev
      setTimeout(() => setStatus('success'), 1000)
      return
    }

    const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    })

    setStatus(res.ok ? 'success' : 'error')
  }

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 flex flex-col items-center gap-4"
          >
            <div className="text-6xl">✅</div>
            <h2 className="font-display text-3xl text-gold font-black uppercase">{t('success_title')}</h2>
            <p className="text-text-muted">{t('success_msg')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('name_label')}</label>
              <input
                name="name"
                required
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('email_label')}</label>
              <input
                name="email"
                type="email"
                required
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('quantity_label')}</label>
              <select
                name="quantity"
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('matches_label')}</label>
              <div className="flex flex-col gap-2">
                {matches.map((match) => {
                  const label = `${match.home.flag} ${locale === 'pt' ? match.home.name : match.home.nameEn} vs ${match.away.flag} ${locale === 'pt' ? match.away.name : match.away.nameEn} — ${formatMatchDate(match.date, locale)}`
                  return (
                    <label key={match.id} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedMatches.includes(match.id)}
                        onChange={() => toggleMatch(match.id)}
                        className="mt-1 accent-gold"
                      />
                      <span className="text-text-muted text-sm group-hover:text-text-primary transition-colors">{label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-muted text-xs uppercase tracking-widest">{t('message_label')}</label>
              <textarea
                name="message"
                rows={3}
                className="bg-bg-surface border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-red-pt hover:bg-red-pt/80 disabled:opacity-50 text-white font-bold py-3 rounded-lg uppercase tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('submitting')}
                </>
              ) : t('submit')}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
