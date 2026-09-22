<script setup lang="ts">
import { X } from '@lucide/vue'
import { onMounted, onUnmounted } from 'vue'

import type { DayOfWeek } from '@/types'
import { DAY_LABELS, formatShortDate } from '@/utils/week'

import DayTimeline from './DayTimeline.vue'

const props = defineProps<{
  dayOfWeek: DayOfWeek
  date: Date
}>()

const emit = defineEmits<{
  close: []
}>()

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
      <div class="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl dark:bg-slate-800">
        <div class="flex items-center justify-between border-b border-emerald-100 px-4 py-3 dark:border-slate-700">
          <div>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-100">{{ DAY_LABELS[props.dayOfWeek] }}</p>
            <p class="text-xs text-slate-400 dark:text-slate-500">{{ formatShortDate(props.date) }}</p>
          </div>

          <button
            type="button"
            class="rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-700"
            aria-label="Закрити"
            @click="emit('close')"
          >
            <X :size="18" />
          </button>
        </div>

        <DayTimeline :day-of-week="props.dayOfWeek" class="flex-1" />
      </div>
    </div>
  </Teleport>
</template>
