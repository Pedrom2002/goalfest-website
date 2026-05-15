'use client'

import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { useInView } from 'framer-motion'

function Model() {
  const { scene } = useGLTF('https://phwtscjrqihtamdy.public.blob.vercel-storage.com/venue_compressed-9HTTABhm50vbgKbJVaEvcchAdzZYd3.glb')
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />
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
          <Environment files="https://phwtscjrqihtamdy.public.blob.vercel-storage.com/dikhololo_night_1k-vGG7SXP7RXLTzq0N3QZhB7bbKouvol.hdr" />
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
