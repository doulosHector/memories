import { useContext } from 'react'
import { MemoriesContext, type MemoriesContextValue } from './MemoriesContext'

export function useMemories(): MemoriesContextValue {
  const context = useContext(MemoriesContext)
  if (!context)
    throw new Error('useMemories must be used within MemoriesProvider')
  return context
}
