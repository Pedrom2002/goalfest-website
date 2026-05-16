// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({
  useLocale: () => 'pt',
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
