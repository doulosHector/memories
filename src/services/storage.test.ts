import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fakeStorage, memoriesState, memory } from '../test/factories'
import {
  STORAGE_KEY,
  isStorageAvailable,
  loadState,
  normalizeState,
  saveState,
} from './storage'

describe('normalizeState', () => {
  it('rejects unrecognizable data', () => {
    expect(normalizeState(null)).toBeNull()
    expect(normalizeState('text')).toBeNull()
    expect(normalizeState({ events: [] })).toBeNull()
  })

  it('keeps valid memories as they are', () => {
    const state = memoriesState({
      memories: [
        memory({
          id: 'a',
          photoId: 'p1',
          photoFocus: { x: 20, y: 80 },
          description: 'Hola',
        }),
      ],
      settings: { theme: 'dark', sortOrder: 'oldest' },
    })
    expect(normalizeState(JSON.parse(JSON.stringify(state)))).toEqual(state)
  })

  it('drops memories without id or with an invalid date', () => {
    const state = normalizeState({
      memories: [
        { name: 'Sin id', date: '2020-01-01' },
        { id: 'bad-date', name: 'X', date: '2023-02-30' },
        { id: 'ok', name: 'Boda', date: '2020-01-01' },
        'not an object',
      ],
    })
    expect(state?.memories.map((m) => m.id)).toEqual(['ok'])
  })

  it('repairs optional and malformed fields', () => {
    const state = normalizeState({
      memories: [
        {
          id: 'a',
          name: '   ',
          date: '2020-01-01',
          description: 42,
          photoId: '',
          photoFocus: { x: 'left' },
          createdAt: 'yesterday',
        },
      ],
      settings: { theme: 'sepia', sortOrder: 'random' },
    })
    expect(state).toEqual({
      memories: [
        {
          id: 'a',
          name: 'Sin nombre',
          date: '2020-01-01',
          description: '',
          photoId: null,
          photoFocus: { x: 50, y: 50 },
          createdAt: 0,
        },
      ],
      settings: { theme: 'system', sortOrder: 'newest' },
    })
  })

  it('trims the name and enforces the form length limits', () => {
    const state = normalizeState({
      memories: [
        {
          id: 'a',
          name: `  ${'n'.repeat(100)}  `,
          date: '2020-01-01',
          description: 'd'.repeat(1200),
        },
      ],
    })
    expect(state?.memories[0].name).toHaveLength(80)
    expect(state?.memories[0].description).toHaveLength(1000)
  })

  it('keeps only the first memory for a repeated id', () => {
    const state = normalizeState({
      memories: [
        { id: 'a', name: 'Primero', date: '2020-01-01' },
        { id: 'a', name: 'Segundo', date: '2021-01-01' },
      ],
    })
    expect(state?.memories.map((m) => m.name)).toEqual(['Primero'])
  })
})

describe('loadState / saveState', () => {
  beforeEach(() => vi.stubGlobal('localStorage', fakeStorage()))
  afterEach(() => vi.unstubAllGlobals())

  it('starts empty when nothing is stored', () => {
    expect(loadState()).toEqual(memoriesState())
  })

  it('round-trips the saved state', () => {
    const state = memoriesState({ memories: [memory({ id: 'a' })] })
    expect(saveState(state)).toBe(true)
    expect(loadState()).toEqual(state)
  })

  it('starts empty when the stored data is corrupted', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadState()).toEqual(memoriesState())
  })

  it('reports when storage is not writable', () => {
    const storage = fakeStorage()
    storage.setItem = () => {
      throw new DOMException('full', 'QuotaExceededError')
    }
    vi.stubGlobal('localStorage', storage)
    expect(saveState(memoriesState())).toBe(false)
    expect(isStorageAvailable()).toBe(false)
  })

  it('detects available storage', () => {
    expect(isStorageAvailable()).toBe(true)
    expect(localStorage.length).toBe(0)
  })
})
