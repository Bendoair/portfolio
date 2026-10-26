import { About } from '../components/About'
import { Experience } from '../components/Experience'
import { Footer } from '../components/Footer'
import { Projects } from '../components/Projects'
import { Sidebar } from '../components/Sidebar'
import { useScrollSpy } from '../hooks/useScrollSpy'

const SECTION_IDS = ['about', 'experience', 'projects']

export function Home() {
  const activeId = useScrollSpy(SECTION_IDS)

  return (
    <div className="page">
      <div className="page-glow" aria-hidden="true" />
      <div className="layout">
        <Sidebar activeId={activeId} />
        <main className="main">
          <About />
          <Experience />
          <Projects />
          <Footer />
        </main>
      </div>
    </div>
  )
}
