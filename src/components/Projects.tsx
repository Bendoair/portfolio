import { contributions, projects } from '../data/site'
import { GitHubIcon, GlobeIcon } from './SocialIcons'

function ExternalLinks({ liveUrl, repoUrl }: { liveUrl?: string; repoUrl?: string }) {
  return (
    <span className="project-links">
      {liveUrl && (
        <a href={liveUrl} target="_blank" rel="noreferrer" aria-label="Live site" title="Live site">
          <GlobeIcon className="project-link-icon" />
        </a>
      )}
      {repoUrl && (
        <a href={repoUrl} target="_blank" rel="noreferrer" aria-label="GitHub repository" title="GitHub">
          <GitHubIcon className="project-link-icon" />
        </a>
      )}
    </span>
  )
}

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="section-heading">
        Projects
      </h2>

      <ul className="project-list">
        {projects.map((p) => (
          <li key={p.title} className="project-item">
            <div className="project-header">
              <h3 className="project-title">{p.title}</h3>
              <ExternalLinks liveUrl={p.liveUrl} repoUrl={p.repoUrl} />
            </div>
            <p className="project-desc">{p.description}</p>
          </li>
        ))}
      </ul>

      <div className="contributions-block">
        <h3 className="subgroup-heading">Contributions</h3>
        <ul className="contribution-list">
          {contributions.map((c) => (
            <li key={c.title} className="contribution-item">
              <span className="contribution-title">{c.title}</span>
              <ExternalLinks liveUrl={c.liveUrl} repoUrl={c.repoUrl} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
