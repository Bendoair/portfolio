import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from 'react'
import {
  BRIGHTEN_COOLDOWN_MS,
  PLACE_COOLDOWN_MS,
  cooldownRemainingMs,
} from '@shared/starmap/cooldowns'
import type { Star, StarmapMeta, StarmapMode } from '@shared/starmap/types'
import {
  apiBrightenStar,
  apiPlaceStar,
  fetchStarmap,
  getCachedStarmap,
} from './api'
import { computeFormations } from './formations'
import { nearestStar } from './starVisuals'

const HIT_RADIUS = 0.035
const ORBIT_RADIUS_PX = 14
const ORBIT_BASE_OMEGA = 2.4
const ORBIT_SINE_AMP = 0.55
const SPIRAL_IN_MS = 300
const SPIRAL_OUT_MS = 420
const SPIRAL_OUT_RADIUS_PX = 42

export type FxPhase = 'orbit' | 'spiralIn' | 'spiralOut'

export type PendingFx = {
  cx: number
  cy: number
  phase: FxPhase
}

export type OrbitDot = {
  leftPct: number
  topPct: number
  opacity: number
}

export type UseStarmapResult = {
  mode: StarmapMode
  setMode: (mode: StarmapMode) => void
  stars: Star[]
  formations: ReturnType<typeof computeFormations>
  byId: Map<string, Star>
  placeLeft: number
  brightenLeft: number
  busy: boolean
  hoverStarId: string | null
  setHoverStarId: (id: string | null) => void
  cursorPos: { x: number; y: number } | null
  pendingFx: PendingFx | null
  orbitDot: OrbitDot | null
  appearing: Record<string, number>
  hoveredFormationId: string | null
  litStarIds: Set<string> | null
  brightenHoverStar: Star | null
  skyRef: RefObject<HTMLDivElement | null>
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void
  onPointerLeave: () => void
  onClick: (e: MouseEvent<HTMLDivElement>) => void
  onStarAppearEnd: (e: AnimationEvent<HTMLSpanElement>) => void
}

export function useStarmap(): UseStarmapResult {
  const cached = getCachedStarmap()
  const [mode, setMode] = useState<StarmapMode>('browse')
  const [stars, setStars] = useState<Star[]>(() => cached?.stars ?? [])
  const [meta, setMeta] = useState<StarmapMeta>(
    () =>
      cached?.meta ?? {
        lastPlacedAt: null,
        lastBrightenedAt: null,
      },
  )
  const [now, setNow] = useState(() => Date.now())
  const [busy, setBusy] = useState(false)
  const didAppearRef = useRef(false)
  const [hoverStarId, setHoverStarId] = useState<string | null>(null)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [pendingFx, setPendingFx] = useState<PendingFx | null>(null)
  const [orbitDot, setOrbitDot] = useState<OrbitDot | null>(null)
  const [appearing, setAppearing] = useState<Record<string, number>>({})

  const skyRef = useRef<HTMLDivElement>(null)
  const fxRef = useRef<{
    cx: number
    cy: number
    phase: FxPhase
    angle: number
    radiusPx: number
    opacity: number
    phaseStartedAt: number
    spiralFromRadius: number
    resolveSpiral: (() => void) | null
  } | null>(null)
  const rafRef = useRef<number | null>(null)
  const fxLastTimeRef = useRef<number | null>(null)
  const tickFxRef = useRef<(time: number) => void>(() => {})

  const formations = useMemo(() => computeFormations(stars), [stars])
  const byId = useMemo(() => new Map(stars.map((s) => [s.id, s])), [stars])

  const starToFormation = useMemo(() => {
    const map = new Map<string, string>()
    for (const f of formations) {
      for (const id of f.starIds) map.set(id, f.id)
    }
    return map
  }, [formations])

  const hoveredFormationId =
    mode === 'browse' && hoverStarId
      ? (starToFormation.get(hoverStarId) ?? null)
      : null

  const litStarIds = useMemo(() => {
    if (!hoveredFormationId) return null
    const f = formations.find((x) => x.id === hoveredFormationId)
    return f ? new Set(f.starIds) : null
  }, [formations, hoveredFormationId])

  const markAppearing = useCallback((ids: string[]) => {
    if (ids.length === 0) return
    setAppearing((prev) => {
      const next = { ...prev }
      for (const id of ids) next[id] = (next[id] ?? 0) + 1
      return next
    })
  }, [])

  const stopFxLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const clearFx = useCallback(() => {
    stopFxLoop()
    const pending = fxRef.current?.resolveSpiral
    fxRef.current = null
    setPendingFx(null)
    setOrbitDot(null)
    pending?.()
  }, [stopFxLoop])

  const publishDot = useCallback(() => {
    const fx = fxRef.current
    const sky = skyRef.current
    if (!fx || !sky) return
    const rect = sky.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const ox = (Math.cos(fx.angle) * fx.radiusPx) / rect.width
    const oy = (Math.sin(fx.angle) * fx.radiusPx) / rect.height
    setOrbitDot({
      leftPct: (fx.cx + ox) * 100,
      topPct: (fx.cy + oy) * 100,
      opacity: fx.opacity,
    })
  }, [])

  useEffect(() => {
    tickFxRef.current = (time: number) => {
      const fx = fxRef.current
      if (!fx) return

      const last = fxLastTimeRef.current ?? time
      fxLastTimeRef.current = time
      const dt = Math.min(0.05, (time - last) / 1000)

      if (fx.phase === 'orbit') {
        const omega =
          ORBIT_BASE_OMEGA * (1 + ORBIT_SINE_AMP * Math.sin(time / 1000))
        fx.angle += omega * dt
        fx.radiusPx = ORBIT_RADIUS_PX
        fx.opacity = 1
        publishDot()
        rafRef.current = requestAnimationFrame((t) => tickFxRef.current(t))
        return
      }

      const duration = fx.phase === 'spiralIn' ? SPIRAL_IN_MS : SPIRAL_OUT_MS
      const t = Math.min(1, (time - fx.phaseStartedAt) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      fx.angle += ORBIT_BASE_OMEGA * 3.2 * dt

      if (fx.phase === 'spiralIn') {
        fx.radiusPx = fx.spiralFromRadius * (1 - eased)
        fx.opacity = 1
      } else {
        fx.radiusPx =
          fx.spiralFromRadius +
          (SPIRAL_OUT_RADIUS_PX - fx.spiralFromRadius) * eased
        fx.opacity = 1 - eased
      }

      publishDot()

      if (t >= 1) {
        const resolve = fx.resolveSpiral
        fxRef.current = null
        setPendingFx(null)
        setOrbitDot(null)
        rafRef.current = null
        fxLastTimeRef.current = null
        resolve?.()
        return
      }

      rafRef.current = requestAnimationFrame((frame) => tickFxRef.current(frame))
    }
  }, [publishDot])

  const startOrbit = useCallback(
    (cx: number, cy: number) => {
      stopFxLoop()
      fxLastTimeRef.current = null
      fxRef.current = {
        cx,
        cy,
        phase: 'orbit',
        angle: Math.random() * Math.PI * 2,
        radiusPx: ORBIT_RADIUS_PX,
        opacity: 1,
        phaseStartedAt: performance.now(),
        spiralFromRadius: ORBIT_RADIUS_PX,
        resolveSpiral: null,
      }
      setPendingFx({ cx, cy, phase: 'orbit' })
      rafRef.current = requestAnimationFrame((t) => tickFxRef.current(t))
    },
    [stopFxLoop],
  )

  const runSpiral = useCallback((phase: 'spiralIn' | 'spiralOut') => {
    return new Promise<void>((resolve) => {
      const fx = fxRef.current
      if (!fx) {
        resolve()
        return
      }
      fx.phase = phase
      fx.phaseStartedAt = performance.now()
      fx.spiralFromRadius = fx.radiusPx
      fx.resolveSpiral = resolve
      setPendingFx({ cx: fx.cx, cy: fx.cy, phase })
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame((t) => tickFxRef.current(t))
      }
    })
  }, [])

  useEffect(() => () => clearFx(), [clearFx])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const snap = await fetchStarmap()
        if (cancelled) return
        setStars(snap.stars)
        setMeta(snap.meta)
        if (!didAppearRef.current) {
          didAppearRef.current = true
          markAppearing(snap.stars.map((s) => s.id))
        }
      } catch {
        if (cancelled) return
        /* load failed — sky stays empty */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [markAppearing])

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  const placeLeft = cooldownRemainingMs(meta.lastPlacedAt, PLACE_COOLDOWN_MS, now)
  const brightenLeft = cooldownRemainingMs(
    meta.lastBrightenedAt,
    BRIGHTEN_COOLDOWN_MS,
    now,
  )

  const toNorm = useCallback((clientX: number, clientY: number) => {
    const el = skyRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return null
    const x = (clientX - rect.left) / rect.width
    const y = (clientY - rect.top) / rect.height
    if (x < 0 || x > 1 || y < 0 || y > 1) return null
    return { x, y }
  }, [])

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const p = toNorm(e.clientX, e.clientY)
      if (!p) {
        setHoverStarId(null)
        setCursorPos(null)
        return
      }
      setCursorPos(p)
      if (mode === 'browse' || mode === 'brighten') {
        const hit = nearestStar(stars, p.x, p.y, HIT_RADIUS)
        setHoverStarId(hit?.id ?? null)
        return
      }
      setHoverStarId(null)
    },
    [mode, stars, toNorm],
  )

  const onPointerLeave = useCallback(() => {
    setHoverStarId(null)
    setCursorPos(null)
  }, [])

  const onClick = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      if (busy || mode === 'browse') return
      const p = toNorm(e.clientX, e.clientY)
      if (!p) return

      setBusy(true)

      let targetX = p.x
      let targetY = p.y
      let hit: Star | null = null

      if (mode === 'brighten') {
        hit = nearestStar(stars, p.x, p.y, HIT_RADIUS)
        if (hit) {
          targetX = hit.x
          targetY = hit.y
        }
      }

      startOrbit(targetX, targetY)

      try {
        if (mode === 'add') {
          const result = await apiPlaceStar(p.x, p.y)
          await runSpiral('spiralIn')
          setStars((prev) => [...prev, result.star])
          setMeta(result.meta)
          markAppearing([result.star.id])
        } else if (mode === 'brighten') {
          if (!hit) {
            await runSpiral('spiralOut')
            return
          }
          const result = await apiBrightenStar(hit.id)
          await runSpiral('spiralIn')
          setStars((prev) =>
            prev.map((s) => (s.id === result.star.id ? result.star : s)),
          )
          setMeta(result.meta)
          markAppearing([result.star.id])
        }
      } catch {
        await runSpiral('spiralOut')
      } finally {
        setBusy(false)
      }
    },
    [busy, markAppearing, mode, runSpiral, stars, startOrbit, toNorm],
  )

  const onStarAppearEnd = useCallback((e: AnimationEvent<HTMLSpanElement>) => {
    if (e.animationName !== 'starmap-star-appear') return
    const id = e.currentTarget.dataset.starId
    if (!id) return
    setAppearing((prev) => {
      if (!(id in prev)) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const brightenHoverStar =
    mode === 'brighten' && hoverStarId ? (byId.get(hoverStarId) ?? null) : null

  return {
    mode,
    setMode,
    stars,
    formations,
    byId,
    placeLeft,
    brightenLeft,
    busy,
    hoverStarId,
    setHoverStarId,
    cursorPos,
    pendingFx,
    orbitDot,
    appearing,
    hoveredFormationId,
    litStarIds,
    brightenHoverStar,
    skyRef,
    onPointerMove,
    onPointerLeave,
    onClick,
    onStarAppearEnd,
  }
}
