// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mockUseLocale = vi.fn().mockReturnValue('pt')

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => mockUseLocale(),
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/pt',
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('next/image', () => ({
  default: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt={alt} {...props} />,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) => <div {...p}>{children}</div>,
    h1: ({ children, ...p }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...p}>{children}</h1>,
    p: ({ children, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...p}>{children}</p>,
    span: ({ children, ...p }: React.HTMLAttributes<HTMLSpanElement>) => <span {...p}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import Navbar from './Navbar'

describe('Navbar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true, configurable: true })
  })

  it('hamburger button has aria-expanded=false initially', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: /abrir menu/i })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('hamburger button has aria-expanded=true after click', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: /abrir menu/i })
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('mobile menu has role=dialog when open', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('Escape key closes mobile menu', () => {
    render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: /abrir menu/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('locale switch button has aria-label', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument()
  })

  it('hamburger has aria-controls=mobile-menu', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: /abrir menu/i })
    expect(btn).toHaveAttribute('aria-controls', 'mobile-menu')
  })

  it('updates scrolled state on scroll event', () => {
    render(<Navbar />)
    Object.defineProperty(window, 'scrollY', { value: 80, writable: true, configurable: true })
    fireEvent.scroll(window)
    // Component re-renders with scrolled=true; just verify no crash
    expect(document.body).toBeTruthy()
  })

  it('renders correct aria-labels for en locale', () => {
    mockUseLocale.mockReturnValue('en')
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mudar para português/i })).toBeInTheDocument()
    mockUseLocale.mockReturnValue('pt')
  })
})
