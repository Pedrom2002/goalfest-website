// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import type { BroadcastDay } from '@/data/schedule'

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_: object, tag: string) =>
      ({ children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>) =>
        React.createElement(tag, rest, children),
  }),
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/data/teamFlags', () => ({ TEAM_FLAG: {} }))
vi.mock('country-flag-icons/react/3x2', () => ({}))
vi.mock('@/lib/matchPhase', () => ({
  phaseOf: (date: string) => (date.startsWith('2026-06') ? 'group' : 'knockout'),
  phaseLabel: (date: string, locale: string) =>
    date.startsWith('2026-06')
      ? locale === 'pt' ? 'Fase de Grupos' : 'Group Stage'
      : locale === 'pt' ? 'Eliminatórias' : 'Knockouts',
}))

const PT_JOGOS: Record<string, string> = {
  subtitle: 'Programação',
  heading: 'Jogos Transmitidos',
  count: '+50 jogos ao vivo · FIFA World Cup 2026',
  tba: 'A definir',
  back: 'Voltar ao início',
  filter_all: 'Todos',
  filter_grupos: 'Fase de Grupos',
  filter_eliminatorias: 'Eliminatórias',
}

vi.mock('next-intl', () => ({
  useTranslations: (_ns?: string) => (key: string) => PT_JOGOS[key] ?? key,
  useLocale: () => 'pt',
}))

import JogosSchedule from './JogosSchedule'

const GROUP_DAY: BroadcastDay = {
  date: '2026-06-14',
  displayDate: '14 Jun',
  matches: [{ time: '21:00', home: 'Portugal', away: 'Brasil' }],
  artists: ['Artista Teste'],
}

const KNOCKOUT_DAY: BroadcastDay = {
  date: '2026-07-04',
  displayDate: '4 Jul',
  matches: [{ time: '21:00', home: 'TBA', away: 'TBA' }],
  artists: [],
}

const FULL_SCHEDULE: BroadcastDay[] = [GROUP_DAY, KNOCKOUT_DAY]

describe('JogosSchedule', () => {
  it('renders all filter buttons', () => {
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Fase de Grupos' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminatórias' })).toBeInTheDocument()
  })

  it('shows match days by default', () => {
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    expect(screen.getByText('14 Jun')).toBeInTheDocument()
    expect(screen.getByText('4 Jul')).toBeInTheDocument()
  })

  it('shows only knockout days after clicking Eliminatórias', async () => {
    const user = userEvent.setup()
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    await user.click(screen.getByRole('button', { name: 'Eliminatórias' }))
    expect(screen.getByText('4 Jul')).toBeInTheDocument()
    expect(screen.queryByText('14 Jun')).not.toBeInTheDocument()
  })

  it('returns to all matches after clicking Todos', async () => {
    const user = userEvent.setup()
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    await user.click(screen.getByRole('button', { name: 'Eliminatórias' }))
    await user.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getByText('14 Jun')).toBeInTheDocument()
    expect(screen.getByText('4 Jul')).toBeInTheDocument()
  })

  it('renders match teams', () => {
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    expect(screen.getByText('Portugal')).toBeInTheDocument()
    expect(screen.getByText('Brasil')).toBeInTheDocument()
  })

  it('renders TBA label for unknown matches', () => {
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    expect(screen.getAllByText('A definir').length).toBeGreaterThanOrEqual(1)
  })

  it('active filter button has aria-pressed=true, others aria-pressed=false', async () => {
    const user = userEvent.setup()
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    let allBtn = screen.getByRole('button', { name: /Todos/i })
    const knockoutBtn = screen.getByRole('button', { name: /Eliminatórias/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'true')
    expect(knockoutBtn).toHaveAttribute('aria-pressed', 'false')
    await user.click(knockoutBtn)
    allBtn = screen.getByRole('button', { name: /Todos/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /Eliminatórias/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders back to home link', () => {
    render(<JogosSchedule schedule={FULL_SCHEDULE} />)
    expect(screen.getByText(/Voltar ao início/i)).toBeInTheDocument()
  })
})
