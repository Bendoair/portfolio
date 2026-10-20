import { site } from '../data/site'

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <h2 id="about-heading" className="section-heading">
        About
      </h2>
      <p className="about-text">{site.about}</p>
    </section>
  )
}
