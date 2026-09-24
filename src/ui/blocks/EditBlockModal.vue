<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { usePlanner } from '@/composables/usePlanner'
import type { Block, DayOfWeek } from '@/types'
import { minutesToTimeString, timeStringToMinutes } from '@/utils/time'
import { DAY_LABELS } from '@/utils/week'

const props = defineProps<{
  block: Block
}>()

const emit = defineEmits<{
  close: []
}>()

const { categories, updateBlock } = usePlanner()

const title = ref(props.block.title)
const description = ref(props.block.description ?? '')
const categoryId = ref(props.block.categoryId)
const dayOfWeek = ref<DayOfWeek>(props.block.dayOfWeek)
const startTime = ref(minutesToTimeString(props.block.startMinutes))
const endTime = ref(minutesToTimeString(props.block.startMinutes + props.block.durationMinutes))

const dayOptions = Object.entries(DAY_LABELS) as [string, string][]

const isValid = computed(() => {
  if (!title.value.trim() || !categoryId.value) return false
  return timeStringToMinutes(endTime.value) - timeStringToMinutes(startTime.value) > 0
})

async function handleSubmit(): Promise<void> {
  if (!isValid.value) return

  const startMinutes = timeStringToMinutes(startTime.value)
  const durationMinutes = timeStringToMinutes(endTime.value) - startMinutes

  await updateBlock({
    ...props.block,
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    categoryId: categoryId.value,
    dayOfWeek: dayOfWeek.value,
    startMinutes,
    durationMinutes,
  })

  emit('close')
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="emit('close')"
    >
      <div class="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-800">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-100">Редагувати блок</p>
          <button
            type="button"
            class="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-700"
            aria-label="Закрити"
            @click="emit('close')"
          >
            <X :size="18" />
          </button>
        </div>

        <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
          <input
            v-model="title"
            type="text"
            placeholder="Назва блоку"
            class="rounded border border-emerald-100 bg-white px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />

          <textarea
            v-model="description"
            rows="3"
            placeholder="Опис (необов'язково)"
            class="resize-y rounded border border-emerald-100 bg-white px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
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

          <div class="flex gap-2">
            <label class="flex flex-1 items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              з
              <input
                v-model="startTime"
                type="time"
                class="w-full rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:[color-scheme:dark]"
              />
            </label>

            <label class="flex flex-1 items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              до
              <input
                v-model="endTime"
                type="time"
                class="w-full rounded border border-emerald-100 bg-transparent px-2 py-1.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:[color-scheme:dark]"
              />
            </label>
          </div>

          <button
            type="submit"
            :disabled="!isValid"
            class="mt-1 rounded bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300 dark:disabled:bg-slate-600 dark:disabled:hover:bg-slate-600"
          >
            Зберегти
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>
