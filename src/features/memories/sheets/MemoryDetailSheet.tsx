import { useMemo } from 'react'
import { SHEET_TITLE_ID, SheetContent } from '../../../components/ui'
import { useMemories } from '../../../context/memories'
import { useToast } from '../../../context/toast'
import { useUi } from '../../../context/ui'
import { usePhotoUrl } from '../../../hooks/usePhotoUrl'
import { useToday } from '../../../hooks/useToday'
import { summarizeMemory } from '../../../services/memories'
import { deletePhoto } from '../../../services/photoStore'
import type { Memory } from '../../../types'
import {
  formatDays,
  formatElapsed,
  formatLongDate,
} from '../../../utils/format'
import './memory-detail.css'

function MemoryDetail({ memory }: { memory: Memory }) {
  const { actions } = useMemories()
  const { openSheet, closeSheet } = useUi()
  const { showToast } = useToast()
  const today = useToday()
  const photoUrl = usePhotoUrl(memory.photoId)
  const { date, isFuture, elapsed, daysUntil } = useMemo(
    () => summarizeMemory(memory, today),
    [memory, today],
  )

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

  let untilCaption = 'para el próximo aniversario'
  if (isFuture) untilCaption = 'para que ocurra'
  else if (daysUntil === 0) untilCaption = 'es el aniversario'

  return (
    <>
      {photoUrl && (
        <div className="detail-photo">
          <img src={photoUrl} alt={`Foto de ${memory.name}`} />
        </div>
      )}
      <h2 className="detail-name" id={SHEET_TITLE_ID}>
        {memory.name}
      </h2>
      <div className="detail-date">{formatLongDate(date)}</div>
      <div className="stat-row">
        <div className="stat">
          <div className="big">
            {elapsed ? formatElapsed(elapsed) : 'Aún no ocurre'}
          </div>
          <div className="cap">
            {isFuture ? 'es una fecha futura' : 'de tiempo transcurrido'}
          </div>
        </div>
        <div className="stat">
          <div className="big">
            {daysUntil === 0 ? '¡Hoy!' : formatDays(daysUntil)}
          </div>
          <div className="cap">{untilCaption}</div>
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
    <SheetContent onClose={closeSheet}>
      {memory && <MemoryDetail memory={memory} />}
    </SheetContent>
  )
}
