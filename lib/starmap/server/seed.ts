import type { Star } from '../shared/types.js'

/** Fixed test stars so formations / UI can be tried immediately. */
export const SEED_STARS: Star[] = [
  // Cluster A — should form a constellation (all ≥ connection threshold)
  { id: 'seed-a1', x: 0.28, y: 0.32, brightness: 100 },
  { id: 'seed-a2', x: 0.34, y: 0.28, brightness: 95 },
  { id: 'seed-a3', x: 0.31, y: 0.38, brightness: 110 },
  { id: 'seed-a4', x: 0.38, y: 0.35, brightness: 102 },

  // Cluster B
  { id: 'seed-b1', x: 0.62, y: 0.25, brightness: 108 },
  { id: 'seed-b2', x: 0.68, y: 0.30, brightness: 98 },
  { id: 'seed-b3', x: 0.65, y: 0.36, brightness: 105 },

  // Scattered singles (some below connection threshold)
  { id: 'seed-c1', x: 0.15, y: 0.18, brightness: 100 },
  { id: 'seed-c2', x: 0.82, y: 0.22, brightness: 90 },
  { id: 'seed-c3', x: 0.48, y: 0.55, brightness: 40 },
  { id: 'seed-c4', x: 0.72, y: 0.58, brightness: 42 },
  { id: 'seed-c5', x: 0.22, y: 0.62, brightness: 100 },
]
