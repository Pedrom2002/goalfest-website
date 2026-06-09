// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import type { Concert } from '@/data/concerts'

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

const PT_CONCERTOS: Record<string, string> = {
  subtitle: 'Line-up',
  heading: 'Concertos',
  count: '+10 concertos ao vivo · Goalfest 2026',
  back: 'Voltar ao início',
  stage_default: 'Palco Principal',
  empty_title: 'Line-up em breve',
  empty_body: 'Os artistas confirmados serão anunciados em breve. Fica atento!',
}

vi.mock('next-intl', () => ({
  useTranslations: (_ns?: string) => (key: string) => PT_CONCERTOS[key] ?? key,
  useLocale: () => 'pt',
}))

import ConcertosSchedule from './ConcertosSchedule'

const SAMPLE: Concert = {
  artist: 'Artista Teste',
  date: '2026-06-17',
  displayDate: '17 Jun',
  startTime: '22H',
}

describe('ConcertosSchedule', () => {
  it('shows the empty state when there are no concerts', () => {
    render(<ConcertosSchedule concerts={[]} />)
    expect(screen.getByText('Line-up em breve')).toBeInTheDocument()
  })

  it('renders the heading', () => {
    render(<ConcertosSchedule concerts={[]} />)
    expect(screen.getByText('Concertos')).toBeInTheDocument()
  })

  it('renders an artist and day when concerts exist', () => {
    render(<ConcertosSchedule concerts={[SAMPLE]} />)
    expect(screen.getByText('Artista Teste')).toBeInTheDocument()
    expect(screen.getAllByText('17 Jun').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Line-up em breve')).not.toBeInTheDocument()
  })

  it('renders back to home link', () => {
    render(<ConcertosSchedule concerts={[]} />)
    expect(screen.getByText(/Voltar ao início/i)).toBeInTheDocument()
  })
})
