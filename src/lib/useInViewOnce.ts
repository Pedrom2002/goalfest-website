'use client'

import { useEffect, useRef, useState } from 'react'

export function useInViewOnce<T extends HTMLElement>(rootMargin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { setSeen(true); obs.disconnect() }
    }, { rootMargin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin])
  return { ref, seen }
}
