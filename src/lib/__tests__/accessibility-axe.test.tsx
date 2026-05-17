// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

expect.extend(toHaveNoViolations)

vi.mock('next-intl', () => {
  const t = (key: string) => key
  t.rich = (key: string) => key
  return {
    useTranslations: () => t,
    useLocale: () => 'pt',
  }
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/pt',
}))

vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} {...props} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, tag: string) => {
      const Component = ({ children, ...p }: React.HTMLAttributes<HTMLElement>) => {
        const Tag = tag as React.ElementType
        return <Tag {...p}>{children}</Tag>
      }
      Component.displayName = `motion.${tag}`
      return Component
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
}))

vi.mock('next/dynamic', () => ({
  default: (_fn: unknown, _opts: unknown) => {
    const Stub = () => <div data-testid="dynamic-stub" />
    Stub.displayName = 'DynamicStub'
    return Stub
  },
}))

vi.mock('@/data/faq.json', () => ({
  default: [
    {
      category: 'entradas',
      items: [
        { q: 'Pergunta PT?', a: 'Resposta PT.', qEn: 'Question EN?', aEn: 'Answer EN.' },
      ],
    },
  ],
}))

vi.mock('@/components/ui/CountdownTimer', () => ({
  default: () => <div data-testid="countdown" aria-label="Countdown timer">00:00:00</div>,
}))

vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }))

vi.mock('@/components/ui/BackgroundFX', () => ({
  default: () => <div data-testid="bg-fx" aria-hidden="true" />,
}))

vi.mock('@/lib/env', () => ({
  getEnv: vi.fn(() => ({ NEXT_PUBLIC_MAPBOX_TOKEN: 'mock' })),
}))

import Navbar from '@/components/layout/Navbar'
import FaqSection from '@/components/sections/FaqSection'
import Venue from '@/components/sections/Venue'
import Hero from '@/components/sections/Hero'
import WhatIsGoalfest from '@/components/sections/WhatIsGoalfest'

describe('Axe accessibility', () => {
  it('Navbar has no axe violations', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    const { container } = render(<Navbar />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('FaqSection has no axe violations', async () => {
    const { container } = render(<FaqSection />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Venue has no axe violations', async () => {
    const { container } = render(<Venue />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  }, 15000)

  it('Hero has no axe violations', async () => {
    const { container } = render(<Hero />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  }, 15000)

  it('WhatIsGoalfest has no axe violations', async () => {
    const { container } = render(<WhatIsGoalfest />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  }, 15000)
})
