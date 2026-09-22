<script setup lang="ts">
import { Clock, Moon, Sun } from '@lucide/vue'

import { useTheme } from '@/composables/useTheme'

import ViewSwitcher from './ViewSwitcher.vue'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <header
    class="sticky top-0 z-10 border-b border-emerald-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
  >
    <div class="mx-auto grid max-w-5xl grid-cols-3 items-center px-4 py-3">
      <span
        class="flex items-center gap-2 justify-self-start text-lg font-semibold tracking-tight text-emerald-700 dark:text-emerald-400"
      >
        <Clock :size="22" class="shrink-0" />
        TMT
      </span>

      <ViewSwitcher class="justify-self-center" />

      <button
        type="button"
        class="justify-self-end rounded-full p-2 text-slate-500 hover:bg-emerald-100 dark:text-slate-300 dark:hover:bg-slate-800"
        :aria-label="theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'"
        @click="toggleTheme"
      >
        <Sun v-if="theme === 'light'" :size="20" />
        <Moon v-else :size="20" />
      </button>
    </div>
  </header>
</template>
