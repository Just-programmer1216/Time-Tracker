import type { Block } from '@/types'

/** Ключ, за яким запам'ятовуємо, що нагадування про цей блок уже показане. */
export function reminderKey(block: Pick<Block, 'id' | 'weekId' | 'dayOfWeek' | 'startMinutes'>): string {
  return `${block.weekId}:${block.dayOfWeek}:${block.id}:${block.startMinutes}`
}

/**
 * Блоки, про які час нагадати: сьогоднішні, ще не виконані, ще не показані.
 * Нагадування настає за `leadMinutes` до початку й діє до початку блоку (плюс
 * хвилина запасу на інтервал перевірки) — якщо застосунок відкрили вже після
 * початку блоку, старі нагадування не сипляться.
 *
 * Чиста функція без браузерних API: та сама логіка згодом піде на сервер.
 */
export function getDueReminders(
  todayBlocks: Block[],
  nowMinutes: number,
  leadMinutes: number,
  alreadyNotified: ReadonlySet<string>,
): Block[] {
  return todayBlocks.filter((block) => {
    if (block.done || alreadyNotified.has(reminderKey(block))) return false
    const remindFrom = block.startMinutes - leadMinutes
    return nowMinutes >= remindFrom && nowMinutes < block.startMinutes + 1
  })
}
