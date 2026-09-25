import type { MemoriesState, Memory, ThemePreference } from '../../types'

export type MemoryChanges = Partial<Omit<Memory, 'id' | 'createdAt'>>

export type MemoriesAction =
  | { type: 'memoryAdded'; memory: Memory }
  | { type: 'memoryUpdated'; id: string; changes: MemoryChanges }
  | { type: 'memoryDeleted'; id: string }
  | { type: 'themeChanged'; theme: ThemePreference }

export function memoriesReducer(
  state: MemoriesState,
  action: MemoriesAction,
): MemoriesState {
  switch (action.type) {
    case 'memoryAdded':
      return { ...state, memories: [...state.memories, action.memory] }
    case 'memoryUpdated':
      return {
        ...state,
        memories: state.memories.map((memory) =>
          memory.id === action.id ? { ...memory, ...action.changes } : memory,
        ),
      }
    case 'memoryDeleted':
      return {
        ...state,
        memories: state.memories.filter((memory) => memory.id !== action.id),
      }
    case 'themeChanged':
      return { ...state, settings: { ...state.settings, theme: action.theme } }
  }
}
