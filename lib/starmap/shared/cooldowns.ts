export const PLACE_COOLDOWN_MS = 24 * 60 * 60 * 1000
export const BRIGHTEN_COOLDOWN_MS = 5 * 60 * 1000

export function cooldownRemainingMs(
  lastAt: string | null | undefined,
  cooldownMs: number,
  now = Date.now(),
): number {
  if (!lastAt) return 0
  const elapsed = now - Date.parse(lastAt)
  if (Number.isNaN(elapsed)) return 0
  return Math.max(0, cooldownMs - elapsed)
}

/** `H:MM:SS` for cooldown display (matches `--:--:--` placeholder). */
export function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
