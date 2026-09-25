import { describe, expect, it } from 'vitest'
import { memory } from '../test/factories'
import { parseDateKey } from '../utils/date'
import { happensToday, summarizeMemories, summarizeMemory } from './memories'

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
  it('orders by the closest upcoming date or anniversary', () => {
    const memories = [
      memory({ id: 'march', date: '2010-03-01' }),
      memory({ id: 'future', date: '2024-12-24' }),
      memory({ id: 'today', date: '2022-09-25' }),
      memory({ id: 'october', date: '2018-10-02' }),
    ]
    expect(summarizeMemories(memories, today).map((s) => s.memory.id)).toEqual([
      'today',
      'october',
      'future',
      'march',
    ])
  })

  it('keeps the original order for ties', () => {
    const memories = [
      memory({ id: 'a', date: '2010-10-01' }),
      memory({ id: 'b', date: '2015-10-01' }),
    ]
    expect(summarizeMemories(memories, today).map((s) => s.memory.id)).toEqual([
      'a',
      'b',
    ])
  })
})
