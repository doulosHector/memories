import { describe, expect, it } from 'vitest'
import {
  daysBetween,
  elapsedBetween,
  isDateKey,
  nextAnniversary,
  parseDateKey,
  startOfDay,
  toDateKey,
} from './date'

const d = parseDateKey

describe('date keys', () => {
  it('round-trips between Date and YYYY-MM-DD in local time', () => {
    expect(toDateKey(new Date(2024, 0, 5))).toBe('2024-01-05')
    expect(d('2024-01-05')).toEqual(new Date(2024, 0, 5))
  })

  it('accepts only real calendar dates', () => {
    expect(isDateKey('2024-02-29')).toBe(true)
    expect(isDateKey('2023-02-29')).toBe(false)
    expect(isDateKey('2024-13-01')).toBe(false)
    expect(isDateKey('2024-1-5')).toBe(false)
    expect(isDateKey('')).toBe(false)
    expect(isDateKey(20240105)).toBe(false)
  })

  it('truncates a moment to local midnight', () => {
    expect(startOfDay(new Date(2024, 4, 3, 18, 45))).toEqual(
      new Date(2024, 4, 3),
    )
  })
})

describe('daysBetween', () => {
  it('counts whole days, also across DST changes', () => {
    expect(daysBetween(d('2024-03-01'), d('2024-04-01'))).toBe(31)
    expect(daysBetween(d('2024-10-20'), d('2024-11-10'))).toBe(21)
    expect(daysBetween(d('2024-01-02'), d('2024-01-01'))).toBe(-1)
  })
})

describe('elapsedBetween', () => {
  it('returns calendar years, months and days', () => {
    expect(elapsedBetween(d('2020-06-15'), d('2024-09-25'))).toEqual({
      years: 4,
      months: 3,
      days: 10,
    })
  })

  it('borrows days from the previous month', () => {
    expect(elapsedBetween(d('2024-01-31'), d('2024-03-01'))).toEqual({
      years: 0,
      months: 1,
      days: 1,
    })
  })

  it('borrows months from the previous year', () => {
    expect(elapsedBetween(d('2023-11-20'), d('2024-02-10'))).toEqual({
      years: 0,
      months: 2,
      days: 21,
    })
  })

  it('clamps to the end of shorter months', () => {
    expect(elapsedBetween(d('2024-01-31'), d('2024-02-29'))).toEqual({
      years: 0,
      months: 1,
      days: 0,
    })
  })

  it('counts a full year on the Feb 28 anniversary of Feb 29', () => {
    expect(elapsedBetween(d('2020-02-29'), d('2021-02-28'))).toEqual({
      years: 1,
      months: 0,
      days: 0,
    })
  })

  it('is zero on the same day', () => {
    expect(elapsedBetween(d('2024-05-05'), d('2024-05-05'))).toEqual({
      years: 0,
      months: 0,
      days: 0,
    })
  })
})

describe('nextAnniversary', () => {
  it('is later this year when the date has not passed yet', () => {
    expect(nextAnniversary(d('2015-12-01'), d('2024-09-25'))).toEqual(
      d('2024-12-01'),
    )
  })

  it('is today on the anniversary itself', () => {
    expect(nextAnniversary(d('2015-09-25'), d('2024-09-25'))).toEqual(
      d('2024-09-25'),
    )
  })

  it('moves to next year when the date already passed', () => {
    expect(nextAnniversary(d('2015-03-10'), d('2024-09-25'))).toEqual(
      d('2025-03-10'),
    )
  })

  it('falls on Feb 28 in non-leap years for Feb 29 dates', () => {
    expect(nextAnniversary(d('2020-02-29'), d('2025-01-10'))).toEqual(
      d('2025-02-28'),
    )
    expect(nextAnniversary(d('2020-02-29'), d('2027-03-01'))).toEqual(
      d('2028-02-29'),
    )
  })
})
