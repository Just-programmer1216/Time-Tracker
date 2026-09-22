<script setup lang="ts">
import { useCalendarCursor } from '@/composables/useCalendarCursor'

import DayTimeline from './DayTimeline.vue'

const { cursorDayOfWeek } = useCalendarCursor()
</script>

<template>
  <section
    class="h-[70vh] overflow-hidden rounded-lg border border-emerald-100 bg-white dark:border-slate-700 dark:bg-slate-800"
  >
    <DayTimeline :day-of-week="cursorDayOfWeek" class="h-full" />
  </section>
</template>
