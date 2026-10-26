import { MAX_BRIGHTNESS, MIN_BRIGHTNESS } from '@shared/starmap/brightness'
import type { Star } from '@shared/starmap/types'

export function starDiameterPx(brightness: number): number {
  const t =
    (brightness - MIN_BRIGHTNESS) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS || 1)
  return 2.5 + Math.min(1, Math.max(0, t)) * 6
}

export function starOpacity(brightness: number): number {
  const t =
    (brightness - MIN_BRIGHTNESS) / (MAX_BRIGHTNESS - MIN_BRIGHTNESS || 1)
  return 0.4 + Math.min(1, Math.max(0, t)) * 0.6
}

export function starGlow(brightness: number): string {
  return `0 0 ${2 + brightness / 40}px rgba(232, 238, 248, 0.85)`
}

export function nearestStar(
  stars: Star[],
  x: number,
  y: number,
  maxDist: number,
): Star | null {
  let best: Star | null = null
  let bestDist = maxDist
  for (const star of stars) {
    const d = Math.hypot(star.x - x, star.y - y)
    if (d <= bestDist) {
      bestDist = d
      best = star
    }
  }
  return best
}
