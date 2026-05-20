'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function UnsubscribePage() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(
    email ? 'loading' : 'idle',
  )

  useEffect(() => {
    if (!email) return
    let cancelled = false
    fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((r) => {
        if (cancelled) return
        setStatus(r.ok ? 'done' : 'error')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [email])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#06182A] text-[#F4EBD6] px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-black mb-4">Newsletter QUIC</h1>
        {!email && <p>Link inválido.</p>}
        {status === 'loading' && <p>A cancelar subscrição…</p>}
        {status === 'done' && (
          <>
            <p className="mb-2">Subscrição cancelada.</p>
            <p className="text-sm opacity-70">
              {email} já não vai receber emails.
            </p>
          </>
        )}
        {status === 'error' && <p>Erro a processar. Tenta novamente.</p>}
      </div>
    </main>
  )
}
