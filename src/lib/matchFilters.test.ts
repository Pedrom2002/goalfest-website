import { describe, it, expect } from 'vitest'
import { applyFilter } from './matchFilters'
import type { Match } from '@/types'

const makeMatch = (overrides: Partial<Match> & { id: string }): Match => ({
  home: { name: 'França', nameEn: 'France', flag: '🇫🇷' },
  away: { name: 'Brasil', nameEn: 'Brazil', flag: '🇧🇷' },
  date: '2026-06-16T19:00:00Z',
  phase: 'grupo',
  status: 'upcoming',
  ...overrides,
})

const portugal = makeMatch({
  id: 'pt-home',
  home: { name: 'Portugal', nameEn: 'Portugal', flag: '🇵🇹' },
})

const portugalAway = makeMatch({
  id: 'pt-away',
  away: { name: 'Portugal', nameEn: 'Portugal', flag: '🇵🇹' },
})

const groupMatch = makeMatch({ id: 'g-1' })

const knockoutMatch = makeMatch({
  id: 'k-1',
  date: '2026-07-01T19:00:00Z',
  phase: 'oitavos',
})

const allMatches = [portugal, groupMatch, knockoutMatch, portugalAway]

describe('applyFilter', () => {
  describe('"all"', () => {
    it('returns every match unchanged', () => {
      expect(applyFilter(allMatches, 'all')).toEqual(allMatches)
    })

    it('returns an empty array when given no matches', () => {
      expect(applyFilter([], 'all')).toEqual([])
    })
  })

  describe('"grupos"', () => {
    it('returns only matches in the group phase', () => {
      const result = applyFilter(allMatches, 'grupos')
      expect(result.every((m) => m.phase === 'grupo')).toBe(true)
    })

    it('excludes knockout-phase matches', () => {
      const result = applyFilter(allMatches, 'grupos')
      expect(result.find((m) => m.id === 'k-1')).toBeUndefined()
    })

    it('returns an empty array when no group matches exist', () => {
      expect(applyFilter([knockoutMatch], 'grupos')).toEqual([])
    })
  })

  describe('"eliminatorias"', () => {
    it('returns matches in any non-group phase', () => {
      const result = applyFilter(allMatches, 'eliminatorias')
      expect(result.every((m) => m.phase !== 'grupo')).toBe(true)
    })

    it('excludes group-phase matches', () => {
      const result = applyFilter(allMatches, 'eliminatorias')
      expect(result.find((m) => m.id === 'g-1')).toBeUndefined()
    })

    it('returns an empty array when all matches are group phase', () => {
      expect(applyFilter([groupMatch], 'eliminatorias')).toEqual([])
    })
  })

  describe('"portugal"', () => {
    it('returns matches where Portugal is the home team', () => {
      expect(applyFilter([portugal, groupMatch], 'portugal')).toContain(portugal)
    })

    it('returns matches where Portugal is the away team', () => {
      expect(applyFilter([portugalAway, groupMatch], 'portugal')).toContain(
        portugalAway
      )
    })

    it('returns matches where Portugal appears on either side', () => {
      const result = applyFilter(allMatches, 'portugal')
      expect(result).toHaveLength(2)
      expect(result.map((m) => m.id)).toContain('pt-home')
      expect(result.map((m) => m.id)).toContain('pt-away')
    })

    it('filters by English name (nameEn), not the localised name', () => {
      const misleading = makeMatch({
        id: 'misleading',
        home: { name: 'Portugal', nameEn: 'Not Portugal', flag: '' },
      })
      expect(applyFilter([misleading], 'portugal')).toEqual([])
    })

    it('returns an empty array when Portugal is not in any match', () => {
      expect(applyFilter([groupMatch, knockoutMatch], 'portugal')).toEqual([])
    })
  })
})
