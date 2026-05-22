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
  const { ref: headerRef, seen: headerSeen } = useInViewOnce<HTMLDivElement>()
  const { ref: accRef, seen: accSeen } = useInViewOnce<HTMLDivElement>()

  const headerStyle: React.CSSProperties = {
    opacity: headerSeen ? 1 : 0,
    transform: headerSeen ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    willChange: headerSeen ? 'auto' : 'opacity, transform',
  }
  const accStyle: React.CSSProperties = {
    opacity: accSeen ? 1 : 0,
    transform: accSeen ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s ease-out 0.1s, transform 0.6s ease-out 0.1s',
    willChange: accSeen ? 'auto' : 'opacity, transform',
  }

  return (
    <section id="faq" className="relative py-12 md:py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div ref={headerRef} className="flex items-center gap-3 justify-center mb-12" style={headerStyle}>
          <span className="h-px w-12 bg-[#43B02A]/40" />
          <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">FAQ</h2>
          <span className="h-px w-12 bg-[#43B02A]/40" />
        </div>

        <div ref={accRef} style={accStyle}>
          <FaqAccordion items={allItems} />
        </div>
      </div>
    </section>
  )
}
