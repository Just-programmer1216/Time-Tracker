<script setup lang="ts">
import { computed } from 'vue'

import { usePlanner } from '@/composables/usePlanner'
import type { DayOfWeek } from '@/types'
import { DAY_LABELS, formatShortDate, getDateForDayOfWeek } from '@/utils/week'

import BlockItem from './BlockItem.vue'

const props = defineProps<{
  dayOfWeek: DayOfWeek
}>()

const { blocks, categories, toggleBlock, removeBlock } = usePlanner()

const categoryById = computed(() => new Map(categories.value.map((category) => [category.id, category])))
const dayBlocks = computed(() => blocks.value.filter((block) => block.dayOfWeek === props.dayOfWeek))
</script>

<template>
  <section>
    <h2 class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
      {{ DAY_LABELS[props.dayOfWeek] }}, {{ formatShortDate(getDateForDayOfWeek(props.dayOfWeek)) }}
    </h2>

    <p v-if="dayBlocks.length === 0" class="text-sm text-slate-400 dark:text-slate-500">
      Ще немає жодного блоку цього дня — додай вище.
    </p>

    <ul v-else class="flex flex-col gap-2">
      <BlockItem
        v-for="block in dayBlocks"
        :key="block.id"
        :block="block"
        :category="categoryById.get(block.categoryId)"
        @toggle="(done) => toggleBlock(block.id, done)"
        @remove="() => removeBlock(block.id)"
      />
    </ul>
  </section>
</template>
