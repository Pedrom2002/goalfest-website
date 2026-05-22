'use client'

import { useLocale } from 'next-intl'
import FaqAccordion from '@/components/ui/FaqAccordion'
import faqData from '@/data/faq.json'
import { useInViewOnce } from '@/lib/useInViewOnce'

export default function FaqSection() {
  const locale = useLocale()
  const allItems = faqData.flatMap(cat => cat.items.map(item => ({
    q: locale === 'en' ? item.qEn : item.q,
    a: locale === 'en' ? item.aEn : item.a,
  })))
  const header = useInViewOnce<HTMLDivElement>()
  const acc = useInViewOnce<HTMLDivElement>()

  const fadeUp = (seen: boolean, delay = 0): React.CSSProperties => ({
    opacity: seen ? 1 : 0,
    transform: seen ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
    willChange: seen ? 'auto' : 'opacity, transform',
  })

  return (
    <section id="faq" className="relative py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div ref={header.ref} className="flex items-center gap-3 justify-center mb-12" style={fadeUp(header.seen)}>
          <span className="h-px w-12 bg-[#43B02A]/40" />
          <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">FAQ</h2>
          <span className="h-px w-12 bg-[#43B02A]/40" />
        </div>

        <div ref={acc.ref} style={fadeUp(acc.seen, 0.1)}>
          <FaqAccordion items={allItems} />
        </div>
      </div>
    </section>
  )
}
