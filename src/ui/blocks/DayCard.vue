<script setup lang="ts">
import type { Category, DayOfWeek } from '@/types'
import { DAY_LABELS, formatShortDate } from '@/utils/week'

const props = defineProps<{
  dayOfWeek: DayOfWeek
  date: Date
  categories: Category[]
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-colors"
    :class="
      props.isSelected
        ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-slate-700'
        : 'border-emerald-100 bg-white hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500'
    "
    @click="emit('select')"
  >
    <div>
      <p class="text-sm font-semibold text-slate-700 dark:text-slate-100">{{ DAY_LABELS[props.dayOfWeek] }}</p>
      <p class="text-xs text-slate-400 dark:text-slate-500">{{ formatShortDate(props.date) }}</p>
    </div>

    <div class="flex flex-wrap gap-1">
      <span v-if="props.categories.length === 0" class="text-xs text-slate-300 dark:text-slate-600">
        Немає блоків
      </span>
      <span
        v-for="category in props.categories"
        :key="category.id"
        class="flex items-center gap-1 rounded-full bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-500 dark:bg-slate-900 dark:text-slate-400"
      >
        <span class="size-1.5 shrink-0 rounded-full" :style="{ backgroundColor: category.color }" />
        {{ category.name }}
      </span>
    </div>
  </button>
</template>
