import { type ReactNode } from 'react'
import { TbNorthStar } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { site, navItems } from '../data/site'
import { socials } from '../data/socials'
import { GitHubIcon, LinkedInIcon, MailIcon } from './SocialIcons'

type SidebarProps = {
  activeId: string
}

const socialIcons: Record<string, ReactNode> = {
  LinkedIn: <LinkedInIcon className="social-icon" />,
  GitHub: <GitHubIcon className="social-icon" />,
  Email: <MailIcon className="social-icon" />,
}

const SHOW_PROFILE = false

export function Sidebar({ activeId }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-identity">
        {SHOW_PROFILE && (
          <div className="profile-wrap">
            <img className="profile-img" src={site.profileImage} alt="" />
          </div>
        )}

        <h1 className="sidebar-name">{site.name}</h1>
        <p className="sidebar-role">{site.role}</p>
        <p className="sidebar-blurb">{site.blurb}</p>
        <p className="sidebar-location">{site.location}</p>
      </div>

      <nav className="sidebar-nav" aria-label="Section">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeId === item.id ? 'nav-link active' : 'nav-link'}
              >
                <span className="nav-indicator" aria-hidden="true" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <a className="resume-link" href={site.resumeUrl} target="_blank" rel="noreferrer">
          View Resume
        </a>
        <div className="starmap-teaser">
          <p className="starmap-teaser-text">“Sometimes, the stars gaze back.”</p>
          <Link
            className="starmap-teaser-btn"
            to="/starmap"
            aria-label="Open starmap"
            title="Starmap"
          >
            <TbNorthStar aria-hidden size={20} />
          </Link>
        </div>
        <ul className="social-list">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                {socialIcons[s.label] ?? s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
