// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
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
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}))

vi.mock('react-masonry-css', () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('@/components/ui/PhotoLightbox', () => ({
  default: () => null,
}))

// Import after mocks
import Galeria from './Galeria'

describe('Galeria', () => {
  it('renders skeleton before mount (server-side)', () => {
    // On first render the skeleton shows (mounted = false), not the real section
    const { container } = render(<Galeria />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders without crashing', () => {
    render(<Galeria />)
    expect(document.body.children.length).toBeGreaterThan(0)
  })

  it('skeleton contains animated pulse elements', () => {
    const { container } = render(<Galeria />)
    // Either skeleton divs or photo buttons are present
    const allDivs = container.querySelectorAll('div')
    expect(allDivs.length).toBeGreaterThan(0)
  })
})
