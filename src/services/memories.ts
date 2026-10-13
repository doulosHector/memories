import type { Memory, SortOrder } from '../types'
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

const compareByDate = (a: Memory, b: Memory) =>
  a.date.localeCompare(b.date) || a.createdAt - b.createdAt

/**
 * Summaries ordered by the event's date: `newest` puts the latest date first
 * (future events on top), `oldest` the earliest. Same-day events follow the
 * order they were added in, reversed for `newest`.
 */
export const summarizeMemories = (
  memories: readonly Memory[],
  today: Date,
  order: SortOrder = 'newest',
): MemorySummary[] => {
  const sorted = [...memories].sort(compareByDate)
  if (order === 'newest') sorted.reverse()
  return sorted.map((memory) => summarizeMemory(memory, today))
}

/** Lowercase text without accents, so "graduacion" finds "Graduación". */
const normalizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

/** The memory's name contains the search text (ignoring case and accents). */
export const matchesSearch = (memory: Memory, query: string) =>
  normalizeText(memory.name).includes(normalizeText(query))

/** The memory's date is today. */
export const happensToday = ({ elapsed }: MemorySummary) =>
  elapsed !== null &&
  elapsed.years === 0 &&
  elapsed.months === 0 &&
  elapsed.days === 0
