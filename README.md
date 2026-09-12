# ACM at UTA — Official Website

The complete website and member portal for ACM at UT Arlington. Built in Vite + React + TypeScript with a Supabase backend.

---

## Table of Contents

1. [Tech stack](#tech-stack)
2. [Design system](#design-system)
3. [Running locally](#running-locally)
4. [Project structure](#project-structure)
5. [How to update content](#how-to-update-content)
   - [Officers](#officers)
   - [Officer photos](#officer-photos)
   - [Hall of Fame](#hall-of-fame)
   - [Projects (Create & Research)](#projects-create--research)
   - [Committees](#committees)
   - [Events](#events)
   - [Gallery albums](#gallery-albums)
   - [News / announcements](#news--announcements)
   - [Sponsors](#sponsors)
   - [HackUTA settings](#hackuta-settings)
6. [Supabase & database](#supabase--database)
7. [Admin panel](#admin-panel)
8. [Member portal](#member-portal)
9. [Auth & onboarding](#auth--onboarding)
10. [Deployment](#deployment)
11. [Adding new pages / routes](#adding-new-pages--routes)
12. [Environment variables](#environment-variables)

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Hand-written CSS in `src/index.css` (BEM-ish prefixes) |
| UI primitives | shadcn/ui (`Switch`, `Slider`, `Dialog`) — styled to match |
| Backend / auth | Supabase (Postgres + Auth + Storage + Edge Functions) |
| State | React local state + TanStack Query (for admin portal) |
| Fonts | Archivo (body), JetBrains Mono (mono labels) — Google Fonts |

---

## Design system

### Color palette

All colors are CSS custom properties (tokens). **Never hardcode hex values** — always use a token so dark mode works automatically.

| Token | Light mode | Dark mode | Purpose |
|-------|-----------|-----------|---------|
| `--bg` | `#EAE6DC` Warm Sand | `#0C0C0D` Midnight | Page canvas |
| `--bg-1` | `#F4F1E9` | `#17171A` | Cards / surfaces |
| `--bg-2` | `#FBF9F3` | `#212126` | Raised / hover |
| `--text` | `#1B1A17` | `#F2F0EA` | Primary text |
| `--text-dim` | `#6E6C64` | `#9A988F` | Muted text |
| `--text-faint` | `#9A968B` | `#66645C` | Tertiary / labels |
| `--line` | `rgba(20,18,15,0.16)` | `rgba(255,255,255,0.13)` | Hairline borders |
| `--line-2` | `rgba(20,18,15,0.26)` | `rgba(255,255,255,0.22)` | Heavier borders |
| `--accent` | `#C2640F` Burnt orange | `#E0892A` Warm amber | Accent / highlights |
| `--accent-ink` | `#FFF6EC` | `#1A1206` | Text on accent bg |
| `--accent-dim` | `rgba(194,100,15,0.12)` | `rgba(224,137,42,0.14)` | Accent bg tint |

### Typography

- **Body:** `Archivo`, weights 400–900. Default size 17px, line-height 1.55.
- **Mono labels:** `JetBrains Mono`, weights 400–700. Used for tags, eyebrows, badges.
- **Display headings:** `Archivo` weight 900, letter-spacing −0.04em.

Key utility classes: `.display`, `.mono`, `.tnum`, `.tag`, `.node`, `.amp`, `.dim`.

### Heading variants

| Class | Usage | Accent word class |
|-------|-------|------------------|
| `.hero-h1` | Homepage hero only | `.amp` → accent color |
| `.page-h1` | Every page's top heading | `.amp` → accent color |
| `.sec-title` | Section headings within pages | `.amp` → accent, `.dim` → gray |
| `.display` | Large display type (HackUTA, footer) | inline `.yr` for year |

### Component vocabulary

- `.btn.btn-primary` — filled accent button with arrow
- `.btn.btn-ghost` — outlined button
- `.tag.mono` — small eyebrow label with `.node` dot
- `.involve-card` — bordered card with padding (used for CTAs)
- `.off-card` / `.off-grid` — officer card and grid
- `.hof-card` / `.hof-grid` — Hall of Fame card and grid
- `.ev-row` — expandable event row
- `.proj-card` / `.proj-grid` — project card and grid
- `Reveal` component — intersection-observer fade-in, `stagger` prop animates children sequentially

### Spacing

- Section padding: `clamp(64px, 11vw, 150px) 0` via `.section`
- Max content width: `1280px` via `.wrap`
- Border radius: `--r` (0.25rem sharp), `--r-lg` (0.4rem softer)

### Dark / light mode

Theme is stored in `data-theme="dark"` on `<html>`. Toggled by `ThemeToggle` component which also fires a `"themechange"` window event. The Header and Footer logos listen to this event to swap between `acmlogo-black.png` (light) and `acmlogo-white.png` (dark).

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in Supabase keys
cp .env.example .env

# 3. Start dev server
npm run dev
```

Visit `http://localhost:8080`. The first start also generates the officer photo variants (about 20 s); later starts only rebuild photos that changed. See [Officer photos](#officer-photos).

To build for production:
```bash
npm run build
```

The build regenerates photo variants and runs `npm run check:assets`, which fails on oversized images or a photo reference with no generated files.

---

## Project structure

```
src/
├── App.tsx                  # Route definitions
├── index.css                # ALL styles (single file, BEM-ish prefixes)
├── components/
│   ├── Layout/
│   │   ├── Header.tsx       # Top nav + overlay menu
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Layout.tsx       # Public page wrapper
│   │   ├── PortalLayout.tsx # Logged-in portal wrapper
│   │   └── ChromelessLayout.tsx  # Auth pages (no nav/footer)
│   ├── CommitteePage.tsx    # Shared committee detail template
│   ├── Reveal.tsx           # Intersection-observer fade-in
│   ├── Placeholder.tsx      # <Ph> image with graceful fallback
│   ├── OfficerPhoto.tsx     # Officer photo with srcset from generated variants
│   └── ...
├── data/                    # Static data files (content lives here)
│   ├── officers.ts          # Officer list + Hall of Fame
│   ├── alumni.ts            # Alumni list
│   ├── projects.ts          # Create & Research projects
│   ├── committees.ts        # Committee definitions (fallback if Supabase fails)
│   ├── events.ts            # Event fallback data (not shown if Supabase has none)
│   ├── hackuta.ts           # HackUTA config fallback
│   ├── gallery.ts           # Photo album list
│   ├── news.ts              # News items for homepage
│   ├── sponsors.ts          # Sponsor list
│   └── stats.ts             # Org stats for homepage
├── lib/
│   ├── api.ts               # ALL data access (components import from here only)
│   ├── auth.tsx             # Auth context + useAuth hook
│   └── supabase.ts          # Supabase client
├── pages/
│   ├── Index.tsx            # Homepage
│   ├── Officers.tsx         # Officers + Alumni + Hall of Fame
│   ├── HackUTA.tsx          # HackUTA page (reads from hackuta_settings in DB)
│   ├── Contact.tsx          # Contact page with mailto form
│   ├── Events.tsx           # Events list + mini calendar
│   ├── admin/               # Admin panel (requires is_admin or director role)
│   └── ...
supabase/
├── migrations/              # Run these in order when setting up a new DB
└── seed.sql                 # Initial data (application templates, etc.)
image-src/
└── officerpics/             # Original officer photos (source of truth, any size)
scripts/
├── officer-photos.mjs       # Generates public/assets/officerpics/*.webp from image-src/
└── check-assets.mjs         # Build guard: oversized images or missing photo variants
```

---

## How to update content

### Officers

**File:** [src/data/officers.ts](src/data/officers.ts)

Add a new officer to the `officersData` array:

```ts
{
  id: "create-jane",           // unique, kebab-case
  name: "Jane Doe",
  role: "Create Officer",
  committee: "Create",         // must match exactly: Create, Research, Educate, Marketing, Outreach, Community, or Leadership
  tier: "officer",             // "exec" | "director" | "officer"
  photo: "/assets/officerpics/jane",       // base name of the photo, no extension (see Officer photos)
  linkedin: "https://linkedin.com/in/jane-doe",   // optional
  instagram: "janedoe",        // optional, handle without @
}
```

**Tier meanings:**
- `exec` → shows under "Leadership" (President, VP, Treasurer, etc.)
- `director` → shows at top of their committee section; also shown on the committee's page
- `officer` → regular member of their committee

**To remove an officer:** delete their entry from the array.

**Photos:** see [Officer photos](#officer-photos) below.

---

### Officer photos

Officer, alumni, and Hall of Fame photos share one pipeline. Originals live in `image-src/officerpics/`; the site serves small WebP variants generated from them.

**To add a photo:**

1. Drop the original in `image-src/officerpics/`, e.g. `jane.jpg`. Any size or orientation; `.jpg`, `.jpeg`, `.png`, and `.webp` are accepted. The file name, lowercased and without extension, becomes the photo's id, so keep it unique and free of spaces.
2. Reference it from the data file by base name, without extension:

   ```ts
   photo: "/assets/officerpics/jane",
   ```

   Officers and Hall of Fame: [src/data/officers.ts](src/data/officers.ts). Alumni: [src/data/alumni.ts](src/data/alumni.ts).
3. Commit the original and the data change. Do **not** commit `public/assets/officerpics/`; it is gitignored and rebuilt on every build.

**What happens automatically:** `scripts/officer-photos.mjs` crops each original to 4:5 (face-aware) and writes `public/assets/officerpics/<name>-300.webp` and `<name>-600.webp`. It runs:

- before `npm run dev` and `npm run build` (only missing or stale variants are rebuilt; a cold run of every photo takes about 20 s)
- while the dev server is running, about a second after a file in `image-src/officerpics/` is added, changed, or removed
- by hand with `npm run img:officers`

**To replace a photo:** overwrite the file in `image-src/officerpics/`. **To remove one:** delete it there and its variants are cleaned up; then remove or update any data entry that pointed to it.

**Build guard:** `npm run build` runs `scripts/check-assets.mjs` first and fails if a `photo:` entry has no generated variants, or if anything in `public/assets/officerpics/` is over 200 KB or 1200 px. The error names the offending file.

---

### Hall of Fame

**File:** [src/data/officers.ts](src/data/officers.ts) — `hallOfFameData` array at the bottom.

Add a new inductee:

```ts
{
  id: "hof-firstname",
  name: "Full Name",
  role: "Role they're known for",
  impact: "One or two sentences about their contribution.",
  years: "2024–25",
  photo: "/assets/officerpics/firstname",   // see Officer photos
  linkedin: "https://linkedin.com/in/...",   // optional
}
```

Hall of Fame appears at the bottom of `/officers`, visually separated with an accent top border and star badge.

---

### Projects (Create & Research)

**File:** [src/data/projects.ts](src/data/projects.ts)

Add a new project:

```ts
{
  id: "proj-my-app",           // unique, kebab-case
  title: "My App",
  summary: "One sentence description.",
  committee: "Create",         // "Create" or "Research"
  year: 2025,
  featured: false,             // true = spans 2 columns on desktop
  image: "/assets/projects/myapp.jpg",   // optional, place in public/assets/projects/
  github: "https://github.com/acmuta/my-app",   // optional
  demo: "https://myapp.com",   // optional
  tags: ["React", "Node.js"],  // optional list of tech tags
}
```

Projects automatically show up on `/projects` and on the relevant committee page (`/create` or `/research`).

---

### Committees

Committee text content lives in Supabase (the `committees` table). If Supabase is unreachable, the fallback is [src/data/committees.ts](src/data/committees.ts).

To update a committee's description, summary, or "what members do" list, update the relevant row in the Supabase `committees` table via the Supabase dashboard. Fields:
- `name`, `slug`, `tag` — display name, URL slug, short tag
- `summary` — one-liner shown on the committees overview
- `description` — full paragraph on the committee detail page
- `doing` — JSON array of strings ("what members do" list)
- `involve` — paragraph in the "how to get involved" card

---

### Events

Events are managed through the **Admin panel** (`/admin/events`). Any admin or committee director can create events there.

The `/events` page shows only events from Supabase. If the database has no events, it shows "No events happening right now!" — it does **not** fall back to placeholder data.

---

### Gallery albums

**File:** [src/data/gallery.ts](src/data/gallery.ts)

Albums are text-only cards that link out to Google Photos — no thumbnails or photo counts needed.

```ts
{
  id: "a12",
  title: "Fall Kickoff 2026",
  event_id: null,          // optional link to an events table row
  album_date: "2026-09-08",  // ISO date string (YYYY-MM-DD)
  google_photos_url: "https://photos.app.goo.gl/...",
}
```

Add new entries at the top of the `albumsData` array (newest first). The gallery page sorts and displays them as-is.

---

### News / announcements

News items appear in the "What's happening." section on the homepage.

**Preferred:** Use the **Admin panel → News** page. Any admin or committee director can create, edit, reorder, and publish/unpublish items there.

**Fallback (static):** If Supabase is unreachable, the site falls back to [src/data/news.ts](src/data/news.ts). Items in that file are also used as seed data for the `news_items` database table:

```ts
{
  id: "n1",
  tag: "ANNOUNCEMENT",
  title: "Spring 2026 applications are open",
  blurb: "Short description shown on the card.",
  date: "2026-01-15",
  link: "/apply",   // internal path or full URL
}
```

---

### Sponsors

**File:** [src/data/sponsors.ts](src/data/sponsors.ts)

```ts
{
  id: "sponsor-google",
  name: "Google",
  tier: "PLATINUM",   // shown as a mono label on the card
  url: "https://google.com",
  logo: "/assets/sponsors/google.png",   // optional
}
```

---

### HackUTA settings

HackUTA is controlled via a toggle in the **Admin panel** → **HackUTA** (visible to admins only).

**When enabled:** Shows the real date, location, and an "Apply now" or "Register interest" button based on whether applications are open.

**When disabled:** Shows a generic "HackUTA is coming soon" page with no dates.

The settings are stored in the `hackuta_settings` Supabase table (single row). The `src/data/hackuta.ts` file is a fallback used only when the DB is unreachable.

Fields you can set from the admin panel:
- **Enabled** — toggle the whole page between live and generic
- **Year** — the hackathon year (e.g. 2026)
- **Date display** — free text shown on the page (e.g. "OCT 18–19, 2026")
- **Location** — venue name in ALL CAPS
- **Applications open** — toggles the CTA button
- **Application URL** — external link (e.g. hackuta.com); leave blank to use the site's `/apply`

---

## Supabase & database

### Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Project Settings → API
3. Run migrations in order:
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_application_builder.sql
   supabase/migrations/003_admin_polish.sql
   supabase/migrations/004_hackuta_settings.sql
   supabase/migrations/005_news_items.sql
   ```
4. Run `supabase/seed.sql` for initial data

### Key tables

| Table | Purpose |
|-------|---------|
| `profiles` | One row per auth user. Has `is_admin`, `onboarded`, `full_name`, etc. |
| `committees` | Committee definitions (can be edited in Supabase dashboard) |
| `events` | Created via admin panel; shown on `/events` |
| `attendance` | QR check-in records; awards points |
| `point_transactions` | All point awards; used for leaderboard |
| `applications` | Member/officer application submissions |
| `application_forms` | Forms built in the admin application builder |
| `application_templates` | Base question templates |
| `committee_roles` | Links users to committees with role (member/officer/director) |
| `teams` | Project teams within committees |
| `team_memberships` | Users → teams |
| `mentor_mentee_pairings` | Educate mentorship matches |
| `notifications` | In-app notifications per user |
| `audit_log` | Admin action audit trail |
| `semester_terms` | Semester tracking for points/leaderboard |
| `hackuta_settings` | Single-row HackUTA page config (admin toggle) |
| `news_items` | Homepage news cards; managed via admin panel or seeded from `src/data/news.ts` |

### Making someone an admin

In the Supabase dashboard, go to the `profiles` table and set `is_admin = true` for their row. This gives them full access to the admin panel.

### Granting director access

Use the Admin panel → Members → assign the user a "Director" role for their committee. This gives them access to the admin panel scoped to their committee only.

---

## Admin panel

URL: `/admin` (redirects to `/admin/dashboard`)

**Access requirements:**
- `is_admin = true` in `profiles` → full access to everything
- Committee director role → scoped to their committee (events, applications, members, teams)

**Pages:**
- **Dashboard** — org stats, recent activity
- **Events** — create/edit events, generate QR codes for check-in, view attendees
- **Applications** — manage application forms and review submissions
- **Members** — manage committee roles
- **Teams** — create and manage project teams
- **Mentorship** — pair mentors and mentees (Educate committee)
- **News** — create/edit/publish news items shown on the homepage (admins + directors)
- **HackUTA** — toggle HackUTA page state (admins only)
- **Roster** — full member list (admins only)
- **Audit log** — admin action history (admins only)

---

## Member portal

Logged-in users see a portal with:
- `/profile` — their profile, application history, committee memberships, activity points
- `/notifications` — in-app notifications
- `/leaderboard` — points leaderboard (accessible from profile, not the main nav)
- `/checkin` — QR code scanner for event check-in

---

## Auth & onboarding

Auth is handled by Supabase Auth. Users sign up with email/password or Google OAuth. After first sign-in, they're redirected to `/onboarding` to complete their profile (name, major, pronouns, grad year, Discord/Instagram).

The `OnboardingGate` component in `App.tsx` enforces this: if `profile.onboarded = false`, the user is redirected to `/onboarding` on every navigation until they complete it.

---

## Deployment

The site is a static SPA. Build with `npm run build`, then deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

**Vercel (recommended):**
1. Connect your GitHub repo
2. Build command: `npm run build` (already pinned in `vercel.json`; keep it, since the build generates the officer photo variants, which are not committed)
3. Set output directory: `dist`
4. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

All routes must be configured to serve `index.html` for client-side routing. The checked-in `vercel.json` provides this SPA fallback for Vercel. For Netlify, add a `_redirects` file with `/* /index.html 200`.

---

## Adding new pages / routes

1. Create `src/pages/MyPage.tsx`
2. Import it in `src/App.tsx`
3. Add a `<Route path="/my-page" element={<MyPage />} />` inside the `<Route element={<Layout />}>` block
4. Optionally add to the `ROUTES` array in `src/components/Layout/Header.tsx` to include it in the nav overlay

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |

Copy `.env.example` to `.env` and fill in the values. Never commit `.env` — it is gitignored.
