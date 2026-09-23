<script setup lang="ts">
import { computed } from 'vue'

import { useCalendarCursor } from '@/composables/useCalendarCursor'
import { usePlanner } from '@/composables/usePlanner'
import type { Category, CategoryStat } from '@/types'
import { aggregatePercent, getTopCategorySummary } from '@/utils/feedback'
import { formatDuration } from '@/utils/time'
import { DAY_LABELS, getWeekPeriodState } from '@/utils/week'

import PeriodFeedback from './PeriodFeedback.vue'
import ProgressBar from './ProgressBar.vue'

const { blocks, categories, stats } = usePlanner()
const { cursorDate } = useCalendarCursor()

const categoryById = computed(() => new Map(categories.value.map((category) => [category.id, category])))

function aggregate(list: CategoryStat[]): { total: number; done: number; percent: number } {
  const total = list.reduce((sum, stat) => sum + stat.total, 0)
  const done = list.reduce((sum, stat) => sum + stat.done, 0)
  return { total, done, percent: aggregatePercent(done, total) }
}

const overall = computed(() => aggregate(stats.value))
const periodState = computed(() => getWeekPeriodState(cursorDate.value))

interface CategoryStatRow extends CategoryStat {
  percent: number
  category: Category
}

const categoryRows = computed<CategoryStatRow[]>(() =>
  stats.value
    .filter((stat) => stat.total > 0)
    .map((stat) => ({
      ...stat,
      percent: aggregatePercent(stat.done, stat.total),
      category: categoryById.value.get(stat.categoryId),
    }))
    .filter((row): row is CategoryStatRow => row.category !== undefined)
    .sort((a, b) => b.total - a.total),
)

const topCategoryText = computed(() => {
  const summary = getTopCategorySummary(blocks.value)
  if (!summary) return null

  const category = categoryById.value.get(summary.categoryId)
  if (!category) return null

  const verb = summary.allDone ? 'витрачено' : 'заплановано'
  return `Найбільше часу ${verb} на «${category.name}» — ${formatDuration(summary.minutes)}.`
})

const checklistItems = computed(() =>
  [...blocks.value]
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startMinutes - b.startMinutes)
    .map((block) => ({
      id: block.id,
      title: block.title,
      done: block.done,
      color: categoryById.value.get(block.categoryId)?.color ?? '#94a3b8',
      timeLabel: DAY_LABELS[block.dayOfWeek],
    })),
)
</script>

<template>
  <section
    v-if="overall.total > 0"
    class="rounded-lg border border-emerald-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
  >
    <h2 class="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">Тижнева статистика</h2>

    <div class="mb-4">
      <div class="mb-1 flex items-baseline justify-between">
        <span class="text-sm text-slate-600 dark:text-slate-300">Загалом</span>
        <span class="text-lg font-semibold text-slate-700 dark:text-slate-100">{{ overall.percent }}%</span>
      </div>
      <ProgressBar :percent="overall.percent" />
    </div>

    <div v-if="categoryRows.length > 0" class="flex flex-col gap-2">
      <div v-for="row in categoryRows" :key="row.categoryId">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span class="size-1.5 shrink-0 rounded-full" :style="{ backgroundColor: row.category.color }" />
            {{ row.category.name }}
          </span>
          <span class="text-slate-500 dark:text-slate-400">{{ row.percent }}% ({{ row.done }}/{{ row.total }})</span>
        </div>
        <ProgressBar :percent="row.percent" />
      </div>
    </div>

    <PeriodFeedback
      :percent="overall.percent"
      :period-state="periodState"
      period-label="тиждень"
      :done-count="overall.done"
      :total-count="overall.total"
      :top-category-text="topCategoryText"
      :items="checklistItems"
    />
  </section>
</template>
