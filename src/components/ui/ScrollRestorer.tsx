'use client'

import { useEffect } from 'react'

export default function ScrollRestorer() {
  useEffect(() => {
    const saved = sessionStorage.getItem('locale-switch-scroll')
    if (saved !== null) {
      sessionStorage.removeItem('locale-switch-scroll')
      window.scrollTo({ top: Number(saved), behavior: 'instant' })
    }
  }, [])

  return null
}
