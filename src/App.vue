<script setup lang="ts">
import { onMounted } from 'vue'

import { useCalendarCursor } from '@/composables/useCalendarCursor'
import { usePlanner } from '@/composables/usePlanner'
import AddBlockForm from '@/ui/blocks/AddBlockForm.vue'
import DayView from '@/ui/blocks/DayView.vue'
import WeekDashboard from '@/ui/blocks/WeekDashboard.vue'
import CategoryManager from '@/ui/categories/CategoryManager.vue'
import Footer from '@/ui/layout/Footer.vue'
import NavBar from '@/ui/layout/NavBar.vue'
import DailyStats from '@/ui/stats/DailyStats.vue'
import WeeklyStats from '@/ui/stats/WeeklyStats.vue'

const { refresh } = usePlanner()
const { viewMode } = useCalendarCursor()

onMounted(refresh)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <NavBar />

    <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
      <CategoryManager />
      <AddBlockForm />
      <template v-if="viewMode === 'week'">
        <WeekDashboard />
        <WeeklyStats />
      </template>
      <template v-else>
        <DayView />
        <DailyStats />
      </template>
    </main>

    <Footer />
  </div>
</template>
