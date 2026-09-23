<script setup lang="ts">
import { Plus, X } from '@lucide/vue'
import { ref } from 'vue'

import { usePlanner } from '@/composables/usePlanner'

import CategoryColorButton from './CategoryColorButton.vue'

const { categories, addCategory, removeCategory } = usePlanner()

const newCategoryName = ref('')

async function handleAdd(): Promise<void> {
  const name = newCategoryName.value.trim()
  if (!name) return
  await addCategory(name)
  newCategoryName.value = ''
}
</script>

<template>
  <section class="rounded-lg border border-emerald-100 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
    <h2 class="mb-2 text-sm font-medium text-slate-500 dark:text-slate-400">Категорії</h2>

    <ul class="mb-3 flex flex-wrap gap-2">
      <li
        v-for="category in categories"
        :key="category.id"
        class="flex items-center gap-1.5 rounded-full border border-emerald-100 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-600 dark:text-slate-200"
      >
        <CategoryColorButton :category="category" />
        {{ category.name }}
        <button
          type="button"
          class="text-slate-300 hover:text-red-500 dark:text-slate-500"
          aria-label="Видалити категорію"
          @click="removeCategory(category.id)"
        >
          <X :size="12" />
        </button>
      </li>
    </ul>

    <form class="flex gap-2" @submit.prevent="handleAdd">
      <input
        v-model="newCategoryName"
        type="text"
        placeholder="Нова категорія"
        class="flex-1 rounded border border-emerald-100 bg-transparent px-2 py-1 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none dark:border-slate-600 dark:text-slate-100"
      />
      <button
        type="submit"
        class="flex items-center gap-1 rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-slate-700 dark:text-emerald-300 dark:hover:bg-slate-600"
      >
        <Plus :size="14" />
        Додати
      </button>
    </form>
  </section>
</template>
