'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const BackgroundFX = dynamic(() => import('./BackgroundFX'), { ssr: false })

export default function BackgroundFXClient() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    if (idle) {
      const id = idle(() => setReady(true))
      return () => {
        const cancel = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
        if (cancel) cancel(id as number)
      }
    }
    const t = setTimeout(() => setReady(true), 200)
    return () => clearTimeout(t)
  }, [])

  if (!ready) return null
  return <BackgroundFX />
}
