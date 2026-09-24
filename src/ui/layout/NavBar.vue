<script setup lang="ts">
import { Clock, Moon, Settings, Sun } from '@lucide/vue'
import { onMounted, onUnmounted, ref } from 'vue'

import { useTheme } from '@/composables/useTheme'

import SettingsPanel from './SettingsPanel.vue'
import ViewSwitcher from './ViewSwitcher.vue'

const { theme, toggleTheme } = useTheme()

const isSettingsOpen = ref(false)
const settingsRef = ref<HTMLDivElement | null>(null)

function handleOutsideClick(event: MouseEvent): void {
  if (isSettingsOpen.value && settingsRef.value && !settingsRef.value.contains(event.target as Node)) {
    isSettingsOpen.value = false
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') isSettingsOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  window.removeEventListener('keydown', handleKeydown)
})

const iconButtonClass =
  'rounded-full p-2 text-slate-500 transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-300'
</script>

<template>
  <header
    class="sticky top-0 z-10 border-b border-emerald-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
  >
    <div class="relative mx-auto grid max-w-5xl grid-cols-3 items-center px-4 py-3">
      <span
        class="flex items-center gap-2 justify-self-start text-lg font-semibold tracking-tight text-emerald-700 dark:text-emerald-400"
      >
        <Clock :size="22" class="shrink-0" />
        TMT
      </span>

      <ViewSwitcher class="justify-self-center" />

      <div ref="settingsRef" class="flex items-center gap-1 justify-self-end">
        <button
          type="button"
          :class="iconButtonClass"
          :aria-label="theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'"
          @click="toggleTheme"
        >
          <Sun v-if="theme === 'light'" :size="20" />
          <Moon v-else :size="20" />
        </button>

        <button
          type="button"
          :class="[iconButtonClass, isSettingsOpen ? 'bg-emerald-100 text-emerald-600 dark:bg-slate-700 dark:text-emerald-300' : '']"
          aria-label="Налаштування"
          :aria-expanded="isSettingsOpen"
          @click="isSettingsOpen = !isSettingsOpen"
        >
          <Settings
            :size="20"
            class="transition-transform duration-300 ease-in-out"
            :class="isSettingsOpen ? 'rotate-180' : ''"
          />
        </button>

        <SettingsPanel :open="isSettingsOpen" />
      </div>
    </div>
  </header>
</template>
