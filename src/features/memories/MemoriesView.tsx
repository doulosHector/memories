import { useMemo } from 'react'
import { EmptyState } from '../../components/ui'
import { useMemories } from '../../context/memories'
import { useUi } from '../../context/ui'
import { useToday } from '../../hooks/useToday'
import { summarizeMemories } from '../../services/memories'
import { AddMemoryButton } from './components/AddMemoryButton'
import { MemoryCard } from './components/MemoryCard'
import './memories.css'

export function MemoriesView() {
  const { state, storageAvailable } = useMemories()
  const { openSheet } = useUi()
  const today = useToday()

  const summaries = useMemo(
    () => summarizeMemories(state.memories, today),
    [state.memories, today],
  )

  const openDetail = (memoryId: string) =>
    openSheet({ type: 'memoryDetail', memoryId })

  return (
    <>
      {!storageAvailable && (
        <div className="notice">
          El almacenamiento no está disponible en esta vista: los eventos que
          agregues no se guardarán al recargar.
        </div>
      )}

      {summaries.length === 0 ? (
        <EmptyState title="Aún no hay recuerdos">
          <p>
            Registra tu primer evento importante para empezar a contar el
            tiempo.
          </p>
        </EmptyState>
      ) : (
        <div className="event-list">
          {summaries.map((summary) => (
            <MemoryCard
              key={summary.memory.id}
              summary={summary}
              onOpen={openDetail}
            />
          ))}
        </div>
      )}

      <AddMemoryButton />
    </>
  )
}
