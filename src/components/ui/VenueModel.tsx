'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { useInView } from 'framer-motion'
import { getEnv } from '@/lib/env'

const { NEXT_PUBLIC_MODEL_VENUE, NEXT_PUBLIC_ENV_VENUE } = getEnv()

function Model({ onLoad }: { onLoad: () => void }) {
  const { scene } = useGLTF(NEXT_PUBLIC_MODEL_VENUE)
  useEffect(() => { onLoad() }, [onLoad])
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />
}

export default function VenueModel({ loadingText = 'A carregar modelo' }: { loadingText?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '0px 0px -100px 0px' })
  const [loaded, setLoaded] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div ref={ref} className="w-full h-full relative">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" role="status" aria-label={loadingText}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-green-pt border-t-transparent animate-spin" aria-hidden="true" />
            <span className="text-text-muted text-xs uppercase tracking-widest">{loadingText}</span>
          </div>
        </div>
      )}
      <Canvas
        camera={{ position: [-100, 30, -60], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        frameloop={inView ? 'always' : 'never'}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model onLoad={() => setLoaded(true)} />
          <Environment files={NEXT_PUBLIC_ENV_VENUE} />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate={inView && !reducedMotion}
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  )
}
