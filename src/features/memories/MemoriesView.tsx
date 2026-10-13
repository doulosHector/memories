import { useMemo, useState } from 'react'
import { EmptyState } from '../../components/ui'
import { useMemories } from '../../context/memories'
import { useUi } from '../../context/ui'
import { useToday } from '../../hooks/useToday'
import { matchesSearch, summarizeMemories } from '../../services/memories'
import { AddMemoryButton } from './components/AddMemoryButton'
import { ListToolbar } from './components/ListToolbar'
import { MemoryCard } from './components/MemoryCard'
import './memories.css'

export function MemoriesView() {
  const { state, actions, storageAvailable } = useMemories()
  const { openSheet } = useUi()
  const today = useToday()
  const [query, setQuery] = useState('')
  const { sortOrder } = state.settings

  const summaries = useMemo(
    () =>
      summarizeMemories(state.memories, today, sortOrder).filter(({ memory }) =>
        matchesSearch(memory, query),
      ),
    [state.memories, today, sortOrder, query],
  )

  const openDetail = (memoryId: string) =>
    openSheet({ type: 'memoryDetail', memoryId })

  const hasMemories = state.memories.length > 0

  return (
    <>
      {!storageAvailable && (
        <div className="notice">
          El almacenamiento no está disponible en esta vista: los eventos que
          agregues no se guardarán al recargar.
        </div>
      )}

      {hasMemories && (
        <ListToolbar
          query={query}
          onQueryChange={setQuery}
          sortOrder={sortOrder}
          onToggleSort={() =>
            actions.setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
          }
        />
      )}

      {!hasMemories ? (
        <EmptyState title="Aún no hay recuerdos">
          <p>
            Registra tu primer evento importante para empezar a contar el
            tiempo.
          </p>
        </EmptyState>
      ) : summaries.length === 0 ? (
        <EmptyState title="Sin resultados">
          <p>No hay recuerdos que coincidan con “{query.trim()}”.</p>
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
