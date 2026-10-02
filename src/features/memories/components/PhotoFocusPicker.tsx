import { useId, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import type { PhotoFocus } from '../../../types'
import {
  focusAtPoint,
  moveFocus,
  objectPosition,
} from '../../../utils/photoFocus'
import './photo-focus-picker.css'

const KEY_STEPS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

interface PhotoFocusPickerProps {
  src: string
  alt: string
  focus: PhotoFocus
  onChange: (focus: PhotoFocus) => void
}

/**
 * Shows the whole photo with a marker the user drags to the part that must
 * stay visible, plus previews of how the card and the detail view crop it.
 */
export function PhotoFocusPicker({
  src,
  alt,
  focus,
  onChange,
}: PhotoFocusPickerProps) {
  const image = useRef<HTMLImageElement>(null)
  const dragging = useRef(false)
  const hintId = useId()
  const position = objectPosition(focus)

  const focusAt = (event: PointerEvent) => {
    const box = image.current?.getBoundingClientRect()
    if (box) onChange(focusAtPoint(box, event.clientX, event.clientY))
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragging.current = true
    focusAt(event)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const step = KEY_STEPS[event.key]
    if (!step) return
    event.preventDefault()
    const size = event.shiftKey ? 10 : 2
    onChange(moveFocus(focus, step[0] * size, step[1] * size))
  }

  return (
    <div className="focus-picker">
      <div
        className="focus-frame"
        tabIndex={0}
        aria-label={`Centro de la foto: ${focus.x}% horizontal, ${focus.y}% vertical`}
        aria-describedby={hintId}
        onPointerDown={handlePointerDown}
        onPointerMove={(event) => dragging.current && focusAt(event)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={handleKeyDown}
      >
        <img ref={image} src={src} alt={alt} draggable={false} />
        <span
          className="focus-marker"
          style={{ left: `${focus.x}%`, top: `${focus.y}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="focus-hint" id={hintId}>
        Arrastra el punto a la parte más importante de la foto.
      </p>
      <div className="focus-previews" aria-hidden="true">
        <figure>
          <div className="focus-preview card">
            <img src={src} alt="" style={{ objectPosition: position }} />
          </div>
          <figcaption>Tarjeta</figcaption>
        </figure>
        <figure>
          <div className="focus-preview detail">
            <img src={src} alt="" style={{ objectPosition: position }} />
          </div>
          <figcaption>Detalle</figcaption>
        </figure>
      </div>
    </div>
  )
}
