'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
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
  const inputRef = useRef<HTMLInputElement>(null)

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
        if (inputRef.current) inputRef.current.value = ''
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Erro. Tenta novamente.')
      }
    } catch {
      setStatus('error')
      setMessage('Erro de rede. Tenta novamente.')
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
          <span className="h-px w-12 bg-green-pt/40" />
          <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">
            {t.title}
          </h2>
          <span className="h-px w-12 bg-green-pt/40" />
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
              className="flex-1 px-4 py-3 rounded-lg bg-bg-surface border border-green-pt/20 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-green-pt transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-6 py-3 rounded-lg bg-green-pt text-white text-sm font-semibold tracking-wide hover:bg-green-pt/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default whitespace-nowrap"
            >
              {status === 'loading' ? t.loading : status === 'success' ? t.done : t.cta}
            </button>
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className={`mt-4 text-sm ${status === 'success' ? 'text-green-pt' : 'text-red-400'}`}
            >
              {message}
            </p>
          )}
        </motion.form>

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
