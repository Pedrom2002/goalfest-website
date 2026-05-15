'use client'

import dynamic from 'next/dynamic'

const BackgroundFX = dynamic(() => import('./BackgroundFX'), { ssr: false })

export default function BackgroundFXClient() {
  return <BackgroundFX />
}
