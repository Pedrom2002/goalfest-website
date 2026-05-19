'use client'

import { useMemo } from 'react'

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const BEAMS = [
  { x: '8%',  rotate: -35, color: 'rgba(34,197,94,0.55)',  duration: '7s',  delay: '-2.1s' },
  { x: '22%', rotate: -15, color: 'rgba(255,215,0,0.40)',  duration: '9s',  delay: '-4.2s' },
  { x: '40%', rotate: -5,  color: 'rgba(34,197,94,0.50)',  duration: '8s',  delay: '-1.3s' },
  { x: '58%', rotate: 5,   color: 'rgba(255,215,0,0.45)',  duration: '10s', delay: '-5.8s' },
  { x: '75%', rotate: 18,  color: 'rgba(34,197,94,0.60)',  duration: '7.5s',delay: '-3.4s' },
  { x: '90%', rotate: 32,  color: 'rgba(255,215,0,0.42)',  duration: '11s', delay: '-7s'   },
]

export default function BackgroundFX() {
  const stars = useMemo(
    () =>
      Array.from({ length: 250 }, (_, i) => ({
        x: seededRandom(i * 11) * 100,
        y: seededRandom(i * 11 + 1) * 100,
        size: seededRandom(i * 11 + 2) * 1.8 + 0.6,
        duration: `${2 + seededRandom(i * 11 + 3) * 5}s`,
        delay: `${seededRandom(i * 11 + 4) * 6}s`,
        color: '#ffffff',
        opacity: 0.3 + seededRandom(i * 11 + 5) * 0.7,
      })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {stars.map((s, i) => (
        <div
          key={`s${i}`}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 1.5}px rgba(255,255,255,0.8)`,
            animation: `starTwinkle ${s.duration} ${s.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {BEAMS.map((b, i) => {
        const sweepDur = `${30 + (i % 3) * 5}s`
        // Negative delay so beams start mid-animation, avoiding initial snap
        const sweepDelay = `-${i * 2.1}s`
        const m = b.color.match(/rgba\((\d+),(\d+),(\d+)/)
        const rgb = m ? `${m[1]},${m[2]},${m[3]}` : '255,255,255'
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-5%',
              left: b.x,
              width: 10,
              height: '120vh',
              transformOrigin: 'bottom center',
              ['--beam-rot-min' as string]: `${b.rotate - 15}deg`,
              ['--beam-rot-max' as string]: `${b.rotate + 15}deg`,
              animation: `beamSweep ${sweepDur} ${sweepDelay} ease-in-out infinite`,
            }}
          >
            <div
              className="beam"
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: 'bottom center',
                background: `linear-gradient(to top, transparent 0%, ${b.color} 20%, ${b.color} 80%, transparent 100%)`,
                filter: 'blur(18px)',
                mixBlendMode: 'screen',
                animation: `beamPulse ${b.duration} ${b.delay} ease-in-out infinite`,
              }}
            />
            {/* Source light at base */}
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                width: 18,
                height: 18,
                transform: 'translateX(-50%)',
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(${rgb},0.9) 35%, rgba(${rgb},0.3) 65%, transparent 100%)`,
                filter: 'blur(1.5px)',
                mixBlendMode: 'screen',
                boxShadow: `0 0 24px rgba(${rgb},0.6)`,
              }}
            />
          </div>
        )
      })}

      {/* Bottom fog/haze */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 90% 35% at 50% 100%, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.03) 50%, transparent 75%)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
