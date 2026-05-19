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

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-wrap justify-center gap-8 md:gap-12 my-12 md:my-16"
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="font-display text-3xl md:text-4xl font-black text-green-pt">{s.value}</p>
          <p className="text-text-muted text-xs uppercase tracking-widest mt-1">{s.label}</p>
        </div>
      ))}
    </motion.div>
  )
}

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl p-6 bg-bg-surface/80 border border-white/12 hover:border-green-pt/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,200,81,0.08)] backdrop-blur-sm"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-pt/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
      <h3 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-2">{feature.title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{feature.body}</p>
      {feature.isMatches && (
        <Link href={`/${locale}/jogos`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-green-pt text-xs font-semibold hover:underline uppercase tracking-widest">
          {viewScheduleLabel}
        </Link>
      )}
    </motion.div>
  )
}
