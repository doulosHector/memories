import type { MemoriesState, Memory } from '../types'

export const memory = (overrides: Partial<Memory> = {}): Memory => ({
  id: `mem-${Math.random().toString(36).slice(2)}`,
  name: 'Nuestro aniversario',
  date: '2020-06-15',
  description: '',
  photoId: null,
  photoFocus: { x: 50, y: 50 },
  createdAt: 1,
  ...overrides,
})

export const memoriesState = (
  overrides: Partial<MemoriesState> = {},
): MemoriesState => ({
  memories: [],
  settings: { theme: 'system' },
  ...overrides,
})

/** Minimal in-memory `Storage` for tests that run in Node. */
export const fakeStorage = (initial: Record<string, string> = {}): Storage => {
  const data = new Map(Object.entries(initial))
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  }
}
