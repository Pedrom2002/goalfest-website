'use client'

import Link from 'next/link'
import { useInViewOnce } from '@/lib/useInViewOnce'

type Feature = { title: string; body: string; isMatches?: boolean; isConcerts?: boolean }

const FADE_UP_STYLE = (seen: boolean, delay = 0): React.CSSProperties => ({
  opacity: seen ? 1 : 0,
  transform: seen ? 'translateY(0)' : 'translateY(24px)',
  transition: `opacity 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`,
  willChange: seen ? 'auto' : 'opacity, transform',
})

export function AnimatedHeader({ children }: { children: React.ReactNode }) {
  const { ref, seen } = useInViewOnce<HTMLDivElement>()
  return (
    <div ref={ref} className="text-center mb-6" style={FADE_UP_STYLE(seen)}>
      {children}
    </div>
  )
}

const CARD_COLORS = [
  { border: '#4f74e8', linkColor: '#bcd0ff', shadow: '0,51,160',  bgBase: '#26375e', bgAccent: 'rgba(79,116,232,0.45)' },
  { border: '#5fce42', linkColor: '#cdf5bc', shadow: '67,176,42', bgBase: '#274d2f', bgAccent: 'rgba(95,206,66,0.42)' },
  { border: '#f04a63', linkColor: '#ffc6cf', shadow: '200,16,46', bgBase: '#5a2632', bgAccent: 'rgba(240,74,99,0.42)' },
]

export function AnimatedFeatureCard({
  feature,
  index,
  locale,
  viewScheduleLabel,
  viewConcertsLabel,
}: {
  feature: Feature
  index: number
  locale: string
  viewScheduleLabel: string
  viewConcertsLabel: string
}) {
  const col = index % 3
  const { border, linkColor, shadow, bgBase, bgAccent } = CARD_COLORS[col]!
  const { ref, seen } = useInViewOnce<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl p-6 hover:-translate-y-1"
      style={{
        background: `linear-gradient(145deg, ${bgAccent} 0%, ${bgBase} 60%)`,
        border: `1px solid ${border}aa`,
        boxShadow: `0 8px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 0.07}s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 0.07}s, border 0.3s, box-shadow 0.3s`,
        willChange: seen ? 'auto' : 'opacity, transform',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.border = `1px solid ${border}`
        el.style.boxShadow = `0 8px 36px rgba(0,0,0,0.55), 0 0 28px rgba(${shadow},0.35), inset 0 1px 0 rgba(255,255,255,0.06)`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.border = `1px solid ${border}66`
        el.style.boxShadow = `0 6px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
        style={{ background: `linear-gradient(to right, transparent, ${border}, transparent)` }}
      />
      <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-2">{feature.title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{feature.body}</p>
      {feature.isMatches && (
        <Link href={`/${locale}/jogos`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-semibold hover:underline uppercase tracking-widest" style={{ color: linkColor }}>
          {viewScheduleLabel}
        </Link>
      )}
      {feature.isConcerts && (
        <Link href={`/${locale}/concertos`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-semibold hover:underline uppercase tracking-widest" style={{ color: linkColor }}>
          {viewConcertsLabel}
        </Link>
      )}
    </div>
  )
}
