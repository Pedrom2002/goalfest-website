import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { calcTimeLeft, TARGET, type TimeLeft } from './countdown'

describe('calcTimeLeft', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "started" when called after the target date', () => {
    vi.setSystemTime(new Date(TARGET.getTime() + 60_000))
    expect(calcTimeLeft()).toBe('started')
  })

  it('returns "started" exactly at the target moment', () => {
    vi.setSystemTime(TARGET)
    expect(calcTimeLeft()).toBe('started')
  })

  it('returns the correct number of whole days remaining', () => {
    const tenDaysBefore = new Date(TARGET.getTime() - 10 * 24 * 60 * 60 * 1000)
    vi.setSystemTime(tenDaysBefore)
    const { days, hours, minutes, seconds } = calcTimeLeft() as TimeLeft
    expect(days).toBe(10)
    expect(hours).toBe(0)
    expect(minutes).toBe(0)
    expect(seconds).toBe(0)
  })

  it('decomposes the remaining time into days, hours, minutes and seconds', () => {
    const diff = (2 * 24 * 60 * 60 + 3 * 60 * 60 + 4 * 60 + 5) * 1000
    vi.setSystemTime(new Date(TARGET.getTime() - diff))
    expect(calcTimeLeft()).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 })
  })

  it('hours field never exceeds 23 (25 hours → 1 day + 1 hour)', () => {
    vi.setSystemTime(new Date(TARGET.getTime() - 25 * 60 * 60 * 1000))
    const { days, hours } = calcTimeLeft() as TimeLeft
    expect(days).toBe(1)
    expect(hours).toBe(1)
  })

  it('minutes field never exceeds 59 (61 minutes → 1 hour + 1 minute)', () => {
    vi.setSystemTime(new Date(TARGET.getTime() - 61 * 60 * 1000))
    const { hours, minutes } = calcTimeLeft() as TimeLeft
    expect(hours).toBe(1)
    expect(minutes).toBe(1)
  })

  it('seconds field never exceeds 59 (61 seconds → 1 minute + 1 second)', () => {
    vi.setSystemTime(new Date(TARGET.getTime() - 61 * 1000))
    const { minutes, seconds } = calcTimeLeft() as TimeLeft
    expect(minutes).toBe(1)
    expect(seconds).toBe(1)
  })
})
