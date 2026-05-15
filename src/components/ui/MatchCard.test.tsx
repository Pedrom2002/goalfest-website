import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import * as nextIntl from 'next-intl'
import MatchCard from './MatchCard'
import type { Match } from '@/types'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
}))

const baseMatch: Match = {
  id: 'match-1',
  home: { name: 'Portugal', nameEn: 'Portugal', flag: '🇵🇹' },
  away: { name: 'Alemanha', nameEn: 'Germany', flag: '🇩🇪' },
  date: '2026-06-17',
  phase: 'grupo',
  status: 'upcoming',
}

describe('MatchCard', () => {
  it('renders PT team names when locale is pt', () => {
    render(<MatchCard match={baseMatch} dateStr="17 Jun" />)
    expect(screen.getByText('Portugal')).toBeInTheDocument()
    expect(screen.getByText('Alemanha')).toBeInTheDocument()
  })

  it('renders EN team names when locale is en', () => {
    vi.spyOn(nextIntl, 'useLocale').mockReturnValueOnce('en')
    render(<MatchCard match={baseMatch} dateStr="17 Jun" />)
    expect(screen.getByText('Germany')).toBeInTheDocument()
    vi.restoreAllMocks()
  })

  it('shows live badge when status is live', () => {
    const liveMatch = { ...baseMatch, status: 'live' as const }
    render(<MatchCard match={liveMatch} dateStr="17 Jun" />)
    expect(screen.getByText('live_badge')).toBeInTheDocument()
  })

  it('does not show live badge when status is upcoming', () => {
    render(<MatchCard match={baseMatch} dateStr="17 Jun" />)
    expect(screen.queryByText('live_badge')).not.toBeInTheDocument()
  })

  it('applies opacity-50 class when status is finished', () => {
    const finishedMatch = { ...baseMatch, status: 'finished' as const }
    const { container } = render(<MatchCard match={finishedMatch} dateStr="17 Jun" />)
    expect(container.firstChild).toHaveClass('opacity-50')
  })

  it('does not apply opacity-50 class when status is upcoming', () => {
    const { container } = render(<MatchCard match={baseMatch} dateStr="17 Jun" />)
    expect(container.firstChild).not.toHaveClass('opacity-50')
  })

  it('renders the dateStr', () => {
    render(<MatchCard match={baseMatch} dateStr="17 Jun 2026" />)
    expect(screen.getByText('17 Jun 2026')).toBeInTheDocument()
  })
})
