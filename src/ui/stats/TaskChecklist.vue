<script setup lang="ts">
import { Check, X } from '@lucide/vue'

defineProps<{
  items: { id: string; title: string; done: boolean; color: string; timeLabel?: string }[]
}>()
</script>

<template>
  <ul
    class="mt-3 flex max-h-48 flex-col gap-1 overflow-y-auto pr-1 [scrollbar-color:#a7f3d0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-200 [&::-webkit-scrollbar-track]:bg-transparent dark:[scrollbar-color:#475569_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
  >
    <li
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-2 rounded px-1.5 py-1 text-xs text-slate-600 dark:text-slate-300"
    >
      <span class="size-1.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />
      <span v-if="item.timeLabel" class="shrink-0 text-slate-400 dark:text-slate-500">{{ item.timeLabel }}</span>
      <span class="min-w-0 flex-1 truncate">{{ item.title }}</span>
      <Check v-if="item.done" :size="14" class="shrink-0 text-emerald-500" />
      <X v-else :size="14" class="shrink-0 text-red-400" />
    </li>
  </ul>
</template>
