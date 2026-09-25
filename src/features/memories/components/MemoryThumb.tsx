import { usePhotoUrl } from '../../../hooks/usePhotoUrl'
import type { Memory } from '../../../types'
import { initialOf } from '../../../utils/format'

/** Square thumbnail: the memory's photo, or the first letter of its name. */
export function MemoryThumb({ memory }: { memory: Memory }) {
  const src = usePhotoUrl(memory.photoId)
  return (
    <span className="event-thumb">
      {src ? (
        <img src={src} alt="" loading="lazy" />
      ) : (
        <span className="thumb-blank" aria-hidden="true">
          {initialOf(memory.name)}
        </span>
      )}
    </span>
  )
}
