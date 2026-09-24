import { ref, watch } from 'vue'

import { getStore } from '@/store'
import type { Block } from '@/types'
import { getDueReminders, reminderKey } from '@/utils/reminders'
import { minutesToTimeString } from '@/utils/time'
import { getIsoDayOfWeek, getIsoWeekId } from '@/utils/week'

export type ReminderPermission = 'unsupported' | NotificationPermission

const SETTINGS_KEY = 'tmt-reminders'
const NOTIFIED_KEY = 'tmt-reminders-notified'
const CHECK_INTERVAL_MS = 30_000

export const REMIND_BEFORE_OPTIONS = [0, 5, 10, 15, 30]

const store = getStore()

interface StoredSettings {
  enabled: boolean
  leadMinutes: number
}

function loadSettings(): StoredSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') as Partial<StoredSettings>
    return {
      enabled: parsed.enabled === true,
      leadMinutes: REMIND_BEFORE_OPTIONS.includes(parsed.leadMinutes ?? -1) ? (parsed.leadMinutes as number) : 10,
    }
  } catch {
    return { enabled: false, leadMinutes: 10 }
  }
}

/** Показані нагадування зберігаються по днях, щоб перезавантаження сторінки не повторювало їх. */
function loadNotified(todayKey: string): Set<string> {
  try {
    const parsed = JSON.parse(localStorage.getItem(NOTIFIED_KEY) ?? '{}') as { day?: string; keys?: string[] }
    return parsed.day === todayKey ? new Set(parsed.keys ?? []) : new Set()
  } catch {
    return new Set()
  }
}

function saveNotified(todayKey: string, keys: Set<string>): void {
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify({ day: todayKey, keys: [...keys] }))
}

const initial = loadSettings()
const isSupported = typeof window !== 'undefined' && 'Notification' in window

const enabled = ref(initial.enabled)
const leadMinutes = ref(initial.leadMinutes)
const permission = ref<ReminderPermission>(isSupported ? Notification.permission : 'unsupported')

/**
 * Доставка сповіщення. Через service worker (на Android `new Notification()`
 * не працює); якщо SW ще немає (dev-режим) — звичайний Notification.
 */
async function show(title: string, body: string, tag: string): Promise<void> {
  const registration = await navigator.serviceWorker?.getRegistration()
  if (registration) {
    await registration.showNotification(title, { body, tag, icon: '/icon.svg' })
  } else {
    new Notification(title, { body, tag, icon: '/icon.svg' })
  }
}

function describe(block: Block, now: Date): string {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const range = `${minutesToTimeString(block.startMinutes)}–${minutesToTimeString(block.startMinutes + block.durationMinutes)}`
  const minutesLeft = block.startMinutes - nowMinutes
  const when = minutesLeft > 0 ? `Починається через ${minutesLeft} хв` : 'Починається зараз'
  return `${when} · ${range}`
}

// Паралельні перевірки (старт планувальника + зміна налаштувань) показали б одне нагадування двічі,
// бо "вже показані" записуються лише після await — тому перевірки йдуть по одній.
let inFlight: Promise<void> | null = null

function check(): Promise<void> {
  inFlight ??= runCheck().finally(() => {
    inFlight = null
  })
  return inFlight
}

async function runCheck(): Promise<void> {
  if (isSupported) permission.value = Notification.permission
  if (!enabled.value || permission.value !== 'granted') return

  const now = new Date()
  const todayKey = `${getIsoWeekId(now)}:${getIsoDayOfWeek(now)}`
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  // Беремо реальний "сьогодні", а не тиждень, який зараз відкритий у календарі.
  const weekBlocks = await store.getBlocks(getIsoWeekId(now))
  const todayBlocks = weekBlocks.filter((block) => block.dayOfWeek === getIsoDayOfWeek(now))

  const notified = loadNotified(todayKey)
  const due = getDueReminders(todayBlocks, nowMinutes, leadMinutes.value, notified)

  for (const block of due) {
    notified.add(reminderKey(block))
    await show(block.title, describe(block, now), reminderKey(block))
  }
  if (due.length > 0) saveNotified(todayKey, notified)
}

let timer: ReturnType<typeof setInterval> | undefined

function startScheduler(): void {
  if (timer !== undefined) return
  void check()
  timer = setInterval(() => void check(), CHECK_INTERVAL_MS)
}

function stopScheduler(): void {
  if (timer === undefined) return
  clearInterval(timer)
  timer = undefined
}

watch(
  [enabled, permission],
  ([isEnabled, currentPermission]) => {
    if (isEnabled && currentPermission === 'granted') startScheduler()
    else stopScheduler()
  },
  { immediate: true },
)

watch([enabled, leadMinutes], () => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ enabled: enabled.value, leadMinutes: leadMinutes.value }))
  void check()
})

// Після повернення до вкладки/застосунку одразу перевіряємо — таймери у фоні можуть бути призупинені.
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void check()
  })
}

export function useReminders() {
  /** Вмикає/вимикає нагадування; при першому вмиканні просить дозвіл у браузера. */
  async function setEnabled(next: boolean): Promise<void> {
    if (!next) {
      enabled.value = false
      return
    }
    if (!isSupported) return

    if (Notification.permission === 'default') {
      permission.value = await Notification.requestPermission()
    } else {
      permission.value = Notification.permission
    }
    enabled.value = permission.value === 'granted'
  }

  async function sendTest(): Promise<void> {
    if (permission.value !== 'granted') return
    await show('TMT — тестове сповіщення', 'Так виглядатиме нагадування про блок.', 'tmt-test')
  }

  return { enabled, leadMinutes, permission, setEnabled, sendTest }
}
