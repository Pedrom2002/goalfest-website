'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { SponsorsData } from '@/types'
import { useInViewOnce } from '@/lib/useInViewOnce'

function FadeUpHeader({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, seen } = useInViewOnce<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className="flex items-center gap-3 justify-center"
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
        willChange: seen ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

function SponsorLogo({ name, logo, url, large, logoScale, index, whiten }: { name: string; logo: string | null; url?: string; large?: boolean; logoScale?: number; index: number; whiten?: boolean }) {
  const scale = logoScale ?? 1
  const pct = `${scale * 100}%`
  const { ref, seen } = useInViewOnce<HTMLDivElement>()
  const inner = (
    <>
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={large ? 160 : 100}
          height={large ? 72 : 44}
          className="object-contain"
          // Skip Next's optimizer for whitened logos: AVIF re-encoding flattens
          // alpha onto a white background, which the brightness/invert filter then
          // turns into a solid white block.
          unoptimized={whiten}
          style={{ width: pct, height: pct, maxWidth: scale > 1 ? 'none' : undefined, filter: whiten ? 'brightness(0) invert(1)' : undefined }}
        />
      ) : (
        <span className="text-text-muted font-semibold uppercase tracking-wide text-xs">{name}</span>
      )}
    </>
  )

  const card = (
    <div
      ref={ref}
      className={`bg-white/8 border border-white/14 rounded-xl flex items-center justify-center transition-[border-color,transform,box-shadow] duration-300 hover:border-white/35 hover:scale-[1.08] p-4 overflow-hidden ${
        large ? 'w-36 h-16 md:w-48 md:h-24' : 'w-36 h-16 md:w-44 md:h-24'
      }`}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'scale(1) translateY(0)' : (large ? 'scale(0.8)' : 'scale(0.9) translateY(10px)'),
        transition: `opacity 0.5s ease-out ${index * 0.08}s, transform 0.5s ease-out ${index * 0.08}s, border-color 0.3s, box-shadow 0.3s`,
        willChange: seen ? 'auto' : 'opacity, transform',
      }}
    >
      {inner}
    </div>
  )

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
      {card}
    </a>
  ) : card
}

export default function Sponsors({ data }: { data: SponsorsData }) {
  const t = useTranslations('sponsors')

  return (
    <section id="sponsors" className="relative py-12 md:py-24 px-4" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,215,0,0.05) 0%, transparent 70%)' }}>
      <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

        {/* Left: Patrocinadores */}
        <div className="flex flex-col items-center gap-8 px-4 md:px-8 pb-12 md:pb-0 border-b border-white/10 md:border-b-0 md:border-r md:border-white/10">
          <FadeUpHeader>
            <span className="h-px w-12 bg-gold/40" />
            <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">{t('title')}</h2>
            <span className="h-px w-12 bg-gold/40" />
          </FadeUpHeader>
          <div className="flex gap-6 flex-wrap justify-center">
            {data.principal.map((s, i) => (
              <SponsorLogo key={s.id} name={s.name} logo={s.logo} {...(s.url !== undefined && { url: s.url })} {...(s.logoScale !== undefined && { logoScale: s.logoScale })} large index={i} />
            ))}
          </div>
        </div>

        {/* Right: Parceiros */}
        <div className="flex flex-col items-center gap-8 px-4 md:px-8 pt-12 md:pt-0">
          <FadeUpHeader delay={0.1}>
            <span className="h-px w-12 bg-white/20" />
            <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">{t('partners_label')}</h2>
            <span className="h-px w-12 bg-white/20" />
          </FadeUpHeader>
          <div className="flex gap-4 flex-wrap justify-center">
            {data.parceiros.map((s, i) => (
              <SponsorLogo key={s.id} name={s.name} logo={s.logo} {...(s.url !== undefined && { url: s.url })} {...(s.logoScale !== undefined && { logoScale: s.logoScale })} index={i} />
            ))}
          </div>
        </div>

      </div>

      {/* Accommodation Partners */}
      <div className="flex flex-col items-center gap-8 mt-12 md:mt-20 pt-12 md:pt-16 border-t border-white/10">
        <FadeUpHeader delay={0.2}>
          <span className="h-px w-12 bg-white/20" />
          <h2 className="font-display text-3xl md:text-5xl font-black text-center text-text-primary uppercase tracking-wide">{t('accommodation_label')}</h2>
          <span className="h-px w-12 bg-white/20" />
        </FadeUpHeader>
        <div className="flex gap-6 flex-wrap justify-center">
          {data.accommodation.map((s, i) => (
            <SponsorLogo key={s.id} name={s.name} logo={s.logo} {...(s.url !== undefined && { url: s.url })} {...(s.logoScale !== undefined && { logoScale: s.logoScale })} whiten large index={i} />
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
