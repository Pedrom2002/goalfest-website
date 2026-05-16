// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
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
  useInView: () => true,
}))

vi.mock('@/components/ui/CountdownTimer', () => ({
  default: () => <div data-testid="countdown" />,
}))

import Hero from './Hero'

describe('Hero', () => {
  it('renders a video element with aria-label', () => {
    render(<Hero />)
    const video = document.querySelector('video')
    expect(video).not.toBeNull()
    expect(video?.getAttribute('aria-label')).toBeTruthy()
  })

  it('renders countdown timer', () => {
    render(<Hero />)
    expect(screen.getByTestId('countdown')).toBeInTheDocument()
  })

  it('renders the event logo image', () => {
    render(<Hero />)
    expect(screen.getByAltText('Goalfest Lisboa')).toBeInTheDocument()
  })
})
