import { FORMATION_MIN_BRIGHTNESS } from '@shared/starmap/brightness'
import type { Formation, Star } from '@shared/starmap/types'

const PROXIMITY = 0.14
const MIN_CLUSTER = 3
const MAX_FORMATIONS = 6

const ADJECTIVES = [
  'Veiled',
  'Silent',
  'Ancient',
  'Drifting',
  'Hollow',
  'Pale',
  'Forgotten',
  'Ember',
  'Woven',
  'Distant',
  'Quiet',
  'Ashen',
  'Mirrored',
  'Wandering',
  'Faint',
  'Northern',
]

const NOUNS = [
  'Lyre',
  'Spire',
  'Crown',
  'Gate',
  'River',
  'Lantern',
  'Archive',
  'Needle',
  'Harbor',
  'Lattice',
  'Echo',
  'Anchor',
  'Orchard',
  'Rook',
  'Cipher',
  'Vigil',
]

function hashIds(ids: string[]): number {
  const s = [...ids].sort().join('|')
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function formationName(ids: string[]): string {
  const h = hashIds(ids)
  const adj = ADJECTIVES[h % ADJECTIVES.length]
  const noun = NOUNS[Math.floor(h / ADJECTIVES.length) % NOUNS.length]
  return `The ${adj} ${noun}`
}

function dist(a: Star, b: Star): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.hypot(dx, dy)
}

function mstEdges(stars: Star[]): [string, string][] {
  if (stars.length < 2) return []

  type Edge = { a: string; b: string; w: number }
  const edges: Edge[] = []
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      edges.push({
        a: stars[i].id,
        b: stars[j].id,
        w: dist(stars[i], stars[j]),
      })
    }
  }
  edges.sort((e1, e2) => e1.w - e2.w)

  const parent = new Map<string, string>()
  const find = (id: string): string => {
    let p = parent.get(id) ?? id
    while (p !== (parent.get(p) ?? p)) {
      p = parent.get(p) ?? p
    }
    parent.set(id, p)
    return p
  }
  const union = (a: string, b: string): boolean => {
    const ra = find(a)
    const rb = find(b)
    if (ra === rb) return false
    parent.set(ra, rb)
    return true
  }

  for (const s of stars) parent.set(s.id, s.id)

  const result: [string, string][] = []
  for (const e of edges) {
    if (union(e.a, e.b)) {
      result.push([e.a, e.b])
      if (result.length === stars.length - 1) break
    }
  }
  return result
}

export function computeFormations(stars: Star[]): Formation[] {
  if (stars.length === 0) return []

  const maxBrightness = Math.max(...stars.map((s) => s.brightness))
  const threshold = Math.max(
    FORMATION_MIN_BRIGHTNESS,
    Math.floor(0.25 * maxBrightness),
  )
  const eligible = stars.filter((s) => s.brightness >= threshold)
  if (eligible.length < MIN_CLUSTER) return []

  const byId = new Map(eligible.map((s) => [s.id, s]))
  const parent = new Map<string, string>()
  const find = (id: string): string => {
    let p = parent.get(id) ?? id
    while (p !== (parent.get(p) ?? p)) {
      p = parent.get(p) ?? p
    }
    parent.set(id, p)
    return p
  }
  const union = (a: string, b: string) => {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent.set(ra, rb)
  }

  for (const s of eligible) parent.set(s.id, s.id)

  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      if (dist(eligible[i], eligible[j]) <= PROXIMITY) {
        union(eligible[i].id, eligible[j].id)
      }
    }
  }

  const groups = new Map<string, Star[]>()
  for (const s of eligible) {
    const root = find(s.id)
    const list = groups.get(root) ?? []
    list.push(s)
    groups.set(root, list)
  }

  const clusters = [...groups.values()]
    .filter((g) => g.length >= MIN_CLUSTER)
    .map((g) => ({
      stars: g,
      brightnessSum: g.reduce((sum, s) => sum + s.brightness, 0),
    }))
    .sort((a, b) => b.brightnessSum - a.brightnessSum)
    .slice(0, MAX_FORMATIONS)

  return clusters.map((c) => {
    const starIds = c.stars.map((s) => s.id).sort()
    return {
      id: starIds.join('-'),
      name: formationName(starIds),
      starIds,
      edges: mstEdges(c.stars.map((s) => byId.get(s.id)!)),
    }
  })
}
