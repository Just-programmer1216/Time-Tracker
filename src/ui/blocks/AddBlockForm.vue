<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { ref } from 'vue'

import { usePlanner } from '@/composables/usePlanner'
import type { DayOfWeek } from '@/types'
import { DAY_LABELS, getIsoDayOfWeek } from '@/utils/week'

const { categories, addBlock } = usePlanner()

const title = ref('')
const categoryId = ref('')
const dayOfWeek = ref<DayOfWeek>(getIsoDayOfWeek())

const dayOptions = Object.entries(DAY_LABELS) as [string, string][]

async function handleSubmit(): Promise<void> {
  if (!title.value.trim() || !categoryId.value) return

  await addBlock({
    title: title.value.trim(),
    categoryId: categoryId.value,
    dayOfWeek: dayOfWeek.value,
  })

  title.value = ''
}
</script>

<template>
  <form
    class="flex flex-col gap-2 rounded-lg border border-emerald-100 bg-white p-3 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-800"
    @submit.prevent="handleSubmit"
  >
    <input
      v-model="title"
      type="text"
      placeholder="Назва блоку"
      class="flex-1 rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100"
    />

    <select
      v-model="categoryId"
      class="rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100"
    >
      <option value="" disabled>Категорія</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>

    <select
      v-model="dayOfWeek"
      class="rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100"
    >
      <option v-for="[day, label] in dayOptions" :key="day" :value="Number(day)">
        {{ label }}
      </option>
    </select>

    <button
      type="submit"
      class="flex items-center justify-center gap-1 rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
    >
      <Plus :size="16" />
      Додати
    </button>
  </form>
</template>
