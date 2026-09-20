export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7 // ISO: 1 = Пн ... 7 = Нд

export interface Category {
  id: string
  name: string
  color: string
  order: number
  archived: boolean
}

export interface Block {
  id: string
  weekId: string // ISO week, напр. "2026-W38"
  dayOfWeek: DayOfWeek
  categoryId: string
  title: string
  done: boolean
  order: number
  createdAt: number
}

export interface CategoryStat {
  categoryId: string
  total: number
  done: number
}
