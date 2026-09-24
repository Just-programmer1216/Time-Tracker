<script setup lang="ts">
import { Plus, StickyNote } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import { useCalendarCursor } from '@/composables/useCalendarCursor'
import { usePlanner } from '@/composables/usePlanner'
import type { DayOfWeek } from '@/types'
import { timeStringToMinutes } from '@/utils/time'
import { DAY_LABELS, getIsoDayOfWeek } from '@/utils/week'

const { categories, addBlock } = usePlanner()
const { viewMode, cursorDayOfWeek } = useCalendarCursor()

const title = ref('')
const description = ref('')
const showDescription = ref(false)
const categoryId = ref('')
const dayOfWeek = ref<DayOfWeek>(viewMode.value === 'day' ? cursorDayOfWeek.value : getIsoDayOfWeek())

// У денному режимі форма слідує за відкритим днем; у тижневому вибір не чіпаємо.
watch([viewMode, cursorDayOfWeek], ([mode, day]) => {
  if (mode === 'day') dayOfWeek.value = day
})
const startTime = ref('09:00')
const endTime = ref('10:00')

const dayOptions = Object.entries(DAY_LABELS) as [string, string][]

const isValid = computed(() => {
  if (!title.value.trim() || !categoryId.value) return false
  return timeStringToMinutes(endTime.value) - timeStringToMinutes(startTime.value) > 0
})

async function handleSubmit(): Promise<void> {
  if (!isValid.value) return

  const startMinutes = timeStringToMinutes(startTime.value)
  const durationMinutes = timeStringToMinutes(endTime.value) - startMinutes

  await addBlock({
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    categoryId: categoryId.value,
    dayOfWeek: dayOfWeek.value,
    startMinutes,
    durationMinutes,
  })

  title.value = ''
  description.value = ''
  showDescription.value = false
}
</script>

<template>
  <form
    class="flex flex-col gap-2 rounded-lg border border-emerald-100 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center dark:border-slate-700 dark:bg-slate-800"
    @submit.prevent="handleSubmit"
  >
    <input
      v-model="title"
      type="text"
      placeholder="Назва блоку"
      class="min-w-0 flex-1 rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100"
    />

    <select
      v-model="categoryId"
      class="rounded border border-emerald-100 bg-white px-2 py-1.5 text-sm text-slate-700 [color-scheme:light] focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:[color-scheme:dark]"
    >
      <option value="" disabled>Категорія</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>

    <select
      v-model="dayOfWeek"
      class="rounded border border-emerald-100 bg-white px-2 py-1.5 text-sm text-slate-700 [color-scheme:light] focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:[color-scheme:dark]"
    >
      <option v-for="[day, label] in dayOptions" :key="day" :value="Number(day)">
        {{ label }}
      </option>
    </select>

    <label class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      з
      <input
        v-model="startTime"
        type="time"
        class="rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:[color-scheme:dark]"
      />
    </label>

    <label class="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      до
      <input
        v-model="endTime"
        type="time"
        class="rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:[color-scheme:dark]"
      />
    </label>

    <button
      type="button"
      class="flex items-center justify-center gap-1 rounded border border-emerald-100 px-3 py-1.5 text-sm text-slate-500 hover:bg-emerald-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
      :class="showDescription ? 'bg-emerald-50 dark:bg-slate-700' : ''"
      @click="showDescription = !showDescription"
    >
      <StickyNote :size="16" />
      Нотатка
    </button>

    <button
      type="submit"
      :disabled="!isValid"
      class="flex items-center justify-center gap-1 rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300 dark:disabled:bg-slate-600 dark:disabled:hover:bg-slate-600"
    >
      <Plus :size="16" />
      Додати
    </button>

    <textarea
      v-if="showDescription"
      v-model="description"
      rows="3"
      placeholder="Опис (необов'язково)"
      class="w-full basis-full resize-y rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100"
    />
  </form>
</template>
