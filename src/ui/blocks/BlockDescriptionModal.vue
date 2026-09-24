<script setup lang="ts">
import { X } from '@lucide/vue'
import { computed, onMounted, onUnmounted } from 'vue'

import { usePlanner } from '@/composables/usePlanner'
import type { Block } from '@/types'

const props = defineProps<{
  block: Block
}>()

const emit = defineEmits<{
  close: []
}>()

const { categories } = usePlanner()

const categoryColor = computed(
  () => categories.value.find((category) => category.id === props.block.categoryId)?.color ?? '#94a3b8',
)

// Capture-фаза + stopPropagation: Esc закриває лише цю модалку, а не й батьківську (вікно дня).
function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return
  event.stopPropagation()
  emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown, true)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown, true)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="emit('close')"
    >
      <div class="flex max-h-[80vh] w-full max-w-sm flex-col rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-800">
        <div class="mb-3 flex items-start justify-between gap-2">
          <div class="flex min-w-0 items-center gap-2">
            <span class="size-2.5 shrink-0 rounded-full" :style="{ backgroundColor: categoryColor }" />
            <p class="text-sm font-semibold break-words text-slate-700 dark:text-slate-100">{{ props.block.title }}</p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-700"
            aria-label="Закрити"
            @click="emit('close')"
          >
            <X :size="18" />
          </button>
        </div>

        <p class="overflow-y-auto text-sm whitespace-pre-wrap break-words text-slate-600 dark:text-slate-300">
          {{ props.block.description }}
        </p>
      </div>
    </div>
  </Teleport>
</template>
