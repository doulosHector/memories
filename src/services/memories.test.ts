import { describe, expect, it } from 'vitest'
import { memory } from '../test/factories'
import { parseDateKey } from '../utils/date'
import {
  happensToday,
  matchesSearch,
  summarizeMemories,
  summarizeMemory,
} from './memories'

const today = parseDateKey('2024-09-25')

describe('summarizeMemory', () => {
  it('computes elapsed time and days to the next anniversary', () => {
    const summary = summarizeMemory(memory({ date: '2020-10-05' }), today)
    expect(summary.isFuture).toBe(false)
    expect(summary.elapsed).toEqual({ years: 3, months: 11, days: 20 })
    expect(summary.daysUntil).toBe(10)
    expect(happensToday(summary)).toBe(false)
  })

  it('counts the days until a future date', () => {
    const summary = summarizeMemory(memory({ date: '2024-10-01' }), today)
    expect(summary.isFuture).toBe(true)
    expect(summary.elapsed).toBeNull()
    expect(summary.daysUntil).toBe(6)
    expect(happensToday(summary)).toBe(false)
  })

  it('marks a date that is today', () => {
    const summary = summarizeMemory(memory({ date: '2024-09-25' }), today)
    expect(happensToday(summary)).toBe(true)
    expect(summary.daysUntil).toBe(0)
  })

  it('has 0 days on an anniversary', () => {
    const summary = summarizeMemory(memory({ date: '2019-09-25' }), today)
    expect(summary.daysUntil).toBe(0)
    expect(happensToday(summary)).toBe(false)
  })
})

describe('summarizeMemories', () => {
  const memories = [
    memory({ id: 'march', date: '2010-03-01' }),
    memory({ id: 'future', date: '2024-12-24' }),
    memory({ id: 'today', date: '2022-09-25' }),
    memory({ id: 'october', date: '2018-10-02' }),
  ]
  const ids = (summaries: { memory: { id: string } }[]) =>
    summaries.map((s) => s.memory.id)

  it('orders by date, newest first by default', () => {
    expect(ids(summarizeMemories(memories, today))).toEqual([
      'future',
      'today',
      'october',
      'march',
    ])
  })

  it('orders oldest first on request', () => {
    expect(ids(summarizeMemories(memories, today, 'oldest'))).toEqual([
      'march',
      'october',
      'today',
      'future',
    ])
  })

  it('orders same-day events by when they were added', () => {
    const sameDay = [
      memory({ id: 'second', date: '2020-01-01', createdAt: 2 }),
      memory({ id: 'first', date: '2020-01-01', createdAt: 1 }),
    ]
    expect(ids(summarizeMemories(sameDay, today, 'oldest'))).toEqual([
      'first',
      'second',
    ])
    expect(ids(summarizeMemories(sameDay, today, 'newest'))).toEqual([
      'second',
      'first',
    ])
  })
})

describe('matchesSearch', () => {
  const graduation = memory({ name: 'Graduación de Ana' })

  it('ignores case and accents', () => {
    expect(matchesSearch(graduation, 'GRADUACION')).toBe(true)
    expect(matchesSearch(graduation, ' ana ')).toBe(true)
  })

  it('matches everything with an empty search', () => {
    expect(matchesSearch(graduation, '')).toBe(true)
  })

  it('rejects names that do not contain the text', () => {
    expect(matchesSearch(graduation, 'boda')).toBe(false)
  })
})
