import type { DayOfWeek } from '@/types'

export const DAY_LABELS: Record<DayOfWeek, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
}

/** ISO-8601 тиждень поточної (або переданої) дати, напр. "2026-W38". */
export function getIsoWeekId(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

export function getIsoDayOfWeek(date: Date = new Date()): DayOfWeek {
  const day = date.getDay()
  return (day === 0 ? 7 : day) as DayOfWeek
}

/** Дата понеділка того тижня, до якого належить `referenceDate`. */
export function getWeekStartDate(referenceDate: Date = new Date()): Date {
  const start = new Date(referenceDate)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (getIsoDayOfWeek(referenceDate) - 1))
  return start
}

/** Календарна дата конкретного дня тижня в межах тижня `referenceDate`. */
export function getDateForDayOfWeek(dayOfWeek: DayOfWeek, referenceDate: Date = new Date()): Date {
  const date = getWeekStartDate(referenceDate)
  date.setDate(date.getDate() + (dayOfWeek - 1))
  return date
}

const shortDateFormatter = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' })

export function formatShortDate(date: Date): string {
  return shortDateFormatter.format(date)
}
