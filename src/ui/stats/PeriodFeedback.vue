<script setup lang="ts">
import { AlertCircle, Clock, Coffee, Construction, Frown, ThumbsUp, Trophy } from '@lucide/vue'
import { computed } from 'vue'

import { getFinalFeedback, getIntermediateMessage, type FeedbackIcon } from '@/utils/feedback'
import type { PeriodState } from '@/utils/week'

import TaskChecklist from './TaskChecklist.vue'

const props = defineProps<{
  percent: number
  periodState: PeriodState
  periodLabel: string
  doneCount: number
  totalCount: number
  topCategoryText: string | null
  items: { id: string; title: string; done: boolean; color: string; timeLabel?: string }[]
}>()

const iconMap: Record<FeedbackIcon, typeof Frown> = {
  frown: Frown,
  alertCircle: AlertCircle,
  coffee: Coffee,
  thumbsUp: ThumbsUp,
  trophy: Trophy,
}

const finalFeedback = computed(() => getFinalFeedback(props.percent, props.periodLabel))
</script>

<template>
  <div class="mt-4 rounded-md bg-emerald-50 p-3 text-sm dark:bg-slate-900">
    <template v-if="periodState === 'ended'">
      <div class="flex items-start gap-2">
        <component
          :is="iconMap[finalFeedback.icon]"
          :size="18"
          class="mt-0.5 shrink-0"
          :class="finalFeedback.colorClass"
        />
        <div class="flex flex-col gap-1">
          <p class="text-slate-600 dark:text-slate-300">{{ finalFeedback.text }}</p>
          <p v-if="topCategoryText" class="text-slate-500 dark:text-slate-400">{{ topCategoryText }}</p>
        </div>
      </div>
      <TaskChecklist v-if="items.length > 0" :items="items" />
    </template>

    <template v-else-if="periodState === 'future'">
      <div class="flex items-start gap-2">
        <Construction :size="18" class="mt-0.5 shrink-0 text-amber-500" />
        <p class="text-slate-600 dark:text-slate-300">Проводяться ремонтні роботи — побачимось, коли настане час.</p>
      </div>
    </template>

    <template v-else>
      <div class="flex items-start gap-2">
        <Clock :size="18" class="mt-0.5 shrink-0 text-emerald-500" />
        <p class="text-slate-600 dark:text-slate-300">
          Виконано {{ doneCount }} із {{ totalCount }} ({{ percent }}%). {{ getIntermediateMessage() }}
        </p>
      </div>
    </template>
  </div>
</template>
