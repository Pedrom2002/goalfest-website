// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const ptMessages: Record<string, string> = {
  'tag': 'O Evento',
  'title_before': 'O que é o',
  'title_highlight': 'Goalfest',
  'desc': 'Mais do que uma Fanzone.',
  'view_schedule': 'Ver programação ↗',
  'features.matches_title': 'Jogos do Mundial',
  'features.matches_body': '+50 jogos da FIFA World Cup 2026 transmitidos ao vivo num ecrã gigante de alta definição.',
  'features.concerts_title': 'Concertos',
  'features.concerts_body': 'Atuações ao vivo de grandes nomes da música portuguesa e internacional nos dias de jogo.',
  'features.gaming_title': 'Zona Gaming',
  'features.gaming_body': 'Consolas disponíveis para todos.',
  'features.football_title': 'Football Park',
  'features.football_body': 'Competições e torneios de futebol 5vs5.',
  'features.kids_title': 'Zona Kids',
  'features.kids_body': 'Espaço dedicado às crianças.',
  'features.food_title': 'Food Court',
  'features.food_body': 'Food trucks, bar e restaurante gourmet.',
  'features.fun_title': 'Fun Activities',
  'features.fun_body': 'Roda gigante com vista sobre o recinto.',
  'features.golden_title': 'Golden Circle',
  'features.golden_body': 'Área paga com acesso exclusivo.',
  'features.vip_title': 'VIP Lounge',
  'features.vip_body': 'Lounge exclusivo por convite.',
  'stats.matches_value': '+50',
  'stats.matches_label': 'jogos transmitidos',
  'stats.concerts_value': '+10',
  'stats.concerts_label': 'concertos',
  'stats.hours_value': '10h–02h',
  'stats.hours_label': 'horário diário',
}

vi.mock('next-intl', () => ({
  useLocale: () => 'pt',
  useTranslations: (_ns: string) => (key: string) => ptMessages[key] ?? key,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) =>
    <a href={href}>{children}</a>,
}))

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_: object, tag: string) =>
      ({ children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>) =>
        React.createElement(tag as keyof React.JSX.IntrinsicElements, rest as Record<string, unknown>, children),
  }),
}))

import WhatIsGoalfest from './WhatIsGoalfest'

describe('WhatIsGoalfest', () => {
  it('renders without crashing', () => {
    render(<WhatIsGoalfest />)
    expect(document.body).toBeTruthy()
  })

  it('renders headings', () => {
    render(<WhatIsGoalfest />)
    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThan(0)
  })

  it('renders feature cards for pt locale', () => {
    render(<WhatIsGoalfest />)
    expect(screen.getByText('Jogos do Mundial')).toBeInTheDocument()
    expect(screen.getByText('Concertos')).toBeInTheDocument()
    expect(screen.getByText('Zona Gaming')).toBeInTheDocument()
  })

  it('renders stats', () => {
    render(<WhatIsGoalfest />)
    expect(screen.getByText('+50')).toBeInTheDocument()
    expect(screen.getByText('+10')).toBeInTheDocument()
  })

  it('renders schedule link for World Cup Matches card', () => {
    render(<WhatIsGoalfest />)
    const link = screen.getByText(/Ver programação/i)
    expect(link).toBeInTheDocument()
  })
})
