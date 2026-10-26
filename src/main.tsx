import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { prefetchStarmap } from './pages/starmap/api'

// Start as soon as the bundle runs — don't wait for React effects
prefetchStarmap()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
