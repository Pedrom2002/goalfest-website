import { describe, it, expect } from 'vitest'
import { toCsv } from '@/lib/csv'
import { buildFestivalIcs } from '@/lib/ics'
import { isValidInviteCode, generateInviteCode, INVITE_CODE_RE } from '@/lib/invite-code'
import { LIMITS, MAX_BODY_BYTES, UPSTASH_TIMEOUT_MS } from '@/lib/limits'
import { getEnv } from '@/lib/env'

// ── csv ──────────────────────────────────────────────────────────────────────

describe('toCsv', () => {
  it('produces header + data rows', () => {
    const rows = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]
    const csv = toCsv(rows, ['name', 'age'])
    const lines = csv.split('\r\n')
    expect(lines[0]).toBe('name,age')
    expect(lines[1]).toBe('Alice,30')
    expect(lines[2]).toBe('Bob,25')
  })

  it('escapes values containing commas', () => {
    const rows = [{ v: 'a,b' }]
    expect(toCsv(rows, ['v'])).toContain('"a,b"')
  })

  it('escapes values containing double quotes', () => {
    const rows = [{ v: 'say "hi"' }]
    expect(toCsv(rows, ['v'])).toContain('"say ""hi"""')
  })

  it('handles null and undefined as empty string', () => {
    const rows = [{ a: null, b: undefined }]
    const csv = toCsv(rows as Record<string, unknown>[], ['a', 'b'])
    expect(csv.split('\r\n')[1]).toBe(',')
  })
})

// ── ics ───────────────────────────────────────────────────────────────────────

describe('buildFestivalIcs', () => {
  it('returns a VCALENDAR string', () => {
    const ics = buildFestivalIcs('Alice')
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('END:VCALENDAR')
  })

  it('includes VEVENT block', () => {
    const ics = buildFestivalIcs('Alice')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
  })

  it('includes the guest name in DESCRIPTION', () => {
    const ics = buildFestivalIcs('Pedro')
    expect(ics).toContain('Pedro')
  })

  it('uses CRLF line endings', () => {
    const ics = buildFestivalIcs('Alice')
    expect(ics).toContain('\r\n')
  })
})

// ── invite-code ───────────────────────────────────────────────────────────────

describe('isValidInviteCode', () => {
  it('accepts a valid 12-char code', () => {
    expect(isValidInviteCode('ABCDEF012345')).toBe(true)
  })

  it('rejects codes that are too short', () => {
    expect(isValidInviteCode('SHORT')).toBe(false)
  })

  it('rejects codes with disallowed chars (I, L, O, U)', () => {
    expect(isValidInviteCode('IIIIIIIIIIII')).toBe(false)
    expect(isValidInviteCode('LLLLLLLLLLLL')).toBe(false)
  })

  it('rejects non-string values', () => {
    expect(isValidInviteCode(123)).toBe(false)
    expect(isValidInviteCode(null)).toBe(false)
  })
})

describe('generateInviteCode', () => {
  it('generates a 12-char string matching the alphabet', () => {
    const code = generateInviteCode()
    expect(code).toHaveLength(12)
    expect(INVITE_CODE_RE.test(code)).toBe(true)
  })

  it('generates unique codes', () => {
    const codes = new Set(Array.from({ length: 20 }, generateInviteCode))
    expect(codes.size).toBe(20)
  })
})

// ── limits ────────────────────────────────────────────────────────────────────

describe('LIMITS', () => {
  it('defines rsvp rate limits', () => {
    expect(LIMITS.rsvp.perIp.max).toBeGreaterThan(0)
    expect(LIMITS.rsvp.perIp.windowMs).toBeGreaterThan(0)
  })

  it('defines signin rate limits', () => {
    expect(LIMITS.signin.perIp.max).toBeGreaterThan(0)
  })
})

describe('MAX_BODY_BYTES', () => {
  it('is a positive number', () => {
    expect(MAX_BODY_BYTES).toBeGreaterThan(0)
  })
})

describe('UPSTASH_TIMEOUT_MS', () => {
  it('is a positive number', () => {
    expect(UPSTASH_TIMEOUT_MS).toBeGreaterThan(0)
  })
})

// ── env ───────────────────────────────────────────────────────────────────────

describe('getEnv', () => {
  it('returns an object with expected keys', () => {
    const env = getEnv()
    expect(env).toHaveProperty('NEXT_PUBLIC_VIDEO_HERO')
    expect(env).toHaveProperty('NEXT_PUBLIC_MODEL_VENUE')
    expect(env).toHaveProperty('NEXT_PUBLIC_ENV_VENUE')
    expect(env).toHaveProperty('NEXT_PUBLIC_VIDEO_VENUE')
    expect(env).toHaveProperty('NEXT_PUBLIC_MAPBOX_TOKEN')
  })

  it('returns strings for all values', () => {
    const env = getEnv()
    for (const val of Object.values(env)) {
      expect(typeof val).toBe('string')
    }
  })
})
