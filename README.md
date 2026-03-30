# Daily Focus

A personal daily execution tracker built to turn consistency into a visible habit. Set goals with subtasks, track daily completion, review streaks, and analyze performance trends over time.

## Motivation

Staying consistent across multiple goals is hard without clear visibility into what's getting done and what's slipping. Daily Focus makes each day a concrete checklist — close it at 100% to extend your streak, and let the analytics show where you actually spend effort vs. where you fall off.

## Features

- **Daily dashboard** — goals with subtasks, progress bar, day-complete detection
- **Streaks** — consecutive full-day counter with visual feedback
- **History & analytics** — KPI cards, trend comparisons (7d / 30d), weekday pace breakdown, consistency heatmap
- **Goal management** — create, edit, archive, reorder; system goals with localized seed data
- **Per-goal deep stats** — completion rate, best/worst streaks, subtask bottleneck analysis
- **Consistency heatmap** — GitHub-style contribution grid with per-goal filtering
- **Multilanguage** — full English / Portuguese support with dictionary-based i18n (no heavy framework)
- **Google OAuth** — sign in with Google via Supabase Auth; data syncs across devices
- **Supabase backend** — goals, subtasks, daily records, and user preferences persisted with RLS
- **Local-first** — works offline with localStorage; syncs to Supabase when authenticated
- **LinkedIn Friday** — optional weekly LinkedIn posting checklist (appears on Fridays)

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Phosphor Icons](https://phosphoricons.com/) |
| Auth & DB | [Supabase](https://supabase.com/) (Auth, Postgres, RLS) |
| Hosting | Vercel (or any Node.js host) |

## CI & deployment

**GitHub Actions** runs a CI workflow on every **push** and **pull request** targeting `main`:

1. `npm ci` — install dependencies (uses npm cache)
2. `npm run lint` — ESLint
3. `npm run build` — Next.js production build (uses placeholder public env vars so the build does not require secrets)

The workflow fails the check if any step fails. There is no test script in this repo yet, so tests are not run.

**Hosting:** production and preview deployments are handled by **Vercel** through its [GitHub integration](https://vercel.com/docs/deployments/git/vercel-for-github). This repository does not deploy from GitHub Actions; CI only validates the code.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── goals/        # Goal management page
│   ├── history/      # Analytics and history page
│   └── auth/         # OAuth callback handler
├── components/       # React components
│   ├── boxes/        # Goal editor overlay
│   └── history/      # Heatmap, filters, day/goal detail modals
├── hooks/            # Custom React hooks (auth, state management)
├── providers/        # Context providers (auth, locale)
├── lib/
│   ├── i18n/         # Internationalization dictionaries and helpers
│   ├── repositories/ # Data access layer (local + Supabase)
│   ├── normalizers/  # State migration and data normalization
│   ├── supabase/     # Supabase client, auth, middleware
│   ├── cache/        # Local caching layer
│   └── ...           # Analytics, date utils, goal model, progress calc
├── data/             # Seed data for system goals
└── constants/        # UI constants

supabase/
├── migrations/       # SQL migrations (9 files, ordered)
└── reset/            # Schema reset script for development
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project (free tier works)
- Google OAuth credentials (for sign-in)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |

### 3. Set up Supabase

1. Run the SQL migrations in order from `supabase/migrations/` in your Supabase SQL Editor
2. Enable **Google** provider under Authentication > Providers (requires Google Cloud Console OAuth credentials)
3. Under Authentication > URL Configuration, add **Redirect URLs** for every environment that will complete Google OAuth (include `/auth/callback` on each origin):
   - Local: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback` (or your Vercel URL)
   - **Preview deployments:** add `https://*.vercel.app/auth/callback` if your Supabase plan supports wildcard redirect URLs, or add each preview URL as needed

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database & Migrations

Migrations live in `supabase/migrations/` and are numbered sequentially:

1. `001` — Goals table
2. `002` — Subtasks table
3. `003` — Daily records table
4. `004` — User preferences table
5. `005` — Row Level Security policies
6. `006` — Indexes and constraints
7. `007` — `updated_at` triggers
8. `008` — App compatibility columns
9. `009` — Language preference column

Apply them in order via the Supabase SQL Editor or CLI. A full reset script is available at `supabase/reset/reset_public_schema.sql`.

## Roadmap

- [ ] PWA support with offline sync queue
- [ ] Weekly/monthly summary emails
- [ ] Goal templates and sharing
- [ ] Dark/light theme toggle
- [ ] Mobile-native app (React Native)

## Screenshots

*Coming soon — deploy link and screenshots will be added here.*

## License

This project is part of a personal portfolio. All rights reserved.
