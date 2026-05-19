'use client'

import { useState, useRef } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function SignupForm() {
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
        setMessage('You\'re subscribed. Check your inbox for a confirmation.')
        if (inputRef.current) inputRef.current.value = ''
      } else {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          ref={inputRef}
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 px-4 py-3 rounded-lg bg-[#161616] border border-[#2a2a2a] text-[#f5f5f5] placeholder-[#555] text-sm focus:outline-none focus:border-[#FFD700] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-6 py-3 rounded-lg bg-[#FFD700] text-[#0d0d0d] text-sm font-semibold tracking-wide hover:bg-[#e6c200] transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-4 text-sm text-center ${status === 'success' ? 'text-[#FFD700]' : 'text-red-400'}`}
        >
          {message}
        </p>
      )}
    </form>
  )
}
