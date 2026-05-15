'use client'

import { useMemo } from 'react'

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const BEAMS = [
  { x: '10%', rotate: -30, color: 'rgba(94,166,59,0.18)',  duration: '9s',  delay: '0s'  },
  { x: '35%', rotate: -10, color: 'rgba(255,215,0,0.12)',  duration: '11s', delay: '2s'  },
  { x: '65%', rotate: 10,  color: 'rgba(94,166,59,0.15)',  duration: '10s', delay: '1s'  },
  { x: '88%', rotate: 30,  color: 'rgba(255,215,0,0.12)',  duration: '12s', delay: '3s'  },
]

export default function BackgroundFX() {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        x: seededRandom(i * 7) * 100,
        y: seededRandom(i * 7 + 1) * 100,
        size: seededRandom(i * 7 + 2) * 3 + 0.8,
        duration: `${5 + seededRandom(i * 7 + 3) * 8}s`,
        delay: `${seededRandom(i * 7 + 4) * 6}s`,
        color: i % 3 === 0 ? '#FFD700' : i % 3 === 1 ? '#5ea63b' : '#ffffff',
        opacity: 0.25 + seededRandom(i * 7 + 5) * 0.35,
      })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {BEAMS.map((b, i) => (
        <div
          key={i}
          className="beam"
          style={{
            position: 'absolute',
            top: '-5%',
            left: b.x,
            width: 4,
            height: '115vh',
            rotate: `${b.rotate}deg`,
            transformOrigin: 'top center',
            background: `linear-gradient(to bottom, transparent 0%, ${b.color} 25%, ${b.color} 75%, transparent 100%)`,
            filter: 'blur(16px)',
            animation: `beamPulse ${b.duration} ${b.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
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
            animation: `particleFloat ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}
