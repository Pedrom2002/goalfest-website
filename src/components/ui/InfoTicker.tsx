'use client'

import { useTranslations } from 'next-intl'

export default function InfoTicker() {
  const t = useTranslations('hero')
  const message = t('ticker')

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center bg-black/70 backdrop-blur-sm border-t border-[#43B02A]/30 overflow-hidden h-9"
      aria-label={message}
    >
      <span className="shrink-0 bg-[#43B02A] text-black text-[10px] font-bold uppercase tracking-widest px-3 h-full flex items-center z-10">
        {t('ticker_tag')}
      </span>
      <div className="flex-1 overflow-hidden whitespace-nowrap relative">
        <div className="inline-flex ticker-track" aria-hidden="true">
          <span className="text-white/85 text-xs uppercase tracking-widest px-8">{message}</span>
          <span className="text-white/85 text-xs uppercase tracking-widest px-8">{message}</span>
        </div>
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 18s linear infinite;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
