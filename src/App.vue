<script setup lang="ts">
import { onMounted } from 'vue'

import { usePlanner } from '@/composables/usePlanner'
import AddBlockForm from '@/ui/blocks/AddBlockForm.vue'
import WeekDashboard from '@/ui/blocks/WeekDashboard.vue'
import CategoryManager from '@/ui/categories/CategoryManager.vue'
import Footer from '@/ui/layout/Footer.vue'
import NavBar from '@/ui/layout/NavBar.vue'

const { refresh } = usePlanner()

onMounted(refresh)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <NavBar />

    <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
      <CategoryManager />
      <AddBlockForm />
      <WeekDashboard />
    </main>

    <Footer />
  </div>
</template>
