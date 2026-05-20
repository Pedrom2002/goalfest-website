'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from 'next-intl'

type Status = 'idle' | 'loading' | 'success' | 'error'

const copy = {
  pt: {
    label: 'Newsletter',
    title: 'Fica a par de tudo',
    sub: 'Novidades, datas e surpresas — direto na tua caixa de entrada. Sem spam.',
    placeholder: 'o-teu@email.com',
    cta: 'Subscrever',
    loading: 'A enviar…',
    done: 'Subscrito',
    success: 'Estás dentro! Confirma o teu email na caixa de entrada.',
    privacy: 'Respeitamos a tua privacidade. Cancela quando quiseres.',
  },
  en: {
    label: 'Newsletter',
    title: 'Stay in the loop',
    sub: 'News, dates and surprises — straight to your inbox. No spam.',
    placeholder: 'your@email.com',
    cta: 'Subscribe',
    loading: 'Sending…',
    done: 'Subscribed',
    success: 'You\'re in! Check your inbox for a confirmation.',
    privacy: 'We respect your privacy. Unsubscribe any time.',
  },
}

export default function NewsletterSection() {
  const locale = useLocale()
  const t = locale === 'pt' ? copy.pt : copy.en
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!toastOpen) return
    const t = setTimeout(() => setToastOpen(false), 5000)
    return () => clearTimeout(t)
  }, [toastOpen])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = inputRef.current?.value.trim()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(t.success)
        setToastOpen(true)
        if (inputRef.current) inputRef.current.value = ''
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Erro. Tenta novamente.')
        setToastOpen(true)
      }
    } catch {
      setStatus('error')
      setMessage('Erro de rede. Tenta novamente.')
      setToastOpen(true)
    }
  }

  return (
    <section id="newsletter" className="relative py-12 md:py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 justify-center mb-6"
        >
          <span className="h-px w-12 bg-[#43B02A]/40" />
          <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">
            {t.title}
          </h2>
          <span className="h-px w-12 bg-[#43B02A]/40" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-text-muted text-base md:text-lg mb-8"
        >
          {t.sub}
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              ref={inputRef}
              type="email"
              name="email"
              placeholder={t.placeholder}
              required
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-4 py-3 rounded-lg bg-bg-surface border border-[#0033A0]/30 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-[#0033A0] transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-6 py-3 rounded-lg bg-[#0033A0] text-white text-sm font-semibold tracking-wide hover:bg-[#0033A0]/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default whitespace-nowrap"
            >
              {status === 'loading' ? t.loading : status === 'success' ? t.done : t.cta}
            </button>
          </div>

        </motion.form>

        <AnimatePresence>
          {toastOpen && (
            <motion.div
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-md max-w-[90vw] ${
                status === 'success'
                  ? 'bg-[#43B02A]/15 border-[#43B02A]/60 text-white'
                  : 'bg-[#C8102E]/15 border-[#C8102E]/60 text-white'
              }`}
              style={{ boxShadow: status === 'success' ? '0 8px 32px rgba(67,176,42,0.35)' : '0 8px 32px rgba(200,16,46,0.35)' }}
            >
              <span
                className="flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold"
                style={{ background: status === 'success' ? '#43B02A' : '#C8102E', color: 'white' }}
                aria-hidden
              >
                {status === 'success' ? '✓' : '!'}
              </span>
              <p className="text-sm flex-1">{message}</p>
              <button
                type="button"
                onClick={() => setToastOpen(false)}
                aria-label={locale === 'pt' ? 'Fechar' : 'Close'}
                className="text-white/60 hover:text-white text-lg leading-none"
              >×</button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-xs text-text-muted/50"
        >
          {t.privacy}
        </motion.p>
      </div>
    </section>
  )
}
