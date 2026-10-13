import { describe, expect, it } from 'vitest'
import { canKeepOriginal, fitWithin } from './image'

describe('fitWithin', () => {
  it('scales the longest side down to 1600px, keeping the proportions', () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 1600, height: 1200 })
    expect(fitWithin(1000, 3200)).toEqual({ width: 500, height: 1600 })
  })

  it('never scales small images up', () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 })
  })
})

describe('canKeepOriginal', () => {
  const photo = { type: 'image/jpeg', size: 900_000, width: 1600, height: 1200 }

  it('keeps JPEGs that already fit', () => {
    expect(canKeepOriginal(photo)).toBe(true)
  })

  it('re-encodes big, heavy or non-JPEG images', () => {
    expect(canKeepOriginal({ ...photo, width: 4032 })).toBe(false)
    expect(canKeepOriginal({ ...photo, size: 5_000_000 })).toBe(false)
    expect(canKeepOriginal({ ...photo, type: 'image/png' })).toBe(false)
  })
})
