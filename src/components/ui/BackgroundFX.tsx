'use client'

import { useMemo, useEffect, useRef } from 'react'

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

// Pre-rendered star template: white radial gradient simulating box-shadow glow.
// Created once and stamped per-star via drawImage — avoids per-draw shadowBlur cost.
const TEMPLATE_SIZE = 24

function createStarTemplate(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = TEMPLATE_SIZE
  canvas.height = TEMPLATE_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  const cx = TEMPLATE_SIZE / 2
  const gradient = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx)
  gradient.addColorStop(0,    'rgba(255,255,255,1)')
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.45, 'rgba(255,255,255,0.4)')
  gradient.addColorStop(0.75, 'rgba(255,255,255,0.12)')
  gradient.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, TEMPLATE_SIZE, TEMPLATE_SIZE)
  return canvas
}

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stars = useMemo(
    () =>
      Array.from({ length: 180 }, (_, i) => ({
        x:           seededRandom(i * 11)       * 100,
        y:           seededRandom(i * 11 + 1)   * 75,  // top 75% only
        size:        seededRandom(i * 11 + 2)   * 2.0 + 0.7,
        duration:    2 + seededRandom(i * 11 + 3) * 5,
        delay:       seededRandom(i * 11 + 4)   * 6,
        opacityBase: 0.35 + seededRandom(i * 11 + 5) * 0.65,
      })),
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return // jsdom / no-canvas environments exit gracefully

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const template = createStarTemplate()
    let rafId = 0
    let w = 0
    let h = 0

    function resize() {
      if (!canvas) return
      // Cap DPR at 2 — saves 50 % pixel fill on 3× screens with no visible difference for stars
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      canvas.style.width  = w + 'px'
      canvas.style.height = h + 'px'
      ctx.scale(dpr, dpr)
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#ffffff'
      for (const star of stars) {
        const phase   = ((t / 1000 + star.delay) % star.duration) / star.duration
        const twinkle = 0.5 + 0.5 * Math.sin(phase * Math.PI * 2)
        const opacity = reducedMotion
          ? star.opacityBase
          : star.opacityBase + (Math.min(star.opacityBase * 1.8, 1) - star.opacityBase) * twinkle
        const scale = reducedMotion ? 1 : 1 + 0.4 * twinkle

        // drawSize matches original CSS: star radius + glow (size * 1.8 blur)
        const drawSize = star.size * 4.6 * scale
        const x = (star.x / 100) * w
        const y = (star.y / 100) * h

        ctx.globalAlpha = opacity
        ctx.drawImage(template, x - drawSize / 2, y - drawSize / 2, drawSize, drawSize)
      }
      ctx.globalAlpha = 1
    }

    function animate(t: number) {
      draw(t)
      rafId = requestAnimationFrame(animate)
    }

    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(rafId)
      } else if (!reducedMotion) {
        rafId = requestAnimationFrame(animate)
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    if (reducedMotion) {
      draw(0)
    } else {
      rafId = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [stars])

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
        /* Mobile: hide 3 outer beams, halve blur costs on remaining beams and fog */
        @media (max-width: 768px) {
          [data-bgfx] .beam-secondary { display: none; }
          [data-bgfx] .beam-outer { filter: blur(20px) !important; }
          [data-bgfx] .beam-inner { filter: blur(8px) !important; }
          [data-bgfx] .fog-1 { filter: blur(12px) !important; }
          [data-bgfx] .fog-2 { filter: blur(16px) !important; }
        }
      `}</style>

      {/* Base — dark blue-night tone */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #0a1525 0%, #0a1220 60%, #050a14 100%)',
        pointerEvents: 'none',
      }} />

      {/* Vertical depth base */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 110% 70% at 50% 100%, rgba(10,30,20,0.65) 0%, rgba(8,15,25,0.3) 45%, transparent 80%)',
        pointerEvents: 'none',
      }} />

      {/* Diffuse tricolor glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 15% 80%, rgba(0,51,160,0.10) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 85% 80%, rgba(200,16,46,0.08) 0%, transparent 60%), radial-gradient(ellipse 90% 55% at 50% 100%, rgba(67,176,42,0.12) 0%, transparent 65%)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        animation: 'hazeShift 24s ease-in-out infinite',
      }} />

      {/* Stars — single canvas replaces 180 animated divs */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Green spotlights — all 6 kept in DOM (tests expect 6 .beam nodes).
          beam-secondary (.beam indices 3-5) hidden on mobile via CSS above. */}
      {BEAMS.map((b, i) => {
        const sweepDur   = `${30 + (i % 3) * 5}s`
        const sweepDelay = `-${i * 2.1}s`
        const secondary  = i >= 3
        return (
          <div
            key={`beam-${i}`}
            className={`beam${secondary ? ' beam-secondary' : ''}`}
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
            {/* Outer volumetric haze */}
            <div className="beam-outer" style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'bottom center',
              background: 'linear-gradient(to top, transparent 0%, rgba(67,176,42,0.30) 25%, rgba(67,176,42,0.18) 60%, transparent 100%)',
              filter: 'blur(38px)',
              mixBlendMode: 'screen',
            }} />
            {/* Inner focused beam */}
            <div className="beam-inner" style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'bottom center',
              background: 'linear-gradient(to top, transparent 0%, rgba(67,176,42,0.65) 18%, rgba(67,176,42,0.6) 78%, transparent 100%)',
              filter: 'blur(14px)',
              mixBlendMode: 'screen',
              animation: `beamPulse ${b.duration} ${b.delay} ease-in-out infinite`,
            }} />
            {/* Light source at base */}
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

      {/* Low ground fog — layer 1 (subtle green) */}
      <div className="fog-1" style={{
        position: 'absolute',
        left: '-15%',
        right: '-15%',
        bottom: 0,
        height: '40vh',
        background: 'radial-gradient(ellipse 60% 100% at 30% 100%, rgba(67,176,42,0.18) 0%, transparent 70%), radial-gradient(ellipse 70% 100% at 70% 100%, rgba(67,176,42,0.14) 0%, transparent 70%)',
        filter: 'blur(20px)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        animation: 'fogDrift 22s ease-in-out infinite',
      }} />

      {/* Low ground fog — layer 2 (subtle blue/red) */}
      <div className="fog-2" style={{
        position: 'absolute',
        left: '-15%',
        right: '-15%',
        bottom: 0,
        height: '32vh',
        background: 'radial-gradient(ellipse 55% 100% at 50% 100%, rgba(0,51,160,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 100% at 85% 100%, rgba(200,16,46,0.08) 0%, transparent 75%)',
        filter: 'blur(28px)',
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        animation: 'fogDriftAlt 28s ease-in-out infinite',
      }} />

      {/* Grain/noise — cinematic cohesion */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.08,
        mixBlendMode: 'overlay',
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")',
        backgroundSize: '200px 200px',
        pointerEvents: 'none',
      }} />

      {/* Corner vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
