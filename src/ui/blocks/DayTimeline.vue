<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue'
import { computed, onMounted, ref } from 'vue'

import { usePlanner } from '@/composables/usePlanner'
import type { Block, DayOfWeek } from '@/types'
import { formatTimeRange, minutesToTimeString } from '@/utils/time'
import { getIsoDayOfWeek } from '@/utils/week'

import EditBlockModal from './EditBlockModal.vue'

const props = defineProps<{
  dayOfWeek: DayOfWeek
}>()

const editingBlock = ref<Block | null>(null)

const PIXELS_PER_HOUR = 56
const HOURS = Array.from({ length: 24 }, (_, hour) => hour)

const { blocks, categories, toggleBlock, removeBlock } = usePlanner()

interface PositionedBlock extends Block {
  column: number
  totalColumns: number
}

const dayBlocks = computed(() => blocks.value.filter((block) => block.dayOfWeek === props.dayOfWeek))
const categoryById = computed(() => new Map(categories.value.map((category) => [category.id, category])))

/**
 * Групує блоки, що перетинаються в часі, у "кластери" і розкладає кожен
 * кластер по колонках (як у Google Calendar) — без цього блоки, що
 * реально перетинаються, малювались би один поверх одного.
 */
function layoutBlocks(dayBlocksList: Block[]): PositionedBlock[] {
  const sorted = [...dayBlocksList].sort(
    (a, b) => a.startMinutes - b.startMinutes || b.durationMinutes - a.durationMinutes,
  )
  const result: PositionedBlock[] = []

  let cluster: Block[] = []
  let clusterEnd = -Infinity

  function flushCluster(): void {
    if (cluster.length === 0) return

    const columnEnds: number[] = []
    const placements: { block: Block; column: number }[] = []

    for (const block of cluster) {
      let columnIndex = columnEnds.findIndex((endMinutes) => endMinutes <= block.startMinutes)
      if (columnIndex === -1) {
        columnIndex = columnEnds.length
        columnEnds.push(block.startMinutes + block.durationMinutes)
      } else {
        columnEnds[columnIndex] = block.startMinutes + block.durationMinutes
      }
      placements.push({ block, column: columnIndex })
    }

    const totalColumns = columnEnds.length
    for (const { block, column } of placements) {
      result.push({ ...block, column, totalColumns })
    }
    cluster = []
  }

  for (const block of sorted) {
    if (cluster.length > 0 && block.startMinutes >= clusterEnd) {
      flushCluster()
      clusterEnd = -Infinity
    }
    cluster.push(block)
    clusterEnd = Math.max(clusterEnd, block.startMinutes + block.durationMinutes)
  }
  flushCluster()

  return result
}

const positionedBlocks = computed(() => layoutBlocks(dayBlocks.value))

/**
 * Позначки точного часу для блоків, що починаються або закінчуються не на
 * круглу годину (напр. 09:20 чи 10:45) — інакше по самій сітці неможливо
 * зрозуміти точний час. Дедуплікуються за хвилиною, щоб кілька блоків з
 * однаковим часом не малювали однакову мітку двічі.
 */
const nonRoundTimeMarks = computed(() => {
  const seenMinutes = new Set<number>()
  const marks: { minutes: number; top: number }[] = []

  function addMark(minutes: number): void {
    if (minutes % 60 === 0 || seenMinutes.has(minutes)) return
    seenMinutes.add(minutes)
    marks.push({ minutes, top: (minutes / 60) * PIXELS_PER_HOUR })
  }

  for (const block of dayBlocks.value) {
    addMark(block.startMinutes)
    addMark(block.startMinutes + block.durationMinutes)
  }

  return marks
})

// Мінімум лише для того, щоб навіть дуже короткий блок лишався клікабельним —
// не "роздуває" блок за межі його справжнього часу, тому сусідні (не перетинні)
// блоки не наїжджають один на одного.
const MIN_BLOCK_HEIGHT = 22
const COMPACT_THRESHOLD = 38

function blockHeight(block: Block): number {
  return Math.max((block.durationMinutes / 60) * PIXELS_PER_HOUR, MIN_BLOCK_HEIGHT)
}

function isCompact(block: Block): boolean {
  return blockHeight(block) < COMPACT_THRESHOLD
}

function blockStyle(block: PositionedBlock): Record<string, string> {
  const color = categoryById.value.get(block.categoryId)?.color ?? '#94a3b8'
  return {
    top: `${(block.startMinutes / 60) * PIXELS_PER_HOUR}px`,
    height: `${blockHeight(block)}px`,
    left: `calc(${(block.column / block.totalColumns) * 100}% + 2px)`,
    width: `calc(${100 / block.totalColumns}% - 4px)`,
    backgroundColor: `${color}29`,
    borderLeftColor: color,
  }
}

const scrollContainer = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const isToday = getIsoDayOfWeek() === props.dayOfWeek
  const now = new Date()
  const targetMinutes =
    dayBlocks.value.length > 0
      ? Math.min(...dayBlocks.value.map((block) => block.startMinutes))
      : isToday
        ? now.getHours() * 60 + now.getMinutes()
        : 8 * 60

  scrollContainer.value?.scrollTo({ top: Math.max((targetMinutes / 60) * PIXELS_PER_HOUR - 80, 0) })
})
</script>

<template>
  <div
    ref="scrollContainer"
    class="overflow-y-auto [scrollbar-color:#a7f3d0_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-200 [&::-webkit-scrollbar-track]:bg-transparent dark:[scrollbar-color:#475569_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-slate-600"
  >
    <div class="relative flex" :style="{ height: `${HOURS.length * PIXELS_PER_HOUR}px` }">
      <div class="relative w-14 shrink-0 border-r border-slate-100 dark:border-slate-700">
        <div v-for="hour in HOURS" :key="hour" class="relative" :style="{ height: `${PIXELS_PER_HOUR}px` }">
          <span class="absolute -top-2 right-2 text-[11px] text-slate-300 dark:text-slate-600">
            {{ String(hour).padStart(2, '0') }}:00
          </span>
        </div>

        <span
          v-for="mark in nonRoundTimeMarks"
          :key="mark.minutes"
          class="absolute right-2 text-[11px] font-semibold text-emerald-500 dark:text-emerald-400"
          :style="{ top: `${mark.top - 8}px` }"
        >
          {{ minutesToTimeString(mark.minutes) }}
        </span>
      </div>

      <div class="relative flex-1">
        <div
          v-for="hour in HOURS"
          :key="hour"
          class="border-t border-slate-100 dark:border-slate-700/60"
          :style="{ height: `${PIXELS_PER_HOUR}px` }"
        />

        <div
          v-for="block in positionedBlocks"
          :key="block.id"
          :title="block.title"
          class="absolute overflow-hidden rounded-md border-l-4 px-2 py-1 text-xs text-slate-700 shadow-sm dark:text-slate-100"
          :style="blockStyle(block)"
        >
          <div class="flex items-start justify-between gap-1">
            <button type="button" class="min-w-0 flex-1 text-left" @click="toggleBlock(block.id, !block.done)">
              <p class="line-clamp-2 font-medium" :class="block.done ? 'line-through opacity-60' : ''">
                {{ block.title }}
              </p>
              <p v-if="!isCompact(block)" class="truncate opacity-70">
                {{ formatTimeRange(block.startMinutes, block.durationMinutes) }}
              </p>
            </button>

            <button
              type="button"
              class="shrink-0 rounded p-0.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:text-slate-500 dark:hover:bg-emerald-950/40"
              aria-label="Редагувати блок"
              @click="editingBlock = block"
            >
              <Pencil :size="13" />
            </button>

            <button
              type="button"
              class="shrink-0 rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-950/40"
              aria-label="Видалити блок"
              @click="removeBlock(block.id)"
            >
              <Trash2 :size="13" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <EditBlockModal v-if="editingBlock" :block="editingBlock" @close="editingBlock = null" />
  </div>
</template>
