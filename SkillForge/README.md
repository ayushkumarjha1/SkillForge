# SkillForge X

A career management platform for students — track projects, build a profile,
generate resumes, plan your job/internship search, and get AI-powered
interview and resume feedback, all in one place.

Built with Node.js, Express, MongoDB (Mongoose), and EJS.

## Features

- **Auth** — register/login/logout, sessions persisted in MongoDB
- **Dashboard** — quick stats overview
- **Projects** — CRUD, search, filter, sort, pagination, categories, tags, cover images, status history
- **Profile** — bio, education, experience, skills, socials, public profile page (`/u/username`)
- **Resume Builder** — multiple versions, auto-imports Profile + Projects, live preview, PDF export (browser print)
- **Portfolio Builder** — pick featured projects and a theme for your public page
- **Certificates** — track certifications with optional image upload
- **Internship Tracker** — application status, deadlines
- **Job Tracker** — kanban board (Wishlist → Applied → Interview → Offer/Rejected)
- **Learning Hub** — courses/roadmaps with progress tracking
- **DSA Tracker** — problems by difficulty/topic, solve streak
- **Career Planner** — goals, tasks, habits
- **Analytics** — charts aggregating data across all modules
- **GitHub Integration** — public repo/profile stats by username (no login required)
- **Settings** — change password, delete account
- **Notification Center** — real-time events (job stage moves, new certificates)
- **Admin Panel** — role-gated user management and platform stats
- **AI Career Coach / Resume Analyzer / Mock Interview** — powered by the Anthropic API

## Setup

```bash
npm install
cp .env.example .env
# then fill in .env — see below
npm run dev
```

Visit `http://localhost:3000`.

## Environment Variables

See `.env.example` for the full list. Required:

- `MONGO_URI` — your MongoDB Atlas connection string
- `SESSION_SECRET` — any long random string

Optional:

- `ANTHROPIC_API_KEY` — required for the 3 AI modules (Career Coach, Resume Analyzer, Mock Interview). Without it, those pages load but show a clear "add your key" message instead of crashing.
- `GITHUB_TOKEN` — raises the GitHub Integration module's API rate limit from 60/hour to 5000/hour. Not required for basic use.
- `NODE_ENV=production` — set this when deploying (enables secure cookies, trusts the reverse proxy for correct HTTPS detection).

## Deployment Notes

Before deploying publicly:

1. Set `NODE_ENV=production`.
2. In MongoDB Atlas → Network Access, allow your hosting provider's IPs (or `0.0.0.0/0`).
3. Rotate your `MONGO_URI` password if it was ever shared/committed anywhere.
4. Make sure Helmet, CSRF protection, and rate limiting are added if this will be public-facing at scale — not included by default yet.

## Project Structure

```
controllers/   route handlers
models/        Mongoose schemas
routes/        Express routers
views/         EJS templates
public/        static CSS/JS
uploads/       user-uploaded images (covers, avatars, certificates)
config/        DB connection, file upload config
middleware/    auth guards
utils/         shared helpers (notifications, AI calls)
```
