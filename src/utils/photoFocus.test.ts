import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PHOTO_FOCUS,
  focusAtPoint,
  moveFocus,
  objectPosition,
  toPhotoFocus,
} from './photoFocus'

describe('toPhotoFocus', () => {
  it('keeps valid values, rounded and clamped to 0–100', () => {
    expect(toPhotoFocus({ x: 12.4, y: 87.6 })).toEqual({ x: 12, y: 88 })
    expect(toPhotoFocus({ x: -20, y: 140 })).toEqual({ x: 0, y: 100 })
  })

  it('falls back to the center for missing or malformed data', () => {
    expect(toPhotoFocus(undefined)).toEqual(DEFAULT_PHOTO_FOCUS)
    expect(toPhotoFocus({ x: '10', y: 20 })).toEqual(DEFAULT_PHOTO_FOCUS)
    expect(toPhotoFocus({ x: Number.NaN, y: 20 })).toEqual(DEFAULT_PHOTO_FOCUS)
  })
})

describe('focusAtPoint', () => {
  const box = { left: 100, top: 50, width: 200, height: 100 }

  it('converts a pointer position to percentages of the photo', () => {
    expect(focusAtPoint(box, 150, 125)).toEqual({ x: 25, y: 75 })
  })

  it('clamps positions outside the photo while dragging', () => {
    expect(focusAtPoint(box, 0, 500)).toEqual({ x: 0, y: 100 })
  })

  it('returns the center for an image that is not rendered yet', () => {
    expect(focusAtPoint({ ...box, width: 0 }, 150, 125)).toEqual(
      DEFAULT_PHOTO_FOCUS,
    )
  })
})

describe('moveFocus', () => {
  it('moves and stays within the photo', () => {
    expect(moveFocus({ x: 50, y: 98 }, -10, 5)).toEqual({ x: 40, y: 100 })
  })
})

describe('objectPosition', () => {
  it('formats the focus as CSS', () => {
    expect(objectPosition({ x: 30, y: 70 })).toBe('30% 70%')
  })
})
