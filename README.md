# Daily Focus

Web app for daily goals: subtasks, progress, streaks, and history. Authenticated users persist data in **Supabase**; the browser may cache state in **localStorage** for faster loads — it is **not** a second source of truth.

**Production:** [daily-focus-beta.vercel.app](https://daily-focus-beta.vercel.app/)

## What it does

- **Dashboard:** goals visible for the current weekday, checklist toggles, day completion and streak display.
- **Goals:** create, edit, archive, and set which weekdays each goal appears.
- **History / analytics:** past days, charts, and a consistency heatmap (data from stored daily records).
- **Auth:** Google OAuth via Supabase; Row Level Security (RLS) restricts rows to `auth.uid()`.

Conditional visibility uses weekday keys (e.g. Monday–Sunday) aligned with the in-app calendar day.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS |
| Motion | Framer Motion |
| Icons | Phosphor Icons |
| Backend | Supabase (Auth, Postgres, RLS) |
| Hosting | Vercel |

## Architecture (short)

- **Client state** in React holds the working copy while the user is signed in.
- **Supabase** is the authoritative store: goals, subtasks, `daily_records`, `user_preferences`.
- **localStorage** (`daily-focus:v1:state:*`) is an optional **read-through cache** of remote state for snappier boot — it does not drive migrations or automatic writes to the database.

## Security

- Tables use **RLS** so each user only reads and writes their own rows (`user_id = auth.uid()` where applicable).
- Apply all SQL migrations in `supabase/migrations/` before production use.

## Run locally

### Prerequisites

- Node.js 18+
- A Supabase project
- Google OAuth client (for “Sign in with Google”)

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |

### Supabase setup

1. Run migrations from `supabase/migrations/` in order in the SQL Editor.
2. Enable the Google provider under Authentication → Providers and configure OAuth credentials.
3. Add redirect URLs (e.g. `http://localhost:3000/auth/callback`, production and preview URLs as needed).

### Dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## CI

GitHub Actions runs `npm ci`, `npm run lint`, and `npm run build` on pushes and PRs to `main`. The build uses placeholder public env vars so secrets are not required for CI.

## Deployment

Connect the repo to **Vercel**, set the same `NEXT_PUBLIC_*` variables in the project settings, and deploy. Preview deployments use Vercel preview URLs; add those to Supabase redirect allowlists if you use OAuth on previews.

## License

Personal / portfolio use — all rights reserved.
