// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { SponsorsData } from '@/types'

vi.mock('next-intl', () => ({
  useTranslations: (_ns: string) => (key: string) => ({
    title: 'Patrocinadores',
    principal_label: 'Patrocinador Principal',
    partners_label: 'Parceiros',
    accommodation_label: 'Accommodation Partners',
  })[key] ?? key,
}))

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_: object, tag: string) =>
      ({ children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>) =>
        React.createElement(tag as keyof React.JSX.IntrinsicElements, rest as Record<string, unknown>, children),
  }),
}))

import Sponsors from './Sponsors'

const mockData: SponsorsData = {
  principal: [
    { id: 's1', name: 'ActivoBank', logo: '/logo.svg', url: 'https://activobank.pt' },
  ],
  parceiros: [
    { id: 'p1', name: 'Lisboa', logo: '/lisboa.png', url: 'https://lisboa.pt' },
  ],
  accommodation: [
    { id: 'a1', name: 'Hotel Roma', logo: '/hotel_roma.png', url: 'https://hotelroma.pt' },
  ],
}

describe('Sponsors', () => {
  it('renders without crashing', () => {
    render(<Sponsors data={mockData} />)
    expect(document.body).toBeTruthy()
  })

  it('renders section headings', () => {
    render(<Sponsors data={mockData} />)
    expect(screen.getByText('Sponsors')).toBeInTheDocument()
    expect(screen.getByText('Partners')).toBeInTheDocument()
  })

  it('renders principal sponsor logo', () => {
    render(<Sponsors data={mockData} />)
    expect(screen.getByAltText('ActivoBank')).toBeInTheDocument()
  })

  it('renders parceiro sponsor logo', () => {
    render(<Sponsors data={mockData} />)
    expect(screen.getByAltText('Lisboa')).toBeInTheDocument()
  })

  it('renders hospitality partners heading and logo', () => {
    render(<Sponsors data={mockData} />)
    expect(screen.getByText('Hospitality Partners')).toBeInTheDocument()
    expect(screen.getByAltText('Hotel Roma')).toBeInTheDocument()
  })

  it('renders sponsor links', () => {
    render(<Sponsors data={mockData} />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('renders name fallback when logo is null', () => {
    const noLogoData: SponsorsData = {
      principal: [{ id: 'x1', name: 'NoLogo Sponsor', logo: null }],
      parceiros: [],
      accommodation: [],
    }
    render(<Sponsors data={noLogoData} />)
    expect(screen.getByText('NoLogo Sponsor')).toBeInTheDocument()
  })
})
