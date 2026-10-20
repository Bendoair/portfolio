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

## Deploy (Vercel)

1. Import this repo in Vercel.
2. Framework preset: **Vite** (build `npm run build`, output `dist`).
3. Set `VITE_LINKEDIN_URL`, `VITE_GITHUB_URL`, and `VITE_EMAIL`.
4. Deploy.

## Assets

- Resume: `public/resume.pdf`
- Profile photo: drop your image at `public/profile.jpg` (initials placeholder until then)

## Stack

Vite, React 19, TypeScript, plain CSS.
