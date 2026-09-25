import type { Memory } from '../types'
import {
  daysBetween,
  elapsedBetween,
  nextAnniversary,
  parseDateKey,
  type Elapsed,
} from '../utils/date'

export interface MemorySummary {
  memory: Memory
  date: Date
  /** The date has not happened yet. */
  isFuture: boolean
  /** Time since the date; `null` for future dates. */
  elapsed: Elapsed | null
  /** Days until the date (future) or until its next anniversary (past). */
  daysUntil: number
}

/** Derived counters for a memory, relative to `today` (a local midnight). */
export const summarizeMemory = (memory: Memory, today: Date): MemorySummary => {
  const date = parseDateKey(memory.date)
  const isFuture = date > today
  return {
    memory,
    date,
    isFuture,
    elapsed: isFuture ? null : elapsedBetween(date, today),
    daysUntil: daysBetween(
      today,
      isFuture ? date : nextAnniversary(date, today),
    ),
  }
}

/** Summaries ordered by the closest upcoming date or anniversary first. */
export const summarizeMemories = (
  memories: readonly Memory[],
  today: Date,
): MemorySummary[] =>
  memories
    .map((memory) => summarizeMemory(memory, today))
    .sort((a, b) => a.daysUntil - b.daysUntil)

/** The memory's date is today. */
export const happensToday = ({ elapsed }: MemorySummary) =>
  elapsed !== null &&
  elapsed.years === 0 &&
  elapsed.months === 0 &&
  elapsed.days === 0
