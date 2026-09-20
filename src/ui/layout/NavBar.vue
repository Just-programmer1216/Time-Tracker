<script setup lang="ts">
import { Clock, Moon, Sun } from '@lucide/vue'

import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <header
    class="sticky top-0 z-10 border-b border-emerald-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
  >
    <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
      <span class="flex items-center gap-2 text-lg font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">
        <Clock :size="22" class="shrink-0" />
        TMT
      </span>

      <button
        type="button"
        class="rounded-full p-2 text-slate-500 hover:bg-emerald-100 dark:text-slate-300 dark:hover:bg-slate-800"
        :aria-label="theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'"
        @click="toggleTheme"
      >
        <Sun v-if="theme === 'light'" :size="20" />
        <Moon v-else :size="20" />
      </button>
    </div>
  </header>
</template>
