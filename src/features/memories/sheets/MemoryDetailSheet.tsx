import { useMemo } from 'react'
import { SHEET_TITLE_ID, SheetContent } from '../../../components/ui'
import { useMemories } from '../../../context/memories'
import { useToast } from '../../../context/toast'
import { useUi } from '../../../context/ui'
import { usePhotoUrl } from '../../../hooks/usePhotoUrl'
import { useToday } from '../../../hooks/useToday'
import { happensToday, summarizeMemory } from '../../../services/memories'
import { deletePhoto } from '../../../services/photoStore'
import type { Memory } from '../../../types'
import { elapsedParts, formatDays, formatLongDate } from '../../../utils/format'
import { objectPosition } from '../../../utils/photoFocus'
import './memory-detail.css'

function MemoryDetail({ memory }: { memory: Memory }) {
  const { actions } = useMemories()
  const { openSheet, closeSheet } = useUi()
  const { showToast } = useToast()
  const today = useToday()
  const photoUrl = usePhotoUrl(memory.photoId)
  const summary = useMemo(() => summarizeMemory(memory, today), [memory, today])
  const { date, isFuture, elapsed, daysUntil } = summary

  const handleDelete = () => {
    if (
      !confirm(`¿Eliminar "${memory.name}"? Esta acción no se puede deshacer.`)
    )
      return
    actions.deleteMemory(memory.id)
    if (memory.photoId) deletePhoto(memory.photoId).catch(() => {})
    closeSheet()
    showToast('Evento eliminado')
  }

  let untilLabel = 'Próximo aniversario en'
  if (isFuture) untilLabel = 'Ocurrirá en'
  else if (daysUntil === 0) untilLabel = 'Aniversario'

  return (
    <>
      {memory.photoId && (
        <div className="detail-photo">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={`Foto de ${memory.name}`}
              style={{ objectPosition: objectPosition(memory.photoFocus) }}
            />
          )}
        </div>
      )}
      <h2 className="detail-name" id={SHEET_TITLE_ID}>
        {memory.name}
      </h2>
      <div className="detail-date">{formatLongDate(date)}</div>
      <div className="stat-row">
        <div className="stat">
          {!elapsed ? (
            <>
              <div className="big">Aún no ocurre</div>
              <div className="cap">es una fecha futura</div>
            </>
          ) : happensToday(summary) ? (
            <div className="big">¡Es hoy!</div>
          ) : (
            <>
              <div className="label">Hace</div>
              <div className="big">
                {elapsedParts(elapsed).map((part) => (
                  <span className="row" key={part}>
                    {part}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="stat">
          <div className="label">{untilLabel}</div>
          <div className="big">
            {daysUntil === 0 ? '¡Hoy!' : formatDays(daysUntil)}
          </div>
        </div>
      </div>
      {memory.description && (
        <div className="detail-desc">{memory.description}</div>
      )}
      <div className="detail-actions">
        <button
          className="btn ghost"
          onClick={() => openSheet({ type: 'memoryForm', memoryId: memory.id })}
        >
          Editar
        </button>
        <button className="btn danger" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </>
  )
}

export function MemoryDetailSheet({ memoryId }: { memoryId: string }) {
  const { state } = useMemories()
  const { closeSheet } = useUi()
  const memory = state.memories.find(({ id }) => id === memoryId)

  return (
    <SheetContent compact onClose={closeSheet}>
      {memory && <MemoryDetail memory={memory} />}
    </SheetContent>
  )
}
