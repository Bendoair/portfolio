import {
  MAX_BRIGHTNESS,
  MIN_BRIGHTNESS,
  randomBrightenStep,
} from '../shared/brightness.js'
import {
  BRIGHTEN_COOLDOWN_MS,
  PLACE_COOLDOWN_MS,
  cooldownRemainingMs,
} from '../shared/cooldowns.js'
import type { Star, StarmapMeta, StarmapSnapshot } from '../shared/types.js'
import { META_KEY, STARS_KEY, getRedis } from './redis.js'
import { SEED_STARS } from './seed.js'

const EMPTY_META: StarmapMeta = {
  lastPlacedAt: null,
  lastBrightenedAt: null,
}

function parseStar(raw: unknown): Star | null {
  if (typeof raw === 'string') {
    try {
      return parseStar(JSON.parse(raw))
    } catch {
      return null
    }
  }
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (
    typeof o.id !== 'string' ||
    typeof o.x !== 'number' ||
    typeof o.y !== 'number' ||
    typeof o.brightness !== 'number'
  ) {
    return null
  }
  return {
    id: o.id,
    x: o.x,
    y: o.y,
    brightness: o.brightness,
  }
}

async function readMeta(): Promise<StarmapMeta> {
  const redis = getRedis()
  const raw = await redis.get<StarmapMeta | string>(META_KEY)
  if (!raw) return { ...EMPTY_META }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw) as StarmapMeta
      return {
        lastPlacedAt: parsed.lastPlacedAt ?? null,
        lastBrightenedAt: parsed.lastBrightenedAt ?? null,
      }
    } catch {
      return { ...EMPTY_META }
    }
  }
  return {
    lastPlacedAt: raw.lastPlacedAt ?? null,
    lastBrightenedAt: raw.lastBrightenedAt ?? null,
  }
}

async function writeMeta(meta: StarmapMeta): Promise<void> {
  const redis = getRedis()
  await redis.set(META_KEY, meta)
}

async function readStars(): Promise<Star[]> {
  const redis = getRedis()
  const hash = await redis.hgetall<Record<string, unknown>>(STARS_KEY)
  const stars: Star[] = []
  if (hash) {
    for (const value of Object.values(hash)) {
      const star = parseStar(value)
      if (star) stars.push(star)
    }
  }
  return stars
}

async function ensureSeedStars(): Promise<Star[]> {
  const existing = await readStars()
  const have = new Set(existing.map((s) => s.id))
  const missing = SEED_STARS.filter((s) => !have.has(s.id))

  if (missing.length === 0) return existing

  const redis = getRedis()
  const payload: Record<string, Star> = {}
  for (const star of missing) {
    payload[star.id] = star
  }
  await redis.hset(STARS_KEY, payload)
  return [...existing, ...missing]
}

export async function getSnapshot(): Promise<StarmapSnapshot> {
  const [stars, meta] = await Promise.all([ensureSeedStars(), readMeta()])
  return { stars, meta }
}

export async function placeStar(
  x: number,
  y: number,
): Promise<
  { star: Star; meta: StarmapMeta } | { error: string; retryAt?: string }
> {
  if (
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    Number.isNaN(x) ||
    Number.isNaN(y) ||
    x < 0 ||
    x > 1 ||
    y < 0 ||
    y > 1
  ) {
    return { error: 'Coordinates must be numbers between 0 and 1' }
  }

  const meta = await readMeta()
  const remaining = cooldownRemainingMs(meta.lastPlacedAt, PLACE_COOLDOWN_MS)
  if (remaining > 0) {
    const retryAt = new Date(
      Date.parse(meta.lastPlacedAt!) + PLACE_COOLDOWN_MS,
    ).toISOString()
    return { error: 'Place cooldown active', retryAt }
  }

  const star: Star = {
    id: crypto.randomUUID(),
    x,
    y,
    brightness: MIN_BRIGHTNESS,
  }

  const nextMeta: StarmapMeta = {
    ...meta,
    lastPlacedAt: new Date().toISOString(),
  }

  const redis = getRedis()
  await redis.hset(STARS_KEY, { [star.id]: star })
  await writeMeta(nextMeta)

  return { star, meta: nextMeta }
}

export async function brightenStar(
  id: string,
): Promise<
  { star: Star; meta: StarmapMeta } | { error: string; retryAt?: string }
> {
  if (typeof id !== 'string' || !id) {
    return { error: 'Star id is required' }
  }

  const meta = await readMeta()
  const remaining = cooldownRemainingMs(
    meta.lastBrightenedAt,
    BRIGHTEN_COOLDOWN_MS,
  )
  if (remaining > 0) {
    const retryAt = new Date(
      Date.parse(meta.lastBrightenedAt!) + BRIGHTEN_COOLDOWN_MS,
    ).toISOString()
    return { error: 'Brighten cooldown active', retryAt }
  }

  const redis = getRedis()
  const raw = await redis.hget<unknown>(STARS_KEY, id)
  const existing = parseStar(raw)
  if (!existing) {
    return { error: 'Star not found' }
  }

  const star: Star = {
    ...existing,
    brightness: Math.min(
      MAX_BRIGHTNESS,
      existing.brightness + randomBrightenStep(),
    ),
  }

  const nextMeta: StarmapMeta = {
    ...meta,
    lastBrightenedAt: new Date().toISOString(),
  }

  await redis.hset(STARS_KEY, { [star.id]: star })
  await writeMeta(nextMeta)

  return { star, meta: nextMeta }
}
