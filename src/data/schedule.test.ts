import { describe, it, expect } from 'vitest'
import { SCHEDULE } from './schedule'

describe('SCHEDULE data integrity', () => {
  it('covers 34 match days (June 11 through July 19 2026)', () => {
    expect(SCHEDULE).toHaveLength(34)
  })

  it('starts on the tournament opening day (2026-06-11)', () => {
    expect(SCHEDULE[0]?.date).toBe('2026-06-11')
  })

  it('ends on the final day (2026-07-19)', () => {
    expect(SCHEDULE[SCHEDULE.length - 1]?.date).toBe('2026-07-19')
  })

  it('all date strings parse to valid Date objects', () => {
    SCHEDULE.forEach((day) => {
      expect(new Date(day.date).toString()).not.toBe('Invalid Date')
    })
  })

  it('dates are in strictly ascending chronological order', () => {
    for (let i = 1; i < SCHEDULE.length; i++) {
      const prev = new Date(SCHEDULE[i - 1]?.date ?? '').getTime()
      const curr = new Date(SCHEDULE[i]?.date ?? '').getTime()
      expect(curr).toBeGreaterThan(prev)
    }
  })

  it('every day has at least one match', () => {
    SCHEDULE.forEach((day) => {
      expect(day.matches.length).toBeGreaterThan(0)
    })
  })

  it('every match has a non-empty time field', () => {
    SCHEDULE.forEach((day) => {
      day.matches.forEach((match) => {
        expect(match.time.trim()).not.toBe('')
      })
    })
  })

  it('group stage ends on 2026-06-27 (last known-teams day)', () => {
    const LAST_GROUP_DATE = '2026-06-27'
    const groupDays = SCHEDULE.filter(
      (d) => new Date(d.date) <= new Date(LAST_GROUP_DATE)
    )
    expect(groupDays[groupDays.length - 1]?.date).toBe(LAST_GROUP_DATE)
  })

  it('displayDate is a non-empty string for every day', () => {
    SCHEDULE.forEach((day) => {
      expect(day.displayDate.trim()).not.toBe('')
    })
  })
})
