import { computed, ref } from 'vue'

import type { DayOfWeek } from '@/types'
import { getIsoDayOfWeek, getIsoWeekId } from '@/utils/week'

export type ViewMode = 'day' | 'week'

const viewMode = ref<ViewMode>('week')
const cursorDate = ref(new Date())

const cursorWeekId = computed(() => getIsoWeekId(cursorDate.value))
const cursorDayOfWeek = computed<DayOfWeek>(() => getIsoDayOfWeek(cursorDate.value))

function setViewMode(mode: ViewMode): void {
  viewMode.value = mode
}

function goToToday(): void {
  cursorDate.value = new Date()
}

/** Рухає курсор на 1 день (у режимі "день") або на 7 днів (у режимі "тиждень"). */
function shiftCursor(direction: 1 | -1): void {
  const step = viewMode.value === 'day' ? 1 : 7
  const next = new Date(cursorDate.value)
  next.setDate(next.getDate() + direction * step)
  cursorDate.value = next
}

export function useCalendarCursor() {
  return {
    viewMode,
    cursorDate,
    cursorWeekId,
    cursorDayOfWeek,
    setViewMode,
    goToToday,
    shiftCursor,
  }
}
