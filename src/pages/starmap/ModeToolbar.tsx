import type { IconType } from 'react-icons'
import { TbClock, TbFlame, TbNorthStar, TbSearch } from 'react-icons/tb'
import { formatCountdown } from '@shared/starmap/cooldowns'
import type { StarmapMode } from '@shared/starmap/types'

type ModeToolbarProps = {
  mode: StarmapMode
  onModeChange: (mode: StarmapMode) => void
  placeLeft: number
  brightenLeft: number
}

const MODES: ReadonlyArray<{
  value: StarmapMode
  label: string
  Icon: IconType
  cooldownKey: 'brighten' | 'place' | null
}> = [
  { value: 'browse', label: 'Browse', Icon: TbSearch, cooldownKey: null },
  {
    value: 'brighten',
    label: 'Brighten',
    Icon: TbFlame,
    cooldownKey: 'brighten',
  },
  { value: 'add', label: 'Add star', Icon: TbNorthStar, cooldownKey: 'place' },
]

function ConstellationMark() {
  return (
    <svg
      className="starmap-mode-constellation"
      viewBox="0 0 36 12"
      width="36"
      height="12"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 9 L11 5.5 L18 3 L28 3 L34 9 M18 3 L22 10"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="2" cy="9" r="1.15" fill="currentColor" />
      <circle cx="11" cy="5.5" r="1.15" fill="currentColor" />
      <circle cx="18" cy="3" r="1.15" fill="currentColor" />
      <circle cx="28" cy="3" r="1.15" fill="currentColor" />
      <circle cx="34" cy="9" r="1.15" fill="currentColor" />
      <circle cx="22" cy="10" r="1.15" fill="currentColor" />
    </svg>
  )
}

export function ModeToolbar({
  mode,
  onModeChange,
  placeLeft,
  brightenLeft,
}: ModeToolbarProps) {
  return (
    <div className="starmap-modes" role="group" aria-label="Interaction mode">
      {MODES.map(({ value, label, Icon, cooldownKey }) => {
        const cooldownMs =
          cooldownKey === 'brighten'
            ? brightenLeft
            : cooldownKey === 'place'
              ? placeLeft
              : null
        const onCooldown = cooldownMs != null && cooldownMs > 0
        return (
          <div key={value} className="starmap-mode-seg">
            <button
              type="button"
              className="starmap-mode-btn"
              aria-pressed={mode === value}
              onClick={() => onModeChange(value)}
            >
              <span className="starmap-mode-label">
                <Icon className="starmap-mode-icon" size={18} aria-hidden />
                <span className={onCooldown ? 'is-cooled' : undefined}>
                  {label}
                </span>
              </span>
              <span className="starmap-mode-cooldown" aria-hidden>
                {cooldownMs != null ? (
                  <>
                    <TbClock size={11} aria-hidden />
                    <span>
                      {onCooldown ? formatCountdown(cooldownMs) : '--:--:--'}
                    </span>
                  </>
                ) : (
                  <ConstellationMark />
                )}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
