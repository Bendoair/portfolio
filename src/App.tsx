import { Analytics } from '@vercel/analytics/react'
import { useEffect, useState, type AnimationEvent } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  type Location,
} from 'react-router-dom'
import { Home } from './pages/Home'
import { StarMap } from './pages/starmap/StarMap'

const EXIT_MS = 550

const routes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/starmap" element={<StarMap />} />
  </>
)

function AnimatedRoutes() {
  const location = useLocation()
  const [rendered, setRendered] = useState(location)
  const [exiting, setExiting] = useState<Location | null>(null)
  const [dir, setDir] = useState<'from-right' | 'from-left' | null>(null)

  if (location.pathname !== rendered.pathname && exiting == null) {
    setExiting(rendered)
    setRendered(location)
    setDir(location.pathname === '/starmap' ? 'from-right' : 'from-left')
  }

  useEffect(() => {
    if (exiting == null) return
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(
      () => {
        setExiting(null)
        setDir(null)
      },
      reduced ? 0 : EXIT_MS,
    )
    return () => window.clearTimeout(timeout)
  }, [exiting])

  const onExitEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.animationName !== 'route-exit') return
    setExiting(null)
    setDir(null)
  }

  return (
    <div className="route-transition">
      {exiting && dir && (
        <div
          className={`route-layer route-exit route-exit--${dir}`}
          onAnimationEnd={onExitEnd}
          aria-hidden
        >
          <Routes location={exiting}>{routes}</Routes>
        </div>
      )}
      <div
        className={
          exiting && dir
            ? `route-layer route-enter route-enter--${dir}`
            : 'route-layer'
        }
      >
        <Routes location={rendered}>{routes}</Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <Analytics />
    </BrowserRouter>
  )
}
