'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/ui/VenueMap'), { ssr: false })

const INFO_ICONS: Record<string, string> = {
  transport: '🚇',
  parking: '🅿️',
  access: '♿',
  hours: '🕐',
}

export default function Venue() {
  const t = useTranslations('venue')
  const includes = t.raw('includes') as string[]

  const infoCards = [
    { key: 'transport', title: t('transport_title'), body: t('transport') },
    { key: 'parking', title: t('parking_title'), body: t('parking') },
    { key: 'access', title: t('access_title'), body: t('access') },
    { key: 'hours', title: t('hours_title'), body: t('hours') },
  ]

  return (
    <section id="venue" className="py-24 px-4 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-5xl font-black text-center text-text-primary mb-16 uppercase tracking-wide"
      >
        {t('title')}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">{t('address_label')}</p>
            <p className="text-text-primary text-lg font-semibold">{t('address')}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-1">{t('capacity_label')}</p>
            <p className="text-text-primary text-lg font-semibold">{t('capacity')}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-widest mb-2">{t('includes_label')}</p>
            <ul className="flex flex-wrap gap-2">
              {includes.map((item) => (
                <li key={item} className="bg-bg-surface border border-gold/20 text-gold text-sm px-3 py-1 rounded-full">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="h-72 md:h-96 rounded-xl overflow-hidden border border-white/10"
        >
          <MapComponent />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {infoCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-bg-surface border border-white/10 rounded-xl p-5"
          >
            <div className="text-2xl mb-2">{INFO_ICONS[card.key]}</div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-wide mb-1">{card.title}</h3>
            <p className="text-text-muted text-sm">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
