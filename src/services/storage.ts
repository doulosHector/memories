import type {
  MemoriesState,
  Memory,
  SortOrder,
  ThemePreference,
} from '../types'
import { isDateKey } from '../utils/date'
import { toPhotoFocus } from '../utils/photoFocus'
import { createDefaultState } from './defaults'

export const STORAGE_KEY = 'memories:v1'

/** Same limits as the form inputs. */
export const NAME_MAX_LENGTH = 80
export const DESCRIPTION_MAX_LENGTH = 1000

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const THEMES: readonly ThemePreference[] = ['system', 'light', 'dark']
const SORT_ORDERS: readonly SortOrder[] = ['newest', 'oldest']

const toMemory = (raw: unknown): Memory | null => {
  if (!isRecord(raw) || typeof raw.id !== 'string' || !raw.id) return null
  if (!isDateKey(raw.date)) return null
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  return {
    id: raw.id,
    // The original app showed "Sin nombre" for events without a name.
    name: (name || 'Sin nombre').slice(0, NAME_MAX_LENGTH),
    date: raw.date,
    description:
      typeof raw.description === 'string'
        ? raw.description.slice(0, DESCRIPTION_MAX_LENGTH)
        : '',
    photoId:
      typeof raw.photoId === 'string' && raw.photoId ? raw.photoId : null,
    photoFocus: toPhotoFocus(raw.photoFocus),
    createdAt:
      typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt)
        ? raw.createdAt
        : 0,
  }
}

const notNull = <T>(value: T | null): value is T => value !== null

/**
 * Validates untrusted data from localStorage into a `MemoriesState`.
 * Returns `null` when the shape is not recognizable at all.
 */
export const normalizeState = (raw: unknown): MemoriesState | null => {
  if (!isRecord(raw) || !Array.isArray(raw.memories)) return null
  const seen = new Set<string>()
  const memories = raw.memories
    .map(toMemory)
    .filter(notNull)
    .filter(({ id }) => {
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  const settings = isRecord(raw.settings) ? raw.settings : {}
  return {
    memories,
    settings: {
      theme: THEMES.includes(settings.theme as ThemePreference)
        ? (settings.theme as ThemePreference)
        : 'system',
      sortOrder: SORT_ORDERS.includes(settings.sortOrder as SortOrder)
        ? (settings.sortOrder as SortOrder)
        : 'newest',
    },
  }
}

/** False in views where localStorage is blocked (e.g. some private modes). */
export const isStorageAvailable = (): boolean => {
  try {
    const probe = `${STORAGE_KEY}:probe`
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

export const loadState = (): MemoriesState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const state = normalizeState(JSON.parse(raw))
      if (state) return state
    }
  } catch {
    // Corrupted data or storage not available: start fresh.
  }
  return createDefaultState()
}

/** Persists the state. Returns `false` if storage is full or unavailable. */
export const saveState = (state: MemoriesState): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
