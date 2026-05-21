'use client'

import { MotionConfig } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState<'user' | 'always'>('user')

  useEffect(() => {
    if (document.documentElement.getAttribute('data-perf') === 'low') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReducedMotion('always')
    }
  }, [])

  return <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
}
