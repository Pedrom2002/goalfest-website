// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BackgroundFX from './BackgroundFX'

describe('BackgroundFX', () => {
  it('renders without crashing', () => {
    const { container } = render(<BackgroundFX />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders exactly 6 beams', () => {
    const { container } = render(<BackgroundFX />)
    const beams = container.querySelectorAll('.beam')
    expect(beams).toHaveLength(6)
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
