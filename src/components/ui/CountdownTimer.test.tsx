// @vitest-environment jsdom
import React from 'react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, act, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

vi.mock('@/lib/countdown', () => ({
  calcTimeLeft: vi.fn(),
}))

import CountdownTimer from './CountdownTimer'
import { calcTimeLeft } from '@/lib/countdown'

const mockCalcTimeLeft = vi.mocked(calcTimeLeft)

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockCalcTimeLeft.mockReturnValue({ days: 25, hours: 3, minutes: 10, seconds: 5 })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('renders time values from calcTimeLeft', async () => {
    let container!: HTMLElement
    await act(async () => {
      ;({ container } = render(<CountdownTimer />))
    })
    expect(container.textContent).toContain('25')
    expect(container.textContent).toContain('03')
    expect(container.textContent).toContain('05')
  })

  it('shows started state when event has begun', async () => {
    mockCalcTimeLeft.mockReturnValue('started')
    await act(async () => {
      render(<CountdownTimer />)
    })
    expect(screen.getByText('countdown_live')).toBeInTheDocument()
  })

  it('cleans up interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const { unmount } = render(<CountdownTimer />)
    await act(async () => {})
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('updates state on every tick', async () => {
    mockCalcTimeLeft
      .mockReturnValueOnce({ days: 1, hours: 0, minutes: 0, seconds: 30 })
      .mockReturnValue({ days: 1, hours: 0, minutes: 0, seconds: 29 })

    const { container } = render(<CountdownTimer />)
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(container.textContent).toContain('29')
  })
})
