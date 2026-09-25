import { MONTH_NAMES } from '../constants/locale'
import type { Elapsed } from './date'

/** `1 día`, `3 días`… */
export const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`

export const formatDays = (count: number) => plural(count, 'día', 'días')

/** `5 de marzo de 2024` */
export const formatLongDate = (date: Date) =>
  `${date.getDate()} de ${MONTH_NAMES[date.getMonth()]} de ${date.getFullYear()}`

/** `2 años, 3 meses y 4 días`, skipping the zero parts. */
export const formatElapsed = ({ years, months, days }: Elapsed) => {
  const parts: string[] = []
  if (years > 0) parts.push(plural(years, 'año', 'años'))
  if (months > 0) parts.push(plural(months, 'mes', 'meses'))
  if (days > 0 || parts.length === 0) parts.push(formatDays(days))
  if (parts.length === 1) return parts[0]
  return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`
}

/** Uppercase first letter of a name, used when there is no photo. */
export const initialOf = (name: string) => (name.trim()[0] || '•').toUpperCase()
