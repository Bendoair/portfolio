# Benedek Simon - Portfolio

Simple personal portfolio (Vite + React + TypeScript). Dark neon palette, Brittany Chiang-style sticky intro layout.

## Quick start

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Environment

Copy `.env.example` to `.env` and fill in values locally. On Vercel, set the same keys in **Project Settings → Environment Variables**, then redeploy.

Social links (build-time Vite):

- `VITE_LINKEDIN_URL`
- `VITE_GITHUB_URL`
- `VITE_EMAIL`
- `VITE_SPOTIFY_EMBED_URL` (Starmap Spotify iframe `src`)

Starmap (server-only, for `/api/starmap*`):

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## Starmap

Interactive sky at `/starmap`. API routes need Upstash Redis.

For local API + frontend together:

```bash
npx vercel dev
```

Plain `npm run dev` serves the UI only; `/api/*` calls will fail without `vercel dev` (or a deployed backend).

## Assets

- Resume: `public/resume.pdf`
- Profile photo: `public/profile.png` 

## Stack

Vite, React 19, TypeScript, plain CSS, `@vercel/analytics`.

On Vercel, enable **Web Analytics** in the project dashboard after deploy.
