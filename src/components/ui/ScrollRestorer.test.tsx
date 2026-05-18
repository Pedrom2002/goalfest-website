// @vitest-environment jsdom
import React from 'react'
import { render } from '@testing-library/react'
import ScrollRestorer from './ScrollRestorer'

describe('ScrollRestorer', () => {
  beforeEach(() => {
    sessionStorage.clear()
    window.scrollTo = vi.fn()
  })

  it('does nothing when no saved scroll', () => {
    render(<ScrollRestorer />)
    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it('restores scroll and clears storage key', () => {
    sessionStorage.setItem('locale-switch-scroll', '600')
    render(<ScrollRestorer />)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 600, behavior: 'instant' })
    expect(sessionStorage.getItem('locale-switch-scroll')).toBeNull()
  })
})
