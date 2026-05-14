'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { useInView } from 'framer-motion'

function Model() {
  const { scene } = useGLTF('/venue_compressed.glb')
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />
}

function Fallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-bg-surface/50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-green-pt/40 border-t-green-pt rounded-full animate-spin" />
        <p className="text-text-muted text-xs uppercase tracking-widest">A carregar modelo 3D...</p>
      </div>
    </div>
  )
}

export default function VenueModel() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '0px 0px -100px 0px' })

  return (
    <div ref={ref} className="w-full h-full">
      <Canvas
        camera={{ position: [-100, 30, -60], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        frameloop={inView ? 'always' : 'never'}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="night" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate={inView}
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  )
}
