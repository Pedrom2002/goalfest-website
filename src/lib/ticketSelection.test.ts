import { describe, it, expect } from 'vitest'
import { toggleMatch } from './ticketSelection'

describe('toggleMatch', () => {
  it('adds a match id to an empty selection', () => {
    expect(toggleMatch([], 'match-1')).toEqual(['match-1'])
  })

  it('adds a match id to a non-empty selection', () => {
    expect(toggleMatch(['match-1'], 'match-2')).toEqual(['match-1', 'match-2'])
  })

  it('removes a match id that is already selected', () => {
    expect(toggleMatch(['match-1', 'match-2'], 'match-1')).toEqual(['match-2'])
  })

  it('preserves order of remaining items when deselecting', () => {
    expect(toggleMatch(['a', 'b', 'c'], 'b')).toEqual(['a', 'c'])
  })

  it('deselects the only match in the selection, leaving it empty', () => {
    expect(toggleMatch(['match-1'], 'match-1')).toEqual([])
  })

  it('handles toggling multiple distinct matches in sequence', () => {
    let sel: string[] = []
    sel = toggleMatch(sel, 'a')
    sel = toggleMatch(sel, 'b')
    sel = toggleMatch(sel, 'c')
    expect(sel).toEqual(['a', 'b', 'c'])
    sel = toggleMatch(sel, 'b')
    expect(sel).toEqual(['a', 'c'])
  })
})
