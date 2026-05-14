import type { Match } from '@/types'

export type Filter = 'all' | 'grupos' | 'eliminatorias' | 'portugal'

export function applyFilter(matches: Match[], filter: Filter): Match[] {
  if (filter === 'all') return matches
  if (filter === 'grupos') return matches.filter((m) => m.phase === 'grupo')
  if (filter === 'eliminatorias') return matches.filter((m) => m.phase !== 'grupo')
  return matches.filter(
    (m) => m.home.nameEn === 'Portugal' || m.away.nameEn === 'Portugal'
  )
}
