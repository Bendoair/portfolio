import { site, navItems } from '../data/site'
import { socials } from '../data/socials'
import { useState, type ReactNode } from 'react'
import { GitHubIcon, LinkedInIcon, MailIcon } from './SocialIcons'

type SidebarProps = {
  activeId: string
}

const socialIcons: Record<string, ReactNode> = {
  LinkedIn: <LinkedInIcon className="social-icon" />,
  GitHub: <GitHubIcon className="social-icon" />,
  Email: <MailIcon className="social-icon" />,
}

export function Sidebar({ activeId }: SidebarProps) {
  const [imgOk, setImgOk] = useState(true)

  return (
    <aside className="sidebar">
      <div className="sidebar-identity">
        <div className="profile-wrap" aria-hidden={!imgOk}>
          {imgOk ? (
            <img
              className="profile-img"
              src={site.profileImage}
              alt=""
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="profile-placeholder" aria-hidden="true">
              BS
            </div>
          )}
        </div>

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
