import { githubUrl } from '../data/socials'

export function Footer() {
  return (
    <footer className="site-footer">
      <p>
        made with ❤️ by{' '}
        {githubUrl ? (
          <a href={githubUrl} target="_blank" rel="noreferrer">
            Bendoair
          </a>
        ) : (
          'Bendoair'
        )}
      </p>
    </footer>
  )
}
