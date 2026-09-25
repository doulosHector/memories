import { happensToday, type MemorySummary } from '../../../services/memories'
import { formatDays, formatElapsed } from '../../../utils/format'
import { cx } from '../../../utils/style'
import { MemoryThumb } from './MemoryThumb'

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
  const { memory, isFuture, daysUntil } = summary
  const isAnniversary = daysUntil === 0

  return (
    <button className="event-card" onClick={() => onOpen(memory.id)}>
      <MemoryThumb memory={memory} />
      <span className="event-info">
        <span className="event-name">{memory.name}</span>
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
