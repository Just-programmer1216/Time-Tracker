import { computed, ref, watchEffect } from 'vue'

export type UiScaleStep = 1 | 2 | 3

const STORAGE_KEY = 'tmt-ui-scale'

// Відсоток від базового розміру шрифту (html), від якого рахуються всі rem у Tailwind.
const SCALE_PERCENT: Record<UiScaleStep, number> = { 1: 100, 2: 110, 3: 125 }

function getStoredStep(): UiScaleStep {
  const stored = Number(localStorage.getItem(STORAGE_KEY))
  return stored === 2 || stored === 3 ? stored : 1
}

const step = ref<UiScaleStep>(getStoredStep())
const scalePercent = computed(() => SCALE_PERCENT[step.value])
// Для розмірів у пікселях (таймлайн) та іконок, які не залежать від rem.
const scaleFactor = computed(() => scalePercent.value / 100)

watchEffect(() => {
  document.documentElement.style.fontSize = `${scalePercent.value}%`
  document.documentElement.style.setProperty('--ui-scale', String(scaleFactor.value))
  localStorage.setItem(STORAGE_KEY, String(step.value))
})

export function useUiScale() {
  function setStep(next: UiScaleStep): void {
    step.value = next
  }

  return { step, scalePercent, scaleFactor, setStep }
}
