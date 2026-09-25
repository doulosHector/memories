import type { DateKey } from '../types'

const MS_PER_DAY = 86_400_000

const pad = (value: number) => String(value).padStart(2, '0')

export const toDateKey = (date: Date): DateKey =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** Local midnight of the given `YYYY-MM-DD` date. */
export const parseDateKey = (key: DateKey): Date => {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** True for a real calendar date in `YYYY-MM-DD` format. */
export const isDateKey = (value: unknown): value is DateKey =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  toDateKey(parseDateKey(value)) === value

/** Local midnight of the given moment (today by default). */
export const startOfDay = (date: Date = new Date()): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const todayKey = (): DateKey => toDateKey(new Date())

/** Whole days from `from` to `to` (both local midnights). */
export const daysBetween = (from: Date, to: Date): number =>
  Math.round((to.getTime() - from.getTime()) / MS_PER_DAY)

export interface Elapsed {
  years: number
  months: number
  days: number
}

/**
 * `from` moved forward by whole months. The day is clamped to the end of the
 * target month (Jan 31 + 1 month = Feb 28/29).
 */
const addMonths = (from: Date, months: number): Date => {
  const year = from.getFullYear()
  const month = from.getMonth() + months
  const lastDay = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(from.getDate(), lastDay))
}

/** Elapsed time from `from` to `to` in calendar years, months and days. */
export const elapsedBetween = (from: Date, to: Date): Elapsed => {
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth())
  if (addMonths(from, months) > to) months--
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: daysBetween(addMonths(from, months), to),
  }
}

/**
 * Next anniversary of `from` on or after `today`. A Feb 29 date falls on
 * Feb 28 in non-leap years.
 */
export const nextAnniversary = (from: Date, today: Date): Date => {
  const yearsToThisYear = today.getFullYear() - from.getFullYear()
  const thisYear = addMonths(from, yearsToThisYear * 12)
  return thisYear < today
    ? addMonths(from, (yearsToThisYear + 1) * 12)
    : thisYear
}
