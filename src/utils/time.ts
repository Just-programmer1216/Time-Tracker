export function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours ?? 0) * 60 + (minutes ?? 0)
}

export function minutesToTimeString(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function formatTimeRange(startMinutes: number, durationMinutes: number): string {
  return `${minutesToTimeString(startMinutes)}–${minutesToTimeString(startMinutes + durationMinutes)}`
}

export function formatDuration(durationMinutes: number): string {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  if (hours === 0) return `${minutes} хв`
  if (minutes === 0) return `${hours} год`
  return `${hours} год ${minutes} хв`
}
