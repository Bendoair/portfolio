import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ModeToolbar } from './ModeToolbar'
import { StarField } from './StarField'
import { useStarmap } from './useStarmap'
import './starmap.css'

export function StarMap() {
  const [spotifyReady, setSpotifyReady] = useState(false)
  const sm = useStarmap()

  const spotifyEmbedUrl = (
    import.meta.env.VITE_SPOTIFY_EMBED_URL as string | undefined
  )?.trim()

  return (
    <div className="starmap-page">
      <div className="starmap-topbar">
        <Link className="starmap-back" to="/">
          ← Portfolio
        </Link>
      </div>

      <p className="starmap-intro">
        The dark night sky is illuminated by thousands of stars born over
        millenia. A life is built moment by moment, achievement by achievement.
        Stay a while, listen and wonder.
      </p>

      <div className="starmap-panel">
        <div
          className={`starmap-spotify${spotifyReady ? ' is-ready' : ''}${
            spotifyEmbedUrl ? '' : ' is-fallback'
          }`}
        >
          {spotifyEmbedUrl ? (
            <>
              <div className="starmap-spotify-loader" aria-hidden />
              <iframe
                title="Spotify"
                className="starmap-spotify-frame"
                src={spotifyEmbedUrl}
                onLoad={() => setSpotifyReady(true)}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </>
          ) : (
            <p className="starmap-spotify-fallback">
              Set <code>VITE_SPOTIFY_EMBED_URL</code> to show a playlist here.
            </p>
          )}
        </div>
        <p className="starmap-blurb">
          Add a new star, or brighten an existing one. The brightest ones form
          constellations.
        </p>
      </div>

      <div className="starmap-stage">
        <div className="starmap-frame">
          <ModeToolbar
            mode={sm.mode}
            onModeChange={(next) => {
              sm.setMode(next)
              sm.setHoverStarId(null)
            }}
            placeLeft={sm.placeLeft}
            brightenLeft={sm.brightenLeft}
          />

          <StarField
            mode={sm.mode}
            stars={sm.stars}
            formations={sm.formations}
            byId={sm.byId}
            skyRef={sm.skyRef}
            cursorPos={sm.cursorPos}
            pendingFx={sm.pendingFx}
            orbitDot={sm.orbitDot}
            appearing={sm.appearing}
            hoveredFormationId={sm.hoveredFormationId}
            litStarIds={sm.litStarIds}
            brightenHoverStar={sm.brightenHoverStar}
            onPointerMove={sm.onPointerMove}
            onPointerLeave={sm.onPointerLeave}
            onClick={sm.onClick}
            onStarAppearEnd={sm.onStarAppearEnd}
          />
        </div>
      </div>
    </div>
  )
}
