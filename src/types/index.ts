export type MatchStatus = 'upcoming' | 'live' | 'finished'
export type MatchPhase = 'grupo' | 'oitavos' | 'quartos' | 'meias' | 'final'

export interface TeamInfo {
  name: string
  nameEn: string
  flag: string
}

export interface Match {
  id: string
  home: TeamInfo
  away: TeamInfo
  date: string
  phase: MatchPhase
  status: MatchStatus
}

export interface FaqItem {
  q: string
  qEn: string
  a: string
  aEn: string
}

export interface FaqCategory {
  category: string
  categoryEn: string
  items: FaqItem[]
}

export interface Sponsor {
  id: string
  name: string
  logo: string | null
}

export interface SponsorsData {
  principal: Sponsor[]
  parceiros: Sponsor[]
}
