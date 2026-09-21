<script setup lang="ts">
import { Trash2 } from '@lucide/vue'

import type { Block, Category } from '@/types'
import { formatTimeRange } from '@/utils/time'

const props = defineProps<{
  block: Block
  category: Category | undefined
}>()

const emit = defineEmits<{
  toggle: [done: boolean]
  remove: []
}>()
</script>

<template>
  <li
    class="flex items-center gap-3 rounded-lg border border-emerald-100 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
  >
    <input
      type="checkbox"
      class="size-4 shrink-0 accent-emerald-500"
      :checked="props.block.done"
      @change="emit('toggle', ($event.target as HTMLInputElement).checked)"
    />

    <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: props.category?.color ?? '#94a3b8' }" />

    <span
      class="flex-1 truncate text-sm"
      :class="props.block.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'"
    >
      {{ props.block.title }}
    </span>

    <span class="shrink-0 text-xs text-slate-400 dark:text-slate-500">
      {{ formatTimeRange(props.block.startMinutes, props.block.durationMinutes) }} · {{ props.category?.name ?? '—' }}
    </span>

    <button
      type="button"
      class="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/40"
      aria-label="Видалити блок"
      @click="emit('remove')"
    >
      <Trash2 :size="16" />
    </button>
  </li>
</template>
