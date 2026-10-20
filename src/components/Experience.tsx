import { useState } from 'react'
import { education, languages, volunteer, work, type ExperienceItem } from '../data/site'

type Tab = 'work' | 'education'

function ExperienceRow({ item }: { item: ExperienceItem }) {
  return (
    <article className="exp-row">
      <p className="exp-period">{item.period}</p>
      <div className="exp-body">
        <h3 className="exp-title">
          {item.title}{' '}
          <span className="exp-at">
            @{' '}
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.company}
              </a>
            ) : (
              item.company
            )}
          </span>
        </h3>
        <ul className="exp-bullets">
          {item.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        {item.tags && item.tags.length > 0 && (
          <ul className="tag-list">
            {item.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export function Experience() {
  const [tab, setTab] = useState<Tab>('work')

  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <h2 id="experience-heading" className="section-heading">
        Experience
      </h2>

      <div className="tabs" role="tablist" aria-label="Experience tabs">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'work'}
          className={tab === 'work' ? 'tab active' : 'tab'}
          onClick={() => setTab('work')}
        >
          Work
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'education'}
          className={tab === 'education' ? 'tab active' : 'tab'}
          onClick={() => setTab('education')}
        >
          Education
        </button>
      </div>

      {tab === 'work' && (
        <div role="tabpanel" className="tab-panel">
          <div className="exp-list">
            {work.map((item) => (
              <ExperienceRow key={`${item.company}-${item.period}`} item={item} />
            ))}
          </div>

          <div className="volunteer-block">
            <h3 className="subgroup-heading">Volunteer</h3>
            <div className="exp-list">
              {volunteer.map((item) => (
                <ExperienceRow key={`${item.company}-${item.period}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'education' && (
        <div role="tabpanel" className="tab-panel">
          <div className="exp-list">
            {education.map((item) => (
              <article key={item.degree} className="exp-row">
                <p className="exp-period">{item.period}</p>
                <div className="exp-body">
                  <h3 className="exp-title">
                    {item.degree}{' '}
                    <span className="exp-at">- {item.school}</span>
                  </h3>
                  <p className="edu-field">{item.field}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="languages-block">
            <h3 className="subgroup-heading">Languages</h3>
            <ul className="language-list">
              {languages.map((lang) => (
                <li key={lang.name}>
                  <span className="lang-name">{lang.name}</span>
                  <span className="lang-level">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
