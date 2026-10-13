import { describe, expect, it } from 'vitest'
import { memoriesState, memory } from '../../test/factories'
import { memoriesReducer } from './memoriesReducer'

describe('memoriesReducer', () => {
  it('adds a memory at the end', () => {
    const first = memory({ id: 'a' })
    const added = memory({ id: 'b' })
    const state = memoriesReducer(memoriesState({ memories: [first] }), {
      type: 'memoryAdded',
      memory: added,
    })
    expect(state.memories).toEqual([first, added])
  })

  it('updates only the matching memory, without mutating', () => {
    const a = memory({ id: 'a', name: 'Viejo' })
    const b = memory({ id: 'b' })
    const before = memoriesState({ memories: [a, b] })
    const after = memoriesReducer(before, {
      type: 'memoryUpdated',
      id: 'a',
      changes: { name: 'Nuevo', photoId: 'p1' },
    })
    expect(after.memories[0]).toEqual({ ...a, name: 'Nuevo', photoId: 'p1' })
    expect(after.memories[1]).toBe(b)
    expect(before.memories[0].name).toBe('Viejo')
  })

  it('deletes a memory', () => {
    const state = memoriesReducer(
      memoriesState({ memories: [memory({ id: 'a' }), memory({ id: 'b' })] }),
      { type: 'memoryDeleted', id: 'a' },
    )
    expect(state.memories.map((m) => m.id)).toEqual(['b'])
  })

  it('changes the theme', () => {
    const state = memoriesReducer(memoriesState(), {
      type: 'themeChanged',
      theme: 'dark',
    })
    expect(state.settings.theme).toBe('dark')
  })

  it('changes the sort order', () => {
    const state = memoriesReducer(memoriesState(), {
      type: 'sortOrderChanged',
      sortOrder: 'oldest',
    })
    expect(state.settings.sortOrder).toBe('oldest')
  })
})
