<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'
import { computed, onUnmounted, ref, watch } from 'vue'

import { useCalendarCursor } from '@/composables/useCalendarCursor'
import type { ViewMode } from '@/composables/useCalendarCursor'
import { DAY_LABELS, formatShortDate, formatWeekRange, getIsoWeekId, getWeekStartDate } from '@/utils/week'

const { viewMode, cursorDate, cursorDayOfWeek, setViewMode, shiftCursor } = useCalendarCursor()

const isMenuOpen = ref(false)
const slideDirection = ref<1 | -1>(1)
const labelZoneRef = ref<HTMLDivElement | null>(null)

const currentLabel = computed(() =>
  viewMode.value === 'day'
    ? `${DAY_LABELS[cursorDayOfWeek.value]}, ${formatShortDate(cursorDate.value)}`
    : formatWeekRange(getWeekStartDate(cursorDate.value)),
)

// Підсвічує мітку іншим кольором, коли поточний вибраний період включає
// сьогоднішню дату (з пристрою) — щоб було видно "де ти зараз".
const isCurrentPeriod = computed(() => {
  const today = new Date()
  if (viewMode.value === 'week') return getIsoWeekId(cursorDate.value) === getIsoWeekId(today)
  return (
    cursorDate.value.getFullYear() === today.getFullYear() &&
    cursorDate.value.getMonth() === today.getMonth() &&
    cursorDate.value.getDate() === today.getDate()
  )
})

function openMenu(): void {
  isMenuOpen.value = true
}

function closeMenu(): void {
  isMenuOpen.value = false
}

function selectMode(mode: ViewMode): void {
  setViewMode(mode)
  closeMenu()
}

function goPrev(): void {
  slideDirection.value = -1
  shiftCursor(-1)
}

function goNext(): void {
  slideDirection.value = 1
  shiftCursor(1)
}

function handleOutsideClick(event: MouseEvent): void {
  if (labelZoneRef.value && !labelZoneRef.value.contains(event.target as Node)) closeMenu()
}

watch(isMenuOpen, (open) => {
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
  <div class="flex h-8 items-center gap-0.5">
    <!-- Стрілочки ховаються разом із міткою, поки відкрите меню вибору режиму. -->
    <Transition name="fade">
      <button
        v-if="!isMenuOpen"
        type="button"
        class="flex h-8 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-emerald-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        aria-label="Попередній період"
        @click="goPrev"
      >
        <ChevronLeft :size="16" />
      </button>
    </Transition>

    <div ref="labelZoneRef" class="relative h-8 w-36 shrink-0" @mouseenter="openMenu" @mouseleave="closeMenu">
      <Transition name="fade" mode="out-in">
        <button
          v-if="!isMenuOpen"
          key="label"
          type="button"
          class="flex h-8 w-full items-center justify-center overflow-hidden rounded-full px-2 text-center text-sm font-medium whitespace-nowrap text-slate-600 hover:bg-emerald-100 dark:text-slate-300 dark:hover:bg-slate-800"
          @click="openMenu"
        >
          <Transition :name="slideDirection === 1 ? 'slide-next' : 'slide-prev'" mode="out-in">
            <span
              :key="currentLabel"
              class="block w-full truncate"
              :class="isCurrentPeriod ? 'text-emerald-600 dark:text-emerald-400' : ''"
            >
              {{ currentLabel }}
            </span>
          </Transition>
        </button>

        <div
          v-else
          key="menu"
          class="flex h-8 w-full items-center gap-1 rounded-full border border-emerald-200 bg-white p-1 shadow-sm dark:border-slate-600 dark:bg-slate-800"
        >
          <button
            type="button"
            class="flex-1 rounded-full px-2 py-1 text-sm font-medium transition-colors"
            :class="
              viewMode === 'day'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-500 hover:bg-emerald-100 dark:text-slate-300 dark:hover:bg-slate-700'
            "
            @click="selectMode('day')"
          >
            День
          </button>
          <button
            type="button"
            class="flex-1 rounded-full px-2 py-1 text-sm font-medium transition-colors"
            :class="
              viewMode === 'week'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-500 hover:bg-emerald-100 dark:text-slate-300 dark:hover:bg-slate-700'
            "
            @click="selectMode('week')"
          >
            Тиждень
          </button>
        </div>
      </Transition>
    </div>

    <Transition name="fade">
      <button
        v-if="!isMenuOpen"
        type="button"
        class="flex h-8 w-7 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-emerald-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        aria-label="Наступний період"
        @click="goNext"
      >
        <ChevronRight :size="16" />
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}

.slide-next-enter-from {
  transform: translateX(10px);
  opacity: 0;
}

.slide-next-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-prev-enter-from {
  transform: translateX(-10px);
  opacity: 0;
}

.slide-prev-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
