import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import JogosSchedule from './JogosSchedule'

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

describe('JogosSchedule', () => {
  it('renders all filter buttons', () => {
    render(<JogosSchedule />)
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fase de Grupos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminatórias' })).toBeInTheDocument()
  })

  it('shows match days by default', () => {
    render(<JogosSchedule />)
    const dayHeaders = screen.getAllByText(/Jun|Jul/)
    expect(dayHeaders.length).toBeGreaterThan(0)
  })

  it('shows group stage days after clicking Fase de Grupos', async () => {
    const user = userEvent.setup()
    render(<JogosSchedule />)
    await user.click(screen.getByRole('button', { name: 'Fase de Grupos' }))
    const junDays = screen.getAllByText(/Jun/)
    expect(junDays.length).toBeGreaterThan(0)
    expect(screen.queryByText(/Jul/)).not.toBeInTheDocument()
  })

  it('shows knockout days after clicking Eliminatórias', async () => {
    const user = userEvent.setup()
    render(<JogosSchedule />)
    await user.click(screen.getByRole('button', { name: 'Eliminatórias' }))
    const julDays = screen.getAllByText(/Jul/)
    expect(julDays.length).toBeGreaterThan(0)
  })

  it('returns to all matches after clicking Todos', async () => {
    const user = userEvent.setup()
    render(<JogosSchedule />)
    await user.click(screen.getByRole('button', { name: 'Fase de Grupos' }))
    await user.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getAllByText(/Jun/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Jul/).length).toBeGreaterThan(0)
  })

  it('renders Portugal in group stage', () => {
    render(<JogosSchedule />)
    const portugalEls = screen.getAllByText('Portugal')
    expect(portugalEls.length).toBeGreaterThan(0)
  })

  it('renders TBA label for knockout matches', () => {
    render(<JogosSchedule />)
    const tbaLabels = screen.getAllByText('A definir')
    expect(tbaLabels.length).toBeGreaterThan(0)
  })

  it('active filter button has aria-pressed=true, others aria-pressed=false', async () => {
    const user = userEvent.setup()
    render(<JogosSchedule />)
    let allBtn = screen.getByRole('button', { name: /Todos/i })
    let groupBtn = screen.getByRole('button', { name: /Fase de Grupos/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'true')
    expect(groupBtn).toHaveAttribute('aria-pressed', 'false')
    await user.click(groupBtn)
    // Re-query after state update
    allBtn = screen.getByRole('button', { name: /Todos/i })
    groupBtn = screen.getByRole('button', { name: /Fase de Grupos/i })
    expect(allBtn).toHaveAttribute('aria-pressed', 'false')
    expect(groupBtn).toHaveAttribute('aria-pressed', 'true')
  })
})
