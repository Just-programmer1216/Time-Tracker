<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

import { usePlanner } from '@/composables/usePlanner'
import { CATEGORY_PALETTE } from '@/store/db'
import type { Category } from '@/types'

const props = defineProps<{
  category: Category
}>()

const { updateCategoryColor } = usePlanner()

const isOpen = ref(false)
const rootRef = ref<HTMLDivElement | null>(null)

function toggle(): void {
  isOpen.value = !isOpen.value
}

function close(): void {
  isOpen.value = false
}

async function selectColor(color: string): Promise<void> {
  await updateCategoryColor(props.category.id, color)
  close()
}

function handleOutsideClick(event: MouseEvent): void {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) close()
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('mousedown', handleOutsideClick)
  } else {
    document.removeEventListener('mousedown', handleOutsideClick)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
})
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="size-2.5 shrink-0 rounded-full ring-slate-300 transition-transform hover:scale-125 hover:ring-2 dark:ring-slate-500"
      :style="{ backgroundColor: props.category.color }"
      :aria-label="`Змінити колір категорії ${props.category.name}`"
      @click="toggle"
    />

    <div
      v-if="isOpen"
      class="absolute top-full left-0 z-20 mt-1.5 flex w-24 flex-wrap gap-1.5 rounded-lg border border-emerald-200 bg-white p-2 shadow-lg dark:border-slate-600 dark:bg-slate-800"
    >
      <button
        v-for="color in CATEGORY_PALETTE"
        :key="color"
        type="button"
        class="size-5 shrink-0 rounded-full transition-transform hover:scale-110"
        :class="
          color === props.category.color
            ? 'ring-2 ring-slate-400 ring-offset-1 ring-offset-white dark:ring-slate-300 dark:ring-offset-slate-800'
            : ''
        "
        :style="{ backgroundColor: color }"
        :aria-label="color"
        @click="selectColor(color)"
      />
    </div>
  </div>
</template>
