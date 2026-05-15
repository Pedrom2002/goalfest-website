// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) =>
    React.createElement('img', { alt, ...rest }),
}))

// Mock next-intl (global __mocks__ is not auto-applied by Vitest without automock config)
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
}))

// Mock framer-motion (global __mocks__ is not auto-applied by Vitest without automock config)
vi.mock('framer-motion', () => {
  const motion = new Proxy({} as Record<string, React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>>, {
    get: (_target, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag as string, rest, children),
  })
  const AnimatePresence = ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children)
  const useInView = () => true
  const useAnimation = () => ({ start: () => {}, stop: () => {} })
  const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {} })
  return { motion, AnimatePresence, useInView, useAnimation, useMotionValue }
})

// Mock next/dynamic to return a component that throws (simulating Three.js crash)
vi.mock('next/dynamic', () => ({
  default: () => {
    const ThrowingComponent = () => {
      throw new Error('WebGL not available')
    }
    return ThrowingComponent
  },
}))

import Venue from './Venue'

describe('Venue error boundary', () => {
  it('renders fallback text when 3D model throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<Venue />)
    expect(screen.getByText('Modelo 3D indisponível')).toBeInTheDocument()
    consoleSpy.mockRestore()
  })

  it('does not propagate the Three.js error beyond the boundary', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Venue />)).not.toThrow()
    consoleSpy.mockRestore()
  })
})
