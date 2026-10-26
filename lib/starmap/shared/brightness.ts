/** Brightness when a star is first placed */
export const MIN_BRIGHTNESS = 35

/** Hard cap when brightening */
export const MAX_BRIGHTNESS = 255

/** Inclusive range added per brighten action */
export const BRIGHTEN_STEP_MIN = 4
export const BRIGHTEN_STEP_MAX = 10

/** Stars below this are not eligible for constellation connections */
export const FORMATION_MIN_BRIGHTNESS = 50

export function clampBrightness(value: number): number {
  return Math.min(MAX_BRIGHTNESS, Math.max(MIN_BRIGHTNESS, Math.round(value)))
}

export function randomBrightenStep(): number {
  return (
    BRIGHTEN_STEP_MIN +
    Math.floor(Math.random() * (BRIGHTEN_STEP_MAX - BRIGHTEN_STEP_MIN + 1))
  )
}
