import { IndexedDbPlannerStore } from './IndexedDbPlannerStore'
import type { PlannerStore } from './PlannerStore'

export type { PlannerStore } from './PlannerStore'

let storeInstance: PlannerStore | undefined

/**
 * Єдина точка входу для отримання стору. Решта коду не знає, яка
 * реалізація за нею стоїть — заміна на gRPC-клієнт до Go-бекенду
 * відбувається тільки тут.
 */
export function getStore(): PlannerStore {
  storeInstance ??= new IndexedDbPlannerStore()
  return storeInstance
}
