/** Клас Tailwind для заливки шкали прогресу за відсотком виконання. */
export function progressColorClass(percent: number): string {
  if (percent < 25) return 'bg-red-500'
  if (percent < 45) return 'bg-orange-500'
  if (percent < 70) return 'bg-yellow-500'
  return 'bg-emerald-500'
}
