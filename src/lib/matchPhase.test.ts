import { describe, it, expect } from 'vitest'
import { phaseOf, phaseLabel } from './matchPhase'

describe('phaseOf', () => {
  it('classifies dates on or before 2026-06-27 as "group"', () => {
    expect(phaseOf('2026-06-11')).toBe('group')
    expect(phaseOf('2026-06-27')).toBe('group') // inclusive boundary
  })

  it('classifies dates after 2026-06-27 as "knockout"', () => {
    expect(phaseOf('2026-06-28')).toBe('knockout')
    expect(phaseOf('2026-07-19')).toBe('knockout')
  })

  it('boundary is exclusive on 2026-06-28 (first knockout day)', () => {
    expect(phaseOf('2026-06-27')).toBe('group')
    expect(phaseOf('2026-06-28')).toBe('knockout')
  })
})

describe('phaseLabel', () => {
  describe('Group Stage (up to 2026-06-27)', () => {
    it('returns Portuguese label', () => {
      expect(phaseLabel('2026-06-17', 'pt')).toBe('Fase de Grupos')
    })

    it('returns English label', () => {
      expect(phaseLabel('2026-06-17', 'en')).toBe('Group Stage')
    })

    it('boundary date 2026-06-27 is still Group Stage', () => {
      expect(phaseLabel('2026-06-27', 'pt')).toBe('Fase de Grupos')
      expect(phaseLabel('2026-06-27', 'en')).toBe('Group Stage')
    })
  })

  describe('Round of 16 (2026-06-28 to 2026-07-07)', () => {
    it('returns Portuguese label', () => {
      expect(phaseLabel('2026-07-01', 'pt')).toBe('Oitavos de Final')
    })

    it('returns English label', () => {
      expect(phaseLabel('2026-07-01', 'en')).toBe('Round of 16')
    })

    it('boundary date 2026-07-07 is still Round of 16', () => {
      expect(phaseLabel('2026-07-07', 'pt')).toBe('Oitavos de Final')
      expect(phaseLabel('2026-07-07', 'en')).toBe('Round of 16')
    })
  })

  describe('Quarter-Finals (2026-07-08 to 2026-07-11)', () => {
    it('returns Portuguese label', () => {
      expect(phaseLabel('2026-07-09', 'pt')).toBe('Quartos de Final')
    })

    it('returns English label', () => {
      expect(phaseLabel('2026-07-11', 'en')).toBe('Quarter-Finals')
    })

    it('boundary date 2026-07-11 is still Quarter-Finals', () => {
      expect(phaseLabel('2026-07-11', 'pt')).toBe('Quartos de Final')
    })
  })

  describe('Semi-Finals (2026-07-12 to 2026-07-15)', () => {
    it('returns Portuguese label', () => {
      expect(phaseLabel('2026-07-14', 'pt')).toBe('Meias-Finais')
    })

    it('returns English label', () => {
      expect(phaseLabel('2026-07-15', 'en')).toBe('Semi-Finals')
    })

    it('boundary date 2026-07-15 is still Semi-Finals', () => {
      expect(phaseLabel('2026-07-15', 'pt')).toBe('Meias-Finais')
    })
  })

  describe('Final (after 2026-07-15)', () => {
    it('returns "Final" label in Portuguese', () => {
      expect(phaseLabel('2026-07-19', 'pt')).toBe('Final')
    })

    it('returns "Final" label in English', () => {
      expect(phaseLabel('2026-07-19', 'en')).toBe('Final')
    })
  })
})
