import { createContext, type Dispatch } from 'react'
import type {
  MemoriesState,
  Memory,
  SortOrder,
  ThemePreference,
} from '../../types'
import { createId } from '../../utils/id'
import type { MemoriesAction, MemoryChanges } from './memoriesReducer'

export type NewMemory = Omit<Memory, 'id' | 'createdAt'>

export const createMemoriesActions = (dispatch: Dispatch<MemoriesAction>) => ({
  addMemory: (memory: NewMemory): void =>
    dispatch({
      type: 'memoryAdded',
      memory: { ...memory, id: createId(), createdAt: Date.now() },
    }),
  updateMemory: (id: string, changes: MemoryChanges): void =>
    dispatch({ type: 'memoryUpdated', id, changes }),
  deleteMemory: (id: string): void => dispatch({ type: 'memoryDeleted', id }),
  setTheme: (theme: ThemePreference): void =>
    dispatch({ type: 'themeChanged', theme }),
  setSortOrder: (sortOrder: SortOrder): void =>
    dispatch({ type: 'sortOrderChanged', sortOrder }),
})

export type MemoriesActions = ReturnType<typeof createMemoriesActions>

export interface MemoriesContextValue {
  state: MemoriesState
  actions: MemoriesActions
  /** False when data cannot be persisted and is lost on reload. */
  storageAvailable: boolean
}

export const MemoriesContext = createContext<MemoriesContextValue | null>(null)
