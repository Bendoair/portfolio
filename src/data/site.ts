export type ExperienceItem = {
  title: string
  company: string
  period: string
  bullets: string[]
  tags?: string[]
  url?: string
}

export type EducationItem = {
  degree: string
  field: string
  school: string
  period: string
}

export type ProjectItem = {
  title: string
  description: string
  liveUrl?: string
  repoUrl?: string
}

export type ContributionItem = {
  title: string
  liveUrl?: string
  repoUrl?: string
}

export const site = {
  name: 'Benedek Simon',
  role: 'Mobile and Full-stack Developer',
  location: 'Budapest, Hungary',
  blurb: 'Building clean mobile and web products.',
  resumeUrl: '/resume.pdf',
  profileImage: '/profile.png',
  about: `I'm a full-stack and mobile developer based in Budapest. I care about clean code, solid architecture, and shipping features end to end - from Android and Flutter to modern web stacks. Currently finishing an MSc in software development at BME.`,
}

export const work: ExperienceItem[] = [
  {
    title: 'Software Developer',
    company: 'Myner AG',
    period: 'Jun 2026 - Aug 2026',
    url: 'https://mynerapp.com/',
    bullets: [
      'Startup environment with diverse ownership across the stack.',
      'Mobile application development for Android and iOS.',
      'Internal tools: end-to-end features, AI-driven development, independent ideation.',
    ],
    tags: ['Mobile', 'Android', 'iOS', 'Internal Tools'],
  },
  {
    title: 'Software Developer',
    company: 'MI Software',
    period: 'Jun 2025 - Mar 2026',
    url: 'https://www.misoftware.hu',
    bullets: [
      'Software development internship focused on product quality.',
      'Accessibility and UI optimization.',
      'Full-stack web development and Android work.',
    ],
    tags: ['Accessibility', 'Full-stack', 'Android'],
  },
  {
    title: 'Software Developer Intern',
    company: 'Morgan Stanley Hungary',
    period: 'Jun 2024 - Aug 2024',
    url: 'https://www.morganstanley.com/',
    bullets: [
      'Summer internship cycle on an internal trader tool.',
      'End-to-end design, testing, and delivery of a new feature.',
    ],
    tags: ['Fintech', 'Internal Tools'],
  },
]

export const volunteer: ExperienceItem[] = [
  {
    title: 'Operative Director',
    company: '2. Sík Sándor Cserkészcsapat',
    period: 'Sep 2018 - Oct 2025',
    url: 'https://siksandor.cserkesz.hu/',
    bullets: [
      'High-level management and team leadership in a volunteer scout organization.',
      'Completed an operative management training course.',
    ],
    tags: ['Leadership', 'Volunteer'],
  },
]

export const education: EducationItem[] = [
  {
    degree: 'MSc',
    field: 'Computer Science Engineering',
    school: 'Budapest University of Technology and Economics',
    period: '2025 - 2027',
  },
  {
    degree: 'BSc',
    field: 'Computer Science Engineering',
    school: 'Budapest University of Technology and Economics',
    period: '2021 - 2025',
  },
]

export const languages: { name: string; level: string }[] = [
  { name: 'Hungarian', level: 'Mother tongue' },
  { name: 'English', level: 'C1' },
  { name: 'Korean', level: 'A1' },
  { name: 'French', level: 'A2' },
  { name: 'German', level: 'A2' },
]

export const projects: ProjectItem[] = [
  {
    title: 'Myner',
    description:
      'Paid work on a live consumer mobile app for Android and iOS - end-to-end features in a startup product shipped to users.',
    liveUrl: 'https://mynerapp.com/',
  },
  {
    title: 'Voting Systems',
    description:
      'Infotainment site about how voting rules shape representation - guided tour, explainers, case study, games, and a live simulation.',
    liveUrl: 'https://voksrendszer.hu/',
    repoUrl: 'https://github.com/Bendoair/voting_systems',
  },
  {
    title: 'Flag Quiz',
    description:
      'Grid-based flag guessing game with timed rounds. Backend and leaderboard servers are currently offline.',
    liveUrl: 'https://flag-quiz-olive.vercel.app/',
    repoUrl: 'https://github.com/Bendoair/flag-quiz',
  },
]

export const contributions: ContributionItem[] = [
  {
    title: "Postechian's Portal",
    liveUrl: 'https://popo.poapper.club/',
    repoUrl: 'https://github.com/PoApper/popo-public-web',
  },
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
] as const
