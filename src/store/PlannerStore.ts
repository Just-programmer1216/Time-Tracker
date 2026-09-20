import type { Block, Category, CategoryStat } from '@/types'

/**
 * Єдина точка доступу до даних планувальника.
 * UI ніколи не звертається до IndexedDB напряму — тільки через цей інтерфейс.
 * Коли з'явиться Go-бекенд, додасться GrpcPlannerStore implements PlannerStore
 * і зміниться лише store/index.ts.
 */
export interface PlannerStore {
  getCategories(): Promise<Category[]>
  saveCategory(category: Category): Promise<void>
  deleteCategory(id: string): Promise<void>

  getBlocks(weekId: string): Promise<Block[]>
  saveBlock(block: Block): Promise<void>
  toggleBlockDone(id: string, done: boolean): Promise<void>
  deleteBlock(id: string): Promise<void>

  getWeekStats(weekId: string): Promise<CategoryStat[]>
}
