export type Star = {
  id: string
  x: number
  y: number
  brightness: number
}

export type StarmapMeta = {
  lastPlacedAt: string | null
  lastBrightenedAt: string | null
}

export type StarmapSnapshot = {
  stars: Star[]
  meta: StarmapMeta
}

export type StarmapMode = 'browse' | 'brighten' | 'add'

export type Formation = {
  id: string
  name: string
  starIds: string[]
  edges: [string, string][]
}

export type ApiErrorBody = {
  error: string
  retryAt?: string
}
