<script setup lang="ts">
import { computed } from 'vue'

import { REMIND_BEFORE_OPTIONS, useReminders } from '@/composables/useReminders'
import { useUiScale, type UiScaleStep } from '@/composables/useUiScale'

defineProps<{
  open: boolean
}>()

const { step, scalePercent, setStep } = useUiScale()

const sliderValue = computed({
  get: () => step.value,
  set: (value: number) => setStep(value as UiScaleStep),
})

const { enabled, leadMinutes, permission, setEnabled, sendTest } = useReminders()

const permissionHint = computed(() => {
  if (permission.value === 'unsupported') return 'Цей браузер не підтримує сповіщення.'
  if (permission.value === 'denied') return 'Сповіщення заблоковано в налаштуваннях браузера.'
  return null
})

async function handleToggle(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  await setEnabled(input.checked)
  // Якщо дозвіл не надано, стан не змінився і Vue не перемалює — повертаємо перемикач вручну.
  input.checked = enabled.value
}
</script>

<template>
  <div class="pointer-events-none absolute top-full right-4 z-20 w-80 max-w-[calc(100vw-2rem)] overflow-hidden pb-6 pl-6">
    <div
      class="pointer-events-auto mt-2 rounded-xl border border-emerald-100 bg-white p-4 shadow-lg transition-[transform,visibility] duration-300 ease-in-out dark:border-slate-600 dark:bg-slate-800"
      :class="open ? 'visible translate-x-0' : 'invisible translate-x-[120%]'"
      :aria-hidden="!open"
    >
      <h2 class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-100">Налаштування</h2>

      <div class="flex flex-col gap-3">
        <label class="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
          Нагадування
          <input :checked="enabled" type="checkbox" class="peer sr-only" @change="handleToggle" />
          <span
            class="relative h-5 w-9 shrink-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-4 dark:bg-slate-600"
          />
        </label>

        <label class="flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-300">
          Нагадувати за
          <select
            v-model="leadMinutes"
            :disabled="!enabled"
            class="rounded border border-emerald-100 bg-white px-2 py-1 text-sm text-slate-700 [color-scheme:light] focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:[color-scheme:dark] disabled:opacity-50"
          >
            <option v-for="minutes in REMIND_BEFORE_OPTIONS" :key="minutes" :value="minutes">
              {{ minutes === 0 ? 'у момент початку' : `${minutes} хв` }}
            </option>
          </select>
        </label>

        <p v-if="permissionHint" class="text-xs text-red-500 dark:text-red-400">{{ permissionHint }}</p>

        <button
          v-if="enabled"
          type="button"
          class="self-start rounded border border-emerald-100 px-2.5 py-1 text-xs text-slate-500 hover:bg-emerald-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
          @click="sendTest"
        >
          Тестове сповіщення
        </button>

        <div class="text-sm text-slate-600 dark:text-slate-300">
          <div class="mb-1 flex items-center justify-between">
            <label for="ui-scale">Розмір інтерфейсу</label>
            <span class="text-xs text-slate-400 dark:text-slate-500">{{ scalePercent }}%</span>
          </div>
          <input
            id="ui-scale"
            v-model.number="sliderValue"
            type="range"
            min="1"
            max="3"
            step="1"
            class="w-full accent-emerald-500"
          />
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-400 dark:text-slate-500">Нагадування працюють, поки застосунок відкритий.</p>
    </div>
  </div>
</template>
