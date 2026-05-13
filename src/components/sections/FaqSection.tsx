'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import FaqAccordion from '@/components/ui/FaqAccordion'
import faqData from '@/data/faq.json'

export default function FaqSection() {
  const locale = useLocale()
  const allItems = faqData.flatMap(cat => cat.items.map(item => ({
    q: locale === 'en' ? item.qEn : item.q,
    a: locale === 'en' ? item.aEn : item.a,
  })))

  return (
    <section id="faq" className="relative py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 justify-center mb-12"
        >
          <span className="h-px w-12 bg-green-pt/40" />
          <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">FAQ</h2>
          <span className="h-px w-12 bg-green-pt/40" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FaqAccordion items={allItems} />
        </motion.div>
      </div>
    </section>
  )
}
