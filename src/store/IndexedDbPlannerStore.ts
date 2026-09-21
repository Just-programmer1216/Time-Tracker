import type { Block, Category, CategoryStat } from '@/types'

import { getDb } from './db'
import type { PlannerStore } from './PlannerStore'

export class IndexedDbPlannerStore implements PlannerStore {
  async getCategories(): Promise<Category[]> {
    const db = await getDb()
    const categories = await db.getAll('categories')
    return categories.filter((category) => !category.archived).sort((a, b) => a.order - b.order)
  }

  async saveCategory(category: Category): Promise<void> {
    const db = await getDb()
    await db.put('categories', category)
  }

  async deleteCategory(id: string): Promise<void> {
    const db = await getDb()
    const category = await db.get('categories', id)
    if (!category) return
    await db.put('categories', { ...category, archived: true })
  }

  async getBlocks(weekId: string): Promise<Block[]> {
    const db = await getDb()
    const blocks = await db.getAllFromIndex('blocks', 'by-week', weekId)
    return blocks.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startMinutes - b.startMinutes)
  }

  async saveBlock(block: Block): Promise<void> {
    const db = await getDb()
    await db.put('blocks', block)
  }

  async toggleBlockDone(id: string, done: boolean): Promise<void> {
    const db = await getDb()
    const block = await db.get('blocks', id)
    if (!block) return
    await db.put('blocks', { ...block, done })
  }

  async deleteBlock(id: string): Promise<void> {
    const db = await getDb()
    await db.delete('blocks', id)
  }

  async getWeekStats(weekId: string): Promise<CategoryStat[]> {
    const blocks = await this.getBlocks(weekId)
    const statsByCategory = new Map<string, CategoryStat>()

    for (const block of blocks) {
      const stat = statsByCategory.get(block.categoryId) ?? {
        categoryId: block.categoryId,
        total: 0,
        done: 0,
      }
      stat.total += 1
      if (block.done) stat.done += 1
      statsByCategory.set(block.categoryId, stat)
    }

    return [...statsByCategory.values()]
  }
}
