<script setup lang="ts">
import { computed } from 'vue'

import { usePlanner } from '@/composables/usePlanner'

import BlockItem from './BlockItem.vue'

const { blocks, categories, toggleBlock, removeBlock } = usePlanner()

const categoryById = computed(() => new Map(categories.value.map((category) => [category.id, category])))
</script>

<template>
  <section>
    <h2 class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Блоки цього тижня</h2>

    <p v-if="blocks.length === 0" class="text-sm text-slate-400 dark:text-slate-500">
      Ще немає жодного блоку — додай перший вище.
    </p>

    <ul v-else class="flex flex-col gap-2">
      <BlockItem
        v-for="block in blocks"
        :key="block.id"
        :block="block"
        :category="categoryById.get(block.categoryId)"
        @toggle="(done) => toggleBlock(block.id, done)"
        @remove="() => removeBlock(block.id)"
      />
    </ul>
  </section>
</template>
