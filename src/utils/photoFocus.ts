import type { PhotoFocus } from '../types'

/** Center of the photo: the crop keeps the middle visible. */
export const DEFAULT_PHOTO_FOCUS: PhotoFocus = { x: 50, y: 50 }

const clampPercent = (value: number) =>
  Math.round(Math.min(100, Math.max(0, value)))

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

/** Validates untrusted data; anything unusable becomes the center. */
export const toPhotoFocus = (raw: unknown): PhotoFocus => {
  if (typeof raw !== 'object' || raw === null) return DEFAULT_PHOTO_FOCUS
  const { x, y } = raw as Record<string, unknown>
  if (!isFiniteNumber(x) || !isFiniteNumber(y)) return DEFAULT_PHOTO_FOCUS
  return { x: clampPercent(x), y: clampPercent(y) }
}

interface Box {
  left: number
  top: number
  width: number
  height: number
}

/** Focus at a pointer position over the rendered photo (`box`). */
export const focusAtPoint = (
  box: Box,
  clientX: number,
  clientY: number,
): PhotoFocus => {
  if (box.width <= 0 || box.height <= 0) return DEFAULT_PHOTO_FOCUS
  return {
    x: clampPercent(((clientX - box.left) / box.width) * 100),
    y: clampPercent(((clientY - box.top) / box.height) * 100),
  }
}

/** Moves the focus by percentage points (keyboard arrows). */
export const moveFocus = (
  focus: PhotoFocus,
  dx: number,
  dy: number,
): PhotoFocus => ({
  x: clampPercent(focus.x + dx),
  y: clampPercent(focus.y + dy),
})

/**
 * CSS `object-position` for a cropped (`object-fit: cover`) photo. The focus
 * point keeps the same relative place in the frame, so it is always visible.
 */
export const objectPosition = ({ x, y }: PhotoFocus) => `${x}% ${y}%`
