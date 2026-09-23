export function aggregatePercent(done: number, total: number): number {
  return total > 0 ? Math.round((done / total) * 100) : 0
}

export type FeedbackIcon = 'frown' | 'alertCircle' | 'coffee' | 'thumbsUp' | 'trophy'

export interface FinalFeedback {
  text: string
  icon: FeedbackIcon
  colorClass: string
}

/**
 * Фінальний вердикт по завершеному періоду (тиждень/день) — п'ять зон за
 * абсолютним відсотком виконання, кожна зі своїм тоном, кольором та іконкою.
 */
export function getFinalFeedback(percent: number, periodLabel: string): FinalFeedback {
  if (percent < 25) {
    return { text: 'Так нікуди не годиться, давай до роботи.', icon: 'frown', colorClass: 'text-red-500' }
  }
  if (percent < 45) {
    return {
      text: 'Є прогрес, але цього замало — берись до роботи активніше.',
      icon: 'alertCircle',
      colorClass: 'text-orange-500',
    }
  }
  if (percent < 70) {
    return { text: 'Непогано, але ще є куди піднажати.', icon: 'coffee', colorClass: 'text-yellow-500' }
  }
  if (percent < 90) {
    return {
      text: 'Вітаю в зеленому діапазоні, ти молодець, але це все ще не зона ідеалу.',
      icon: 'thumbsUp',
      colorClass: 'text-emerald-500',
    }
  }
  return {
    text: `Мої вітання, ти у виграшній зоні, цей ${periodLabel} був справді продуктивним, так тримати!`,
    icon: 'trophy',
    colorClass: 'text-emerald-600',
  }
}

/** Нейтральне нагадування, поки період ще триває — без оцінки, лише факт і підбадьорення. */
export function getIntermediateMessage(): string {
  return 'Продовжуй у тому ж дусі — попереду ще є час усе встигнути.'
}

export interface TopCategorySummary {
  categoryId: string
  minutes: number
  /** Чи всі блоки цієї категорії за період позначені виконаними. */
  allDone: boolean
}

/**
 * Категорія, на яку заплановано найбільше часу за період, і чи весь цей час
 * справді відпрацьований (усі відповідні чекбокси = true) — від цього
 * залежить, чи казати "заплановано", чи "витрачено".
 */
export function getTopCategorySummary(
  periodBlocks: { categoryId: string; durationMinutes: number; done: boolean }[],
): TopCategorySummary | null {
  const minutesByCategory = new Map<string, number>()
  for (const block of periodBlocks) {
    minutesByCategory.set(block.categoryId, (minutesByCategory.get(block.categoryId) ?? 0) + block.durationMinutes)
  }

  const top = [...minutesByCategory.entries()].sort((a, b) => b[1] - a[1])[0]
  if (!top) return null

  const [categoryId, minutes] = top
  const allDone = periodBlocks.filter((block) => block.categoryId === categoryId).every((block) => block.done)

  return { categoryId, minutes, allDone }
}
