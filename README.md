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

Social links are read at build time from Vite env vars (keys only in `.env.example`):

- `VITE_LINKEDIN_URL`
- `VITE_GITHUB_URL`
- `VITE_EMAIL`

Copy `.env.example` to `.env` and fill in your values locally. On Vercel, set the same three variables in **Project Settings → Environment Variables**, then redeploy.

## Assets

- Resume: `public/resume.pdf`
- Profile photo: `public/profile.png` 

## Stack

Vite, React 19, TypeScript, plain CSS, `@vercel/analytics`.

On Vercel, enable **Web Analytics** in the project dashboard after deploy.
