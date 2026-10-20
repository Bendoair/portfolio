export type SocialLink = {
  label: string
  href: string
}

function requireEnv(name: string): string {
  const value = import.meta.env[name] as string | undefined
  if (!value) {
    console.warn(`Missing env var: ${name}`)
    return ''
  }
  return value
}

const linkedIn = requireEnv('VITE_LINKEDIN_URL')
const github = requireEnv('VITE_GITHUB_URL')
const email = requireEnv('VITE_EMAIL')

/** Order: LinkedIn, GitHub, Email */
export const socials: SocialLink[] = [
  { label: 'LinkedIn', href: linkedIn },
  { label: 'GitHub', href: github },
  { label: 'Email', href: email ? `mailto:${email}` : '' },
].filter((s) => Boolean(s.href))

export const githubUrl = github
