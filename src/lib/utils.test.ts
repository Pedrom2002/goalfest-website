import { describe, it, expect } from 'vitest'
import { formatMatchDate } from './utils'

describe('formatMatchDate', () => {
  it('converts UTC time to Europe/Lisbon (UTC+1 in summer)', () => {
    // 17:00 UTC = 18:00 Lisbon (WEST, UTC+1 during summer)
    const result = formatMatchDate('2026-06-17T17:00:00Z', 'pt')
    expect(result).toContain('18:00')
  })

  it('applies Europe/Lisbon timezone in winter (UTC+0)', () => {
    // 20:00 UTC = 20:00 Lisbon (WET, UTC+0 during winter)
    const result = formatMatchDate('2026-01-15T20:00:00Z', 'pt')
    expect(result).toContain('20:00')
  })

  it('produces different output for pt and en locales', () => {
    const pt = formatMatchDate('2026-06-17T17:00:00Z', 'pt')
    const en = formatMatchDate('2026-06-17T17:00:00Z', 'en')
    expect(pt).not.toBe(en)
  })

  it('includes the day number in the output', () => {
    // 17 June 2026
    const result = formatMatchDate('2026-06-17T17:00:00Z', 'en')
    expect(result).toContain('17')
  })

  it('reflects the correct month so June and July produce different output', () => {
    const june = formatMatchDate('2026-06-17T17:00:00Z', 'en')
    const july = formatMatchDate('2026-07-17T17:00:00Z', 'en')
    expect(june).not.toBe(july)
  })

  it('returns empty string for invalid date input', () => {
    expect(formatMatchDate('not-a-date', 'pt')).toBe('')
  })
})
