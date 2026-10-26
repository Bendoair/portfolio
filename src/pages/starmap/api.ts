import type {
  ApiErrorBody,
  Star,
  StarmapSnapshot,
} from '@shared/starmap/types'

type StarmapGlobal = typeof globalThis & {
  __starmapSnapshot?: StarmapSnapshot | null
  __starmapInflight?: Promise<StarmapSnapshot> | null
}

const g = globalThis as StarmapGlobal

async function readError(res: Response): Promise<ApiErrorBody> {
  try {
    return (await res.json()) as ApiErrorBody
  } catch {
    return { error: res.statusText || 'Request failed' }
  }
}

function getCache(): StarmapSnapshot | null {
  return g.__starmapSnapshot ?? null
}

function setCache(snapshot: StarmapSnapshot) {
  g.__starmapSnapshot = snapshot
}

function getInflight(): Promise<StarmapSnapshot> | null {
  return g.__starmapInflight ?? null
}

function setInflight(promise: Promise<StarmapSnapshot> | null) {
  g.__starmapInflight = promise
}

async function loadStarmap(): Promise<StarmapSnapshot> {
  const res = await fetch('/api/starmap')
  if (!res.ok) {
    const body = await readError(res)
    throw new Error(body.error || 'Failed to load starmap')
  }
  const snapshot = (await res.json()) as StarmapSnapshot
  setCache(snapshot)
  return snapshot
}

function beginLoad(): Promise<StarmapSnapshot> {
  const existing = getInflight()
  if (existing) return existing

  const promise = loadStarmap().finally(() => {
    if (getInflight() === promise) setInflight(null)
  })
  setInflight(promise)
  return promise
}

/** Sync read of any already-fetched snapshot (no network). */
export function getCachedStarmap(): StarmapSnapshot | null {
  return getCache()
}

/** Kick off a background fetch as early as possible; safe to call repeatedly. */
export function prefetchStarmap(): void {
  if (getCache() || getInflight()) return
  void beginLoad().catch(() => {
    /* allow a later fetchStarmap() to retry */
  })
}

export async function fetchStarmap(): Promise<StarmapSnapshot> {
  const cached = getCache()
  if (cached) return cached
  return beginLoad()
}

export async function apiPlaceStar(
  x: number,
  y: number,
): Promise<{ star: Star; meta: StarmapSnapshot['meta'] }> {
  const res = await fetch('/api/starmap/place', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ x, y }),
  })
  if (!res.ok) {
    const body = await readError(res)
    const err = new Error(body.error || 'Failed to place star') as Error & {
      retryAt?: string
    }
    err.retryAt = body.retryAt
    throw err
  }
  const result = (await res.json()) as {
    star: Star
    meta: StarmapSnapshot['meta']
  }
  const cached = getCache()
  if (cached) {
    setCache({
      stars: [...cached.stars, result.star],
      meta: result.meta,
    })
  }
  return result
}

export async function apiBrightenStar(
  id: string,
): Promise<{ star: Star; meta: StarmapSnapshot['meta'] }> {
  const res = await fetch('/api/starmap/brighten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) {
    const body = await readError(res)
    const err = new Error(body.error || 'Failed to brighten star') as Error & {
      retryAt?: string
    }
    err.retryAt = body.retryAt
    throw err
  }
  const result = (await res.json()) as {
    star: Star
    meta: StarmapSnapshot['meta']
  }
  const cached = getCache()
  if (cached) {
    setCache({
      stars: cached.stars.map((s) =>
        s.id === result.star.id ? result.star : s,
      ),
      meta: result.meta,
    })
  }
  return result
}
