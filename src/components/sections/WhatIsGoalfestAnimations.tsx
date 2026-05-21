'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

type Feature = { title: string; body: string; isMatches?: boolean }
type Stat = { value: string; label: string }

export function AnimatedHeader({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-6"
    >
      {children}
    </motion.div>
  )
}

const STAT_COLORS = ['#0033A0', '#43B02A', '#C8102E']

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-wrap justify-center gap-8 md:gap-12 my-12 md:my-16"
    >
      {stats.map((s, i) => (
        <div key={s.label} className="text-center">
          {i === 2 ? (
            <>
              <div className="inline-flex items-center gap-1.5 mb-1">
                <span className="font-display text-3xl md:text-4xl font-black" style={{ color: STAT_COLORS[2] }}>10h</span>
                <span className="text-text-muted/50 text-xl">–</span>
                <span className="font-display text-3xl md:text-4xl font-black" style={{ color: STAT_COLORS[2] }}>02h</span>
              </div>
              <p className="text-text-muted text-xs uppercase tracking-widest">{s.label}</p>
            </>
          ) : (
            <>
              <p className="font-display text-3xl md:text-4xl font-black" style={{ color: STAT_COLORS[i % 3] }}>{s.value}</p>
              <p className="text-text-muted text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </>
          )}
        </div>
      ))}
    </motion.div>
  )
}

const CARD_COLORS = [
  { border: '#0033A0', shadow: '0,51,160',  bgBase: '#0d1520', bgAccent: 'rgba(0,51,160,0.12)' },
  { border: '#43B02A', shadow: '67,176,42', bgBase: '#0d1a10', bgAccent: 'rgba(67,176,42,0.12)' },
  { border: '#C8102E', shadow: '200,16,46', bgBase: '#1a0d10', bgAccent: 'rgba(200,16,46,0.12)' },
]

export function AnimatedFeatureCard({
  feature,
  index,
  locale,
  viewScheduleLabel,
}: {
  feature: Feature
  index: number
  locale: string
  viewScheduleLabel: string
}) {
  const col = index % 3
  const { border, shadow, bgBase, bgAccent } = CARD_COLORS[col]!

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl p-6 transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${bgBase} 60%, ${bgAccent})`,
        border: `1px solid ${border}77`,
        boxShadow: `0 0 24px rgba(${shadow},0.22), inset 0 0 12px rgba(${shadow},0.05)`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.border = `1px solid ${border}cc`
        el.style.boxShadow = `0 0 50px rgba(${shadow},0.45), inset 0 0 16px rgba(${shadow},0.10)`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.border = `1px solid ${border}77`
        el.style.boxShadow = `0 0 24px rgba(${shadow},0.22), inset 0 0 12px rgba(${shadow},0.05)`
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
        style={{ background: `linear-gradient(to right, transparent, ${border}, transparent)` }}
      />
      <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-2">{feature.title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{feature.body}</p>
      {feature.isMatches && (
        <Link href={`/${locale}/jogos`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs font-semibold hover:underline uppercase tracking-widest" style={{ color: border }}>
          {viewScheduleLabel}
        </Link>
      )}
    </motion.div>
  )
}
