'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Concert } from '@/data/concerts'

export default function ArtistCard({ concert, dateStr }: { concert: Concert; dateStr: string }) {
  const t = useTranslations('concertos')
  const time = concert.endTime ? `${concert.startTime} – ${concert.endTime}` : concert.startTime

  return (
    <div className="bg-bg-surface border border-white/14 rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(200,16,46,0.25)] hover:border-[#C8102E]/50">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider">
        <span className="text-text-muted">{concert.stage ?? t('stage_default')}</span>
        <span className="text-[#43B02A] font-mono font-bold tabular-nums">{time}</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        {concert.image && (
          <Image
            src={concert.image}
            alt={concert.artist}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border border-white/14"
          />
        )}
        <span className="text-lg font-semibold text-text-primary text-center">
          {concert.artist}
        </span>
      </div>

      <p className="text-text-muted text-xs text-center">
        {dateStr}
      </p>
    </div>
  )
}
