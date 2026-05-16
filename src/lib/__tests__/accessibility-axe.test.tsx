// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

expect.extend(toHaveNoViolations)

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
}))

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
      const El = tag as keyof JSX.IntrinsicElements
      const Component = ({ children, ...p }: React.HTMLAttributes<HTMLElement>) => {
        const Tag = El as React.ElementType
        return <Tag {...p}>{children}</Tag>
      }
      Component.displayName = `motion.${tag}`
      return Component
    },
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import Navbar from '@/components/layout/Navbar'

describe('Axe accessibility', () => {
  it('Navbar has no axe violations', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    const { container } = render(<Navbar />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
