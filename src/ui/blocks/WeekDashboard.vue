<script setup lang="ts">
import { computed, ref } from 'vue'

import { useCalendarCursor } from '@/composables/useCalendarCursor'
import { usePlanner } from '@/composables/usePlanner'
import type { Category, DayOfWeek } from '@/types'
import { getDateForDayOfWeek } from '@/utils/week'

import DayCard from './DayCard.vue'
import DayTimelineModal from './DayTimelineModal.vue'

const { blocks, categories } = usePlanner()
const { cursorDate } = useCalendarCursor()

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 7]

const openDay = ref<DayOfWeek | null>(null)

const categoryById = computed(() => new Map(categories.value.map((category) => [category.id, category])))

function categoriesForDay(dayOfWeek: DayOfWeek): Category[] {
  const ids = new Set(blocks.value.filter((block) => block.dayOfWeek === dayOfWeek).map((block) => block.categoryId))
  return [...ids]
    .map((id) => categoryById.value.get(id))
    .filter((category): category is Category => category !== undefined)
}
</script>

<template>
  <section>
    <h2 class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Цей тиждень</h2>

    <div class="flex flex-wrap justify-center gap-2">
      <div
        v-for="day in DAYS"
        :key="day"
        class="w-[calc(50%-0.25rem)] sm:w-[calc(33.3333%-0.3334rem)] md:w-[calc(25%-0.375rem)]"
      >
        <DayCard
          :day-of-week="day"
          :date="getDateForDayOfWeek(day, cursorDate)"
          :categories="categoriesForDay(day)"
          :is-selected="openDay === day"
          @select="openDay = day"
        />
      </div>
    </div>

    <DayTimelineModal
      v-if="openDay"
      :day-of-week="openDay"
      :date="getDateForDayOfWeek(openDay, cursorDate)"
      @close="openDay = null"
    />
  </section>
</template>
