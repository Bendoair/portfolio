import type {
  AnimationEvent,
  MouseEvent,
  PointerEvent,
  RefObject,
} from 'react'
import {
  TbBrightnessUp,
  TbFlame,
  TbNorthStar,
  TbSearch,
} from 'react-icons/tb'
import type { Formation, Star, StarmapMode } from '@shared/starmap/types'
import type { OrbitDot, PendingFx } from './useStarmap'
import { starDiameterPx, starGlow, starOpacity } from './starVisuals'

type StarFieldProps = {
  mode: StarmapMode
  stars: Star[]
  formations: Formation[]
  byId: Map<string, Star>
  skyRef: RefObject<HTMLDivElement | null>
  cursorPos: { x: number; y: number } | null
  pendingFx: PendingFx | null
  orbitDot: OrbitDot | null
  appearing: Record<string, number>
  hoveredFormationId: string | null
  litStarIds: Set<string> | null
  brightenHoverStar: Star | null
  onPointerMove: (e: PointerEvent<HTMLDivElement>) => void
  onPointerLeave: () => void
  onClick: (e: MouseEvent<HTMLDivElement>) => void
  onStarAppearEnd: (e: AnimationEvent<HTMLSpanElement>) => void
}

function Mountains() {
  return (
    <div className="starmap-mountains" aria-hidden="true">
      <svg viewBox="0 0 1200 220" preserveAspectRatio="none">
        <path
          fill="var(--mountain-far)"
          d="M0 220 V120 L80 95 160 130 260 70 340 115 430 55 520 100 610 45 720 90 820 50 920 105 1020 65 1120 110 1200 80 V220 Z"
          opacity="0.85"
        />
        <path
          fill="var(--mountain-mid)"
          d="M0 220 V145 L100 120 190 155 290 100 390 140 500 85 610 130 730 95 850 140 970 105 1100 145 1200 120 V220 Z"
        />
        <path
          fill="var(--mountain-near)"
          d="M0 220 V175 L140 155 250 185 380 150 520 180 670 145 820 175 960 150 1100 180 1200 160 V220 Z"
        />
      </svg>
    </div>
  )
}

export function StarField({
  mode,
  stars,
  formations,
  byId,
  skyRef,
  cursorPos,
  pendingFx,
  orbitDot,
  appearing,
  hoveredFormationId,
  litStarIds,
  brightenHoverStar,
  onPointerMove,
  onPointerLeave,
  onClick,
  onStarAppearEnd,
}: StarFieldProps) {
  const ModeIcon =
    mode === 'add' ? TbNorthStar : mode === 'brighten' ? TbFlame : TbSearch

  return (
    <div className="starmap-frame-inner">
      <Mountains />

      <div
        ref={skyRef}
        className="starmap-sky"
        data-mode={mode}
        role="img"
        aria-label="Interactive star sky"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={onClick}
      >
        <svg
          className="starmap-lines"
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {formations.map((f) =>
            f.edges.map(([a, b]) => {
              const sa = byId.get(a)
              const sb = byId.get(b)
              if (!sa || !sb) return null
              const lit = f.id === hoveredFormationId
              return (
                <line
                  key={`${f.id}-${a}-${b}`}
                  className={`starmap-line${lit ? ' is-lit' : ''}`}
                  x1={sa.x}
                  y1={sa.y}
                  x2={sb.x}
                  y2={sb.y}
                />
              )
            }),
          )}
        </svg>

        {formations.map((f) => {
          const members = f.starIds
            .map((id) => byId.get(id))
            .filter((s): s is Star => Boolean(s))
          if (members.length === 0) return null
          const lowest = members.reduce((a, b) => (a.y >= b.y ? a : b))
          const lit = f.id === hoveredFormationId
          return (
            <span
              key={`label-${f.id}`}
              className={`starmap-formation-label${lit ? ' is-lit' : ''}`}
              style={{
                left: `${lowest.x * 100}%`,
                top: `${lowest.y * 100}%`,
              }}
            >
              {f.name}
            </span>
          )
        })}

        {stars.map((star) => {
          const d = starDiameterPx(star.brightness)
          const lit = litStarIds?.has(star.id) ?? false
          const appearKey = appearing[star.id]
          const isAppearing = appearKey != null
          return (
            <span
              key={`${star.id}:${appearKey ?? 'rest'}`}
              data-star-id={star.id}
              className={`starmap-star${lit ? ' is-lit' : ''}${isAppearing ? ' is-appearing' : ''}`}
              style={{
                left: `${star.x * 100}%`,
                top: `${star.y * 100}%`,
                width: d,
                height: d,
                opacity: starOpacity(star.brightness),
                boxShadow: starGlow(star.brightness),
              }}
              onAnimationEnd={onStarAppearEnd}
            />
          )
        })}

        {orbitDot && pendingFx && (
          <span
            className="starmap-orbit-dot"
            style={{
              left: `${orbitDot.leftPct}%`,
              top: `${orbitDot.topPct}%`,
              opacity: orbitDot.opacity,
            }}
            aria-hidden
          />
        )}

        {cursorPos && (
          <ModeIcon
            className="starmap-cursor"
            data-mode={mode}
            size={22}
            style={{
              left: `${cursorPos.x * 100}%`,
              top: `${cursorPos.y * 100}%`,
            }}
            aria-hidden
          />
        )}
      </div>

      {brightenHoverStar && (
        <div
          className="starmap-brightness-pill"
          style={{
            left: `${brightenHoverStar.x * 100}%`,
            top: `${brightenHoverStar.y * 100}%`,
          }}
        >
          <TbBrightnessUp size={14} aria-hidden />
          <span>{brightenHoverStar.brightness}</span>
        </div>
      )}
    </div>
  )
}
