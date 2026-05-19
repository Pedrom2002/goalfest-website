'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Status = 'loading' | 'success' | 'error'

export default function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [status, setStatus] = useState<Status>(() => email ? 'loading' : 'error')
  const [message, setMessage] = useState(() => email ? '' : 'No email address provided.')

  useEffect(() => {
    if (!email) return

    fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success')
          setMessage(`${email} has been removed from the list.`)
        } else {
          setStatus('error')
          setMessage(data.error ?? 'Something went wrong.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error. Please try again.')
      })
  }, [email])

  return (
    <div className="max-w-sm w-full text-center">
      {status === 'loading' && (
        <p className="text-[#9ca3af] text-sm">Processing…</p>
      )}

      {status === 'success' && (
        <>
          <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#FFD700]/30">
            <svg className="w-5 h-5 text-[#FFD700]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#f5f5f5] mb-3">Unsubscribed</h1>
          <p className="text-[#9ca3af] text-sm mb-8">{message}</p>
          <Link
            href="/"
            className="text-xs text-[#555] hover:text-[#9ca3af] transition-colors underline underline-offset-2"
          >
            Back to homepage
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-[#f5f5f5] mb-3">Oops</h1>
          <p className="text-red-400 text-sm mb-8">{message}</p>
          <Link
            href="/"
            className="text-xs text-[#555] hover:text-[#9ca3af] transition-colors underline underline-offset-2"
          >
            Back to homepage
          </Link>
        </>
      )}
    </div>
  )
}
