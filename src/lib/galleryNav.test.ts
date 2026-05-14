import { describe, it, expect } from 'vitest'
import { galleryNext, galleryPrev } from './galleryNav'

const TOTAL = 6

describe('galleryNext', () => {
  it('advances to the next photo', () => {
    expect(galleryNext(0, TOTAL)).toBe(1)
    expect(galleryNext(2, TOTAL)).toBe(3)
  })

  it('wraps from the last photo back to the first', () => {
    expect(galleryNext(5, TOTAL)).toBe(0)
  })

  it('works correctly for a gallery of one photo', () => {
    expect(galleryNext(0, 1)).toBe(0)
  })
})

describe('galleryPrev', () => {
  it('goes back to the previous photo', () => {
    expect(galleryPrev(3, TOTAL)).toBe(2)
    expect(galleryPrev(1, TOTAL)).toBe(0)
  })

  it('wraps from the first photo back to the last', () => {
    expect(galleryPrev(0, TOTAL)).toBe(5)
  })

  it('works correctly for a gallery of one photo', () => {
    expect(galleryPrev(0, 1)).toBe(0)
  })
})
