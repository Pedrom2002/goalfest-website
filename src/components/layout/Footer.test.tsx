// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockUseLocale = vi.fn().mockReturnValue('pt')

vi.mock('next-intl', () => ({
  useTranslations: (_ns: string) => (key: string) => ({
    copyright: '© 2026 Quic Nation. Todos os direitos reservados.',
  })[key] ?? key,
  useLocale: () => mockUseLocale(),
}))

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) =>
    <a href={href}>{children}</a>,
}))

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

import Footer from './Footer'

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />)
    expect(document.body).toBeTruthy()
  })

  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText('© 2026 Quic Nation. Todos os direitos reservados.')).toBeInTheDocument()
  })

  it('renders logo image', () => {
    render(<Footer />)
    expect(screen.getByAltText('Fanzone Lisboa')).toBeInTheDocument()
  })

  it('renders email link', () => {
    render(<Footer />)
    const emailLink = screen.getByText('goalfest@quic.pt')
    expect(emailLink).toBeInTheDocument()
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:goalfest@quic.pt')
  })

  it('renders privacy and terms links for pt locale', () => {
    render(<Footer />)
    expect(screen.getByText('Privacidade')).toBeInTheDocument()
    expect(screen.getByText('Termos')).toBeInTheDocument()
  })

  it('privacy link href is /privacidade (locale injected by next-intl Link)', () => {
    render(<Footer />)
    const privacyLink = screen.getByText('Privacidade').closest('a')
    expect(privacyLink).toHaveAttribute('href', '/privacidade')
  })

  it('renders English labels for en locale', () => {
    mockUseLocale.mockReturnValueOnce('en')
    render(<Footer />)
    expect(screen.getByText('Privacy')).toBeInTheDocument()
    expect(screen.getByText('Terms')).toBeInTheDocument()
  })
})
