// @vitest-environment jsdom
import React from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/',
}))

import HashScroller from './HashScroller'

describe('HashScroller', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders null', () => {
    const { container } = render(<HashScroller />)
    expect(container.firstChild).toBeNull()
  })

  it('scrolls to element matching hash after 100ms', () => {
    const el = document.createElement('div')
    el.id = 'venue'
    el.scrollIntoView = vi.fn()
    document.body.appendChild(el)

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, hash: '#venue' },
    })

    render(<HashScroller />)
    vi.advanceTimersByTime(100)

    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
    document.body.removeChild(el)
  })

  it('does nothing when no hash', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, hash: '' },
    })
    render(<HashScroller />)
    vi.advanceTimersByTime(200)
  })
})
