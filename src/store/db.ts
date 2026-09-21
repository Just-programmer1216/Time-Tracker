import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

import type { Block, Category } from '@/types'

interface PlannerDb extends DBSchema {
  categories: {
    key: string
    value: Category
  }
  blocks: {
    key: string
    value: Block
    indexes: { 'by-week': string; 'by-category': string }
  }
}

const DB_NAME = 'tmt-planner'
const DB_VERSION = 2

// Дефолтний час для блоків, створених до появи полів startMinutes/durationMinutes.
const LEGACY_START_MINUTES = 9 * 60 // 09:00
const LEGACY_DURATION_MINUTES = 60

const DEFAULT_CATEGORY_NAMES = [
  'EPAM',
  'Lionbridge',
  'Job-search',
  'Go-recall',
  'ADK',
  'Польська',
  'English',
  'Читання',
  'Відпочинок',
]

// Пастельна палітра, узгоджена зі світлою м'ятною темою.
const CATEGORY_PALETTE = [
  '#34d399', // emerald
  '#38bdf8', // sky
  '#fbbf24', // amber
  '#f472b6', // pink
  '#a78bfa', // violet
  '#fb923c', // orange
  '#2dd4bf', // teal
  '#f87171', // red
  '#94a3b8', // slate
] as const

export function nextCategoryColor(usedCount: number): string {
  return CATEGORY_PALETTE[usedCount % CATEGORY_PALETTE.length] ?? CATEGORY_PALETTE[0]
}

let dbPromise: Promise<IDBPDatabase<PlannerDb>> | undefined

export function getDb(): Promise<IDBPDatabase<PlannerDb>> {
  dbPromise ??= openDB<PlannerDb>(DB_NAME, DB_VERSION, {
    async upgrade(db, oldVersion, _newVersion, transaction) {
      if (oldVersion < 1) {
        db.createObjectStore('categories', { keyPath: 'id' })

        const blockStore = db.createObjectStore('blocks', { keyPath: 'id' })
        blockStore.createIndex('by-week', 'weekId')
        blockStore.createIndex('by-category', 'categoryId')
      }

      if (oldVersion < 2) {
        // Старі блоки мали поле `order` замість реального часу — призначаємо
        // їм дефолтний проміжок, щоб нічого не загубити.
        const blockStore = transaction.objectStore('blocks')
        let cursor = await blockStore.openCursor()
        while (cursor) {
          const legacyBlock = cursor.value as Block & { order?: number }
          if (typeof legacyBlock.startMinutes !== 'number') {
            const { order: _order, ...rest } = legacyBlock
            await cursor.update({
              ...rest,
              startMinutes: LEGACY_START_MINUTES,
              durationMinutes: LEGACY_DURATION_MINUTES,
            })
          }
          cursor = await cursor.continue()
        }
      }
    },
  }).then(async (db) => {
    await seedDefaultCategories(db)
    return db
  })

  return dbPromise
}

async function seedDefaultCategories(db: IDBPDatabase<PlannerDb>): Promise<void> {
  const existing = await db.count('categories')
  if (existing > 0) return

  const tx = db.transaction('categories', 'readwrite')
  await Promise.all(
    DEFAULT_CATEGORY_NAMES.map((name, index) =>
      tx.store.put({
        id: crypto.randomUUID(),
        name,
        color: nextCategoryColor(index),
        order: index,
        archived: false,
      }),
    ),
  )
  await tx.done
}
