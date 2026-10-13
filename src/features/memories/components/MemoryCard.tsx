import { usePhotoUrl } from '../../../hooks/usePhotoUrl'
import { happensToday, type MemorySummary } from '../../../services/memories'
import {
  formatDays,
  formatElapsed,
  formatLongDate,
} from '../../../utils/format'
import { objectPosition } from '../../../utils/photoFocus'
import { cx } from '../../../utils/style'

interface MemoryCardProps {
  summary: MemorySummary
  onOpen: (memoryId: string) => void
}

function ElapsedLine({ summary }: { summary: MemorySummary }) {
  if (summary.isFuture) {
    return (
      <>
        Ocurrirá en <strong>{formatDays(summary.daysUntil)}</strong>
      </>
    )
  }
  if (happensToday(summary)) return <strong>¡Es hoy!</strong>
  return (
    <>
      Hace <strong>{formatElapsed(summary.elapsed!)}</strong>
    </>
  )
}

export function MemoryCard({ summary, onOpen }: MemoryCardProps) {
  const { memory, date, isFuture, daysUntil } = summary
  const isAnniversary = daysUntil === 0
  const hasPhoto = memory.photoId !== null
  const photoUrl = usePhotoUrl(memory.photoId)

  return (
    <button
      className={cx('event-card', hasPhoto && 'has-photo')}
      onClick={() => onOpen(memory.id)}
    >
      {hasPhoto && (
        <span className="event-photo">
          {photoUrl && (
            <img
              src={photoUrl}
              alt=""
              loading="lazy"
              style={{ objectPosition: objectPosition(memory.photoFocus) }}
            />
          )}
        </span>
      )}
      <span className="event-info">
        <span className="event-name">{memory.name}</span>
        <span className="event-date">{formatLongDate(date)}</span>
        <span className="event-elapsed">
          <ElapsedLine summary={summary} />
        </span>
        {!isFuture && (
          <span className={cx('event-anniv', isAnniversary && 'today')}>
            {isAnniversary
              ? '🎉 ¡Hoy es el aniversario!'
              : `Aniversario en ${formatDays(daysUntil)}`}
          </span>
        )}
      </span>
    </button>
  )
}
