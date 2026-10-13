import type { MemoriesState } from '../types'

export const createDefaultState = (): MemoriesState => ({
  memories: [],
  settings: { theme: 'system', sortOrder: 'newest' },
})
