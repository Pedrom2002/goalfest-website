'use client'

import { useEffect } from 'react'
import { usePathname } from '@/i18n/navigation'

export default function HashScroller() {
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const id = hash.slice(1)
    const el = document.getElementById(id)
    if (!el) return
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [pathname])

  return null
}
