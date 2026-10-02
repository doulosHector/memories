import { describe, expect, it } from 'vitest'
import { formatDays, formatElapsed, formatLongDate, plural } from './format'

describe('plural', () => {
  it('uses the singular form only for 1', () => {
    expect(plural(1, 'mes', 'meses')).toBe('1 mes')
    expect(plural(0, 'mes', 'meses')).toBe('0 meses')
    expect(formatDays(2)).toBe('2 días')
  })
})

describe('formatLongDate', () => {
  it('writes the date in Spanish', () => {
    expect(formatLongDate(new Date(2024, 2, 5))).toBe('5 de marzo de 2024')
  })
})

describe('formatElapsed', () => {
  it('joins the non-zero parts with commas and "y"', () => {
    expect(formatElapsed({ years: 2, months: 3, days: 4 })).toBe(
      '2 años, 3 meses y 4 días',
    )
    expect(formatElapsed({ years: 1, months: 0, days: 1 })).toBe(
      '1 año y 1 día',
    )
  })

  it('shows a single part on its own', () => {
    expect(formatElapsed({ years: 0, months: 1, days: 0 })).toBe('1 mes')
  })

  it('shows 0 días when no time has passed', () => {
    expect(formatElapsed({ years: 0, months: 0, days: 0 })).toBe('0 días')
  })
})
