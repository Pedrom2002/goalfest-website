'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/teste_pedro.glb')
  return <primitive object={scene} scale={1} position={[0, -1, 0]} />
}

export default function VenueModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [-100, 30, -60], fov: 50 }}
        gl={{ antialias: true }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
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
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  )
}
