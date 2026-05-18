// @vitest-environment jsdom
import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScrollToTop from './ScrollToTop'

describe('ScrollToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 })
    window.scrollTo = vi.fn()
  })

  it('does not render button when scrollY <= 400', () => {
    render(<ScrollToTop />)
    expect(screen.queryByRole('button', { name: /topo/i })).not.toBeInTheDocument()
  })

  it('renders button after scrolling past 400px', () => {
    render(<ScrollToTop />)
    act(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 401 })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(screen.getByRole('button', { name: /topo/i })).toBeInTheDocument()
  })

  it('calls scrollTo top on button click', async () => {
    const user = userEvent.setup()
    render(<ScrollToTop />)
    act(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 500 })
      window.dispatchEvent(new Event('scroll'))
    })
    await user.click(screen.getByRole('button', { name: /topo/i }))
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
