'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 0.8,
  duration: 5 + Math.random() * 8,
  delay: Math.random() * 6,
  color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#5ea63b' : '#ffffff',
  opacity: 0.25 + Math.random() * 0.35,
}))

const BEAMS = [
  { x: '10%', rotate: -30, color: 'rgba(94,166,59,0.18)', duration: 9,  delay: 0 },
  { x: '35%', rotate: -10, color: 'rgba(255,215,0,0.12)',  duration: 11, delay: 2 },
  { x: '65%', rotate: 10,  color: 'rgba(94,166,59,0.15)',  duration: 10, delay: 1 },
  { x: '88%', rotate: 30,  color: 'rgba(255,215,0,0.12)',  duration: 12, delay: 3 },
]

export default function BackgroundFX() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {BEAMS.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: '-5%',
            left: b.x,
            width: 4,
            height: '115vh',
            rotate: b.rotate,
            transformOrigin: 'top center',
            background: `linear-gradient(to bottom, transparent 0%, ${b.color} 25%, ${b.color} 75%, transparent 100%)`,
            filter: 'blur(16px)',
          }}
          animate={{ opacity: [0.3, 0.9, 0.3], scaleX: [1, 2, 1] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            willChange: 'transform',
            animation: `particleFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
