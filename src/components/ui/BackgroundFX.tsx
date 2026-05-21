'use client'

import { useEffect, useMemo, useState } from 'react'

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

const BEAMS = [
  { x: '6%',  rotate: -38, duration: '8s',   delay: '-2.1s' },
  { x: '22%', rotate: -18, duration: '11s',  delay: '-4.2s' },
  { x: '40%', rotate: -6,  duration: '9s',   delay: '-1.3s' },
  { x: '58%', rotate: 6,   duration: '12s',  delay: '-5.8s' },
  { x: '75%', rotate: 20,  duration: '8.5s', delay: '-3.4s' },
  { x: '92%', rotate: 36,  duration: '13s',  delay: '-7s'   },
]

export default function BackgroundFX() {
  const [isLowPerf, setIsLowPerf] = useState(false)
  useEffect(() => {
    setIsLowPerf(document.documentElement.getAttribute('data-perf') === 'low')
  }, [])

  const stars = useMemo(
    () =>
      Array.from({ length: isLowPerf ? 40 : 180 }, (_, i) => ({
        x: seededRandom(i * 11) * 100,
        y: seededRandom(i * 11 + 1) * 75,
        size: seededRandom(i * 11 + 2) * 2.0 + 0.7,
        duration: `${2 + seededRandom(i * 11 + 3) * 5}s`,
        delay: `-${seededRandom(i * 11 + 4) * 6}s`,
        opacity: 0.35 + seededRandom(i * 11 + 5) * 0.65,
      })),
    [isLowPerf]
  )

  // Modo low-perf: só base gradient + estrelas reduzidas, sem blurs/fog/grain/vignette/holofotes
  if (isLowPerf) {
    return (
      <div data-bgfx className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
        <style>{`
          @keyframes starTwinkle {
            0%, 100% { opacity: var(--op-start); }
            50%       { opacity: var(--op-mid); }
          }
        `}</style>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, #0a1525 0%, #0a1220 60%, #050a14 100%)',
        }} />
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
              background: '#ffffff',
              ['--op-start' as string]: s.opacity,
              ['--op-mid' as string]: Math.min(s.opacity * 1.8, 1),
              animation: `starTwinkle ${s.duration} ${s.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div data-bgfx className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [data-bgfx] * { animation: none !important; }
        }
        @keyframes beamSweep {
          0%   { transform: rotate(var(--beam-rot-min)); }
          50%  { transform: rotate(var(--beam-rot-max)); }
          100% { transform: rotate(var(--beam-rot-min)); }
        }
        @keyframes beamPulse {
          0%, 100% { opacity: 0.55; }
          50%       { opacity: 1.0; }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--op-start); transform: scale(1); }
          50%       { opacity: var(--op-mid);   transform: scale(1.4); }
        }
        @keyframes fogDrift {
          0%   { transform: translateX(-8%); opacity: 0.55; }
          50%  { transform: translateX(8%);  opacity: 0.85; }
          100% { transform: translateX(-8%); opacity: 0.55; }
        }
        @keyframes fogDriftAlt {
          0%   { transform: translateX(6%);  opacity: 0.45; }
          50%  { transform: translateX(-6%); opacity: 0.7;  }
          100% { transform: translateX(6%);  opacity: 0.45; }
        }
        @keyframes hazeShift {
          0%, 100% { transform: translateX(0px) scale(1); }
          50%       { transform: translateX(40px) scale(1.05); }
        }
      `}</style>

      {/* Base — tom azul-noite */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #0a1525 0%, #0a1220 60%, #050a14 100%)',
        pointerEvents: 'none',
      }} />

      {/* Profundidade vertical base */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 110% 70% at 50% 100%, rgba(10,30,20,0.65) 0%, rgba(8,15,25,0.3) 45%, transparent 80%)',
        pointerEvents: 'none',
      }} />

      {/* Glow tricolor difuso */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 15% 80%, rgba(0,51,160,0.10) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 85% 80%, rgba(200,16,46,0.08) 0%, transparent 60%), radial-gradient(ellipse 90% 55% at 50% 100%, rgba(67,176,42,0.12) 0%, transparent 65%)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        animation: 'hazeShift 24s ease-in-out infinite',
      }} />

{/* Estrelas (só metade superior) */}
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
            background: '#ffffff',
            boxShadow: `0 0 ${s.size * 1.8}px rgba(255,255,255,0.85)`,
            ['--op-start' as string]: s.opacity,
            ['--op-mid' as string]: Math.min(s.opacity * 1.8, 1),
            animation: `starTwinkle ${s.duration} ${s.delay} ease-in-out infinite`,
          }}
        />
      ))}

      {/* Holofotes verdes */}
      {BEAMS.map((b, i) => {
        const sweepDur = `${30 + (i % 3) * 5}s`
        const sweepDelay = `-${i * 2.1}s`
        return (
          <div
            key={`beam-${i}`}
            className="beam"
            style={{
              position: 'absolute',
              bottom: '-5%',
              left: b.x,
              width: 10,
              height: '120vh',
              transformOrigin: 'bottom center',
              ['--beam-rot-min' as string]: `${b.rotate - 18}deg`,
              ['--beam-rot-max' as string]: `${b.rotate + 18}deg`,
              animation: `beamSweep ${sweepDur} ${sweepDelay} ease-in-out infinite`,
            }}
          >
            {/* Cone exterior (haze volumétrico) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'bottom center',
              background: 'linear-gradient(to top, transparent 0%, rgba(67,176,42,0.30) 25%, rgba(67,176,42,0.18) 60%, transparent 100%)',
              filter: 'blur(16px)',
              mixBlendMode: 'screen',
            }} />
            {/* Cone interior (luz focada) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'bottom center',
              background: 'linear-gradient(to top, transparent 0%, rgba(67,176,42,0.65) 18%, rgba(67,176,42,0.6) 78%, transparent 100%)',
              filter: 'blur(14px)',
              mixBlendMode: 'screen',
              animation: `beamPulse ${b.duration} ${b.delay} ease-in-out infinite`,
            }} />
            {/* Fonte de luz na base */}
            <div style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              width: 22,
              height: 22,
              transform: 'translateX(-50%)',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(67,176,42,0.95) 30%, rgba(67,176,42,0.35) 65%, transparent 100%)',
              filter: 'blur(1.5px)',
              mixBlendMode: 'screen',
              boxShadow: '0 0 32px rgba(67,176,42,0.7)',
            }} />
          </div>
        )
      })}

      {/* Névoa baixa — camada 1 (verde subtil) */}
      <div style={{
        position: 'absolute',
        left: '-15%',
        right: '-15%',
        bottom: 0,
        height: '40vh',
        background: 'radial-gradient(ellipse 60% 100% at 30% 100%, rgba(67,176,42,0.18) 0%, transparent 70%), radial-gradient(ellipse 70% 100% at 70% 100%, rgba(67,176,42,0.14) 0%, transparent 70%)',
        filter: 'blur(14px)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        animation: 'fogDrift 22s ease-in-out infinite',
      }} />

      {/* Névoa baixa — camada 2 (azul subtil) */}
      <div style={{
        position: 'absolute',
        left: '-15%',
        right: '-15%',
        bottom: 0,
        height: '32vh',
        background: 'radial-gradient(ellipse 55% 100% at 50% 100%, rgba(0,51,160,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 100% at 85% 100%, rgba(200,16,46,0.08) 0%, transparent 75%)',
        filter: 'blur(16px)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        animation: 'fogDriftAlt 28s ease-in-out infinite',
      }} />

      {/* Grain/noise texture — coesão cinematográfica */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        mixBlendMode: 'overlay',
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
        backgroundSize: '200px 200px',
        pointerEvents: 'none',
      }} />

      {/* Vignette nos cantos */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
