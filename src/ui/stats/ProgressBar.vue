<script setup lang="ts">
import { progressColorClass } from '@/utils/progress'

const props = defineProps<{
  percent: number
}>()
</script>

<template>
  <div class="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
    <div
      class="h-full rounded-full transition-all duration-300"
      :class="progressColorClass(props.percent)"
      :style="{ width: `${Math.min(Math.max(props.percent, 0), 100)}%` }"
    />
  </div>
</template>
