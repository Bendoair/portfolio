/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LINKEDIN_URL: string
  readonly VITE_GITHUB_URL: string
  readonly VITE_EMAIL: string
  readonly VITE_SPOTIFY_EMBED_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
