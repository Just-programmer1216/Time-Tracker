import { ref, watch } from 'vue'

import { getStore } from '@/store'
import { nextCategoryColor } from '@/store/db'
import type { Block, Category, CategoryStat, DayOfWeek } from '@/types'

import { useCalendarCursor } from './useCalendarCursor'

const store = getStore()

const { cursorWeekId } = useCalendarCursor()

const weekId = cursorWeekId
const categories = ref<Category[]>([])
const blocks = ref<Block[]>([])
const stats = ref<CategoryStat[]>([])
const isLoading = ref(false)

async function refresh(): Promise<void> {
  isLoading.value = true
  try {
    const [loadedCategories, loadedBlocks, loadedStats] = await Promise.all([
      store.getCategories(),
      store.getBlocks(weekId.value),
      store.getWeekStats(weekId.value),
    ])
    categories.value = loadedCategories
    blocks.value = loadedBlocks
    stats.value = loadedStats
  } finally {
    isLoading.value = false
  }
}

// Перезавантажує дані щоразу, як навігація (стрілочки в перемикачі) змінює тиждень.
watch(weekId, () => {
  void refresh()
})

async function addBlock(input: {
  title: string
  categoryId: string
  dayOfWeek: DayOfWeek
  startMinutes: number
  durationMinutes: number
}): Promise<void> {
  const block: Block = {
    id: crypto.randomUUID(),
    weekId: weekId.value,
    dayOfWeek: input.dayOfWeek,
    categoryId: input.categoryId,
    title: input.title,
    done: false,
    startMinutes: input.startMinutes,
    durationMinutes: input.durationMinutes,
    createdAt: Date.now(),
  }
  await store.saveBlock(block)
  await refresh()
}

async function toggleBlock(id: string, done: boolean): Promise<void> {
  await store.toggleBlockDone(id, done)
  await refresh()
}

async function removeBlock(id: string): Promise<void> {
  await store.deleteBlock(id)
  await refresh()
}

async function addCategory(name: string): Promise<void> {
  const category: Category = {
    id: crypto.randomUUID(),
    name,
    color: nextCategoryColor(categories.value.length),
    order: categories.value.length,
    archived: false,
  }
  await store.saveCategory(category)
  await refresh()
}

async function removeCategory(id: string): Promise<void> {
  await store.deleteCategory(id)
  await refresh()
}

export function usePlanner() {
  return {
    weekId,
    categories,
    blocks,
    stats,
    isLoading,
    refresh,
    addBlock,
    toggleBlock,
    removeBlock,
    addCategory,
    removeCategory,
  }
}
