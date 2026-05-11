import { useTranslations, useLocale } from 'next-intl'
import type { Match } from '@/types'
import { formatMatchDate } from '@/lib/utils'

const phaseKeys: Record<string, string> = {
  grupo: 'phase_grupo',
  oitavos: 'phase_oitavos',
  quartos: 'phase_quartos',
  meias: 'phase_meias',
  final: 'phase_final',
}

export default function MatchCard({ match }: { match: Match }) {
  const t = useTranslations('jogos')
  const locale = useLocale()
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <div
      className={`bg-bg-surface border border-white/10 rounded-xl p-5 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:border-gold/30 ${
        isFinished ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-wider">
        <span className="text-text-muted">{t(phaseKeys[match.phase])}</span>
        {isLive && (
          <span className="flex items-center gap-1.5 text-red-pt font-bold">
            <span className="w-2 h-2 rounded-full bg-red-pt animate-pulse" />
            {t('live_badge')}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-3xl">{match.home.flag}</span>
          <span className="text-sm font-medium text-text-primary text-center">
            {locale === 'pt' ? match.home.name : match.home.nameEn}
          </span>
        </div>
        <span className="text-text-muted font-display text-lg font-bold">VS</span>
        <div className="flex flex-col items-center gap-1 flex-1">
          <span className="text-3xl">{match.away.flag}</span>
          <span className="text-sm font-medium text-text-primary text-center">
            {locale === 'pt' ? match.away.name : match.away.nameEn}
          </span>
        </div>
      </div>

      <p className="text-text-muted text-xs text-center">
        {formatMatchDate(match.date, locale)}
      </p>
    </div>
  )
}
