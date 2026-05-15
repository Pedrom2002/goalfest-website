// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BackgroundFX from './BackgroundFX'

describe('BackgroundFX', () => {
  it('renders without crashing', () => {
    const { container } = render(<BackgroundFX />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders exactly 20 particles', () => {
    const { container } = render(<BackgroundFX />)
    const particles = container.querySelectorAll('.particle')
    expect(particles).toHaveLength(20)
  })

  it('renders exactly 4 beams', () => {
    const { container } = render(<BackgroundFX />)
    const beams = container.querySelectorAll('.beam')
    expect(beams).toHaveLength(4)
  })

  it('wrapping div has aria-hidden', () => {
    const { container } = render(<BackgroundFX />)
    expect(container.firstChild).toHaveAttribute('aria-hidden')
  })

  it('wrapping div has pointer-events-none class', () => {
    const { container } = render(<BackgroundFX />)
    expect(container.firstChild).toHaveClass('pointer-events-none')
  })
})
