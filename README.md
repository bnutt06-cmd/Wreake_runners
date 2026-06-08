# Wreake Runners — Website Redesign (POC)

A modern, mobile-friendly rebuild of the Wreake Runners club website, built with
**Next.js 14** (App Router). Designed around the club's logo colours (deep navy
wordmark + teal/blue swoosh).

## What's included

- **Home** — animated hero, club stats, latest news.
- **News** — card feed; click any article to read it.
- **Races & Events** — fixtures with a working sign-up form.
- **Member Login** — demo auth unlocking the members area.
- **Members Dashboard** — publish news posts that appear live on the site.

> **POC note:** login and data are in-memory for the demo. State resets on a full
> page reload. See "Going to production" below for the real auth/database path.

**Demo login:** username `member` · password `wreake`

---

## Run it locally

You'll need [Node.js](https://nodejs.org) 18.17 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy: GitHub → Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Wreake Runners redesign POC"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/wreake-runners.git
git push -u origin main
```

(Create the empty `wreake-runners` repo on GitHub first, via the "New repository"
button — no README, since this project already has one.)

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New… → Project**.
3. Import the `wreake-runners` repo.
4. Leave all settings as default (Vercel auto-detects Next.js).
5. Click **Deploy**.

You'll get a live URL like `wreake-runners.vercel.app` within a minute. Every future
`git push` to `main` redeploys automatically.

### 3. (Later) Custom domain

In the Vercel project: **Settings → Domains → Add**, then point
`wreakerunners.co.uk` at Vercel by updating the DNS records it shows you.

---

## Going to production

This POC fakes the dynamic parts. To make them real:

| Feature | POC (now) | Production |
|---|---|---|
| Member login | hard-coded `member`/`wreake` | Supabase Auth or Clerk |
| News posts | in-memory array | Supabase database table |
| Race sign-ups | in-memory object | Supabase table + email confirmation |
| Member roles | none | role column (committee vs member) |

The seed data and the single login check both live in `lib/data.js` and
`lib/store.js` — that's where Supabase calls would replace the mock logic, so the
UI doesn't need to change.

---

## Project structure

```
app/
  layout.js         # wraps everything: provider, nav, footer
  page.js           # home
  news/page.js      # news feed
  races/page.js     # races + sign-up
  login/page.js     # member login
  members/page.js   # members dashboard (publishing)
  globals.css       # fonts, CSS variables, base styles
components/
  Nav.js  Footer.js  News.js
lib/
  data.js           # brand colours + seed content
  store.js          # shared client state (swap for Supabase)
  styles.js         # design system / inline styles
```
