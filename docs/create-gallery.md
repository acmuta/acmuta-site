# Create project gallery: handoff guide

The gallery lives at **`/create/gallery`** and is linked from the Create committee page ("Projects by semester"). It shows what Create teams built each semester, newest semester first, with an image or short clip, a description, demo and code links, and credits for specific work.

| Piece | File |
|---|---|
| Content (semesters, projects, credits, media) | [`src/data/createGallery.ts`](../src/data/createGallery.ts) |
| Publish gate and semester grouping | `getCreateGallery()` in [`src/lib/api.ts`](../src/lib/api.ts) |
| Page | [`src/pages/CreateGallery.tsx`](../src/pages/CreateGallery.tsx) |
| Image / clip / placeholder | [`src/components/CreateGalleryMedia.tsx`](../src/components/CreateGalleryMedia.tsx) |
| Styles | `CREATE PROJECT GALLERY` block in [`src/index.css`](../src/index.css) (`.cg-*`) |
| Build-time media checks | [`scripts/check-assets.mjs`](../scripts/check-assets.mjs) (runs in `npm run build`) |
| Media files | `public/assets/create-gallery/<semester-id>/` |

The existing `/projects` page and `src/data/projects.ts` are separate and unchanged.

---

## 1. Data schema

### Semesters

```ts
{
  id: "fall-2026",          // `${term}-${year}`; entries point at this
  term: "fall",             // "spring" | "summer" | "fall"
  year: 2026,
  showcase: {               // optional; omit when there is no public source
    name: "Create Summit",
    date: "2026-11-24",     // local calendar date, YYYY-MM-DD
    location: "NH 108",     // optional
    sourceUrl: "https://mavengage.uta.edu/event/12959206",
  },
}
```

A semester with no published entries still renders, with an honest note. Before its showcase date, the note says when teams present. After that date, it says projects go up after approval. The page computes this from `showcase.date`, so nobody has to edit copy the day after the event.

### Entries (one per project per semester)

A project that runs for two semesters gets two entries, one per semester, each with that semester's work and credits. Example with an image:

```ts
{
  id: "mavprep-spring-2026",
  semester: "spring-2026",
  status: "published",            // "pending" entries never render
  title: "MavPrep",
  summary: "What the project is, in one or two sentences.",
  semesterWork: "What the team did this semester (optional; use for multi-semester projects).",
  stack: ["Next.js", "DynamoDB"],
  media: {
    kind: "image",
    src: "/assets/create-gallery/spring-2026/mavprep.webp",
    width: 1600,
    height: 1000,
    alt: "MavPrep study room with three participants' video tiles and a chat channel",
    caption: "Optional visible caption.",
    clearance: { clearedBy: "Create Director", date: "2026-05-02", peopleConsented: true },
  },
  demoUrl: "https://…",            // optional
  repoUrl: "https://github.com/acmuta/…",  // optional
  credits: [
    {
      name: "Aroudra Thakur",
      contribution: "Built the WebRTC voice and video calling.",
      evidence: "https://www.linkedin.com/posts/…",   // or "approved 2026-05-02"
    },
  ],
  sources: ["https://…"],          // public URLs that back the entry itself
}
```

Example with a clip:

```ts
media: {
  kind: "video",
  sources: [
    { src: "/assets/create-gallery/spring-2026/mavprep-demo.webm", type: "video/webm" },
    { src: "/assets/create-gallery/spring-2026/mavprep-demo.mp4",  type: "video/mp4" },
  ],
  poster:   "/assets/create-gallery/spring-2026/mavprep-demo.webp",
  captions: "/assets/create-gallery/spring-2026/mavprep-demo.vtt",
  width: 1280,
  height: 800,
  label: "MavPrep demo: joining a voice study room",
  caption: "Optional visible caption.",
  clearance: { clearedBy: "Create Director", date: "2026-05-02", peopleConsented: true },
}
```

Clips never autoplay or loop. They load nothing until the visitor presses play (`preload="none"`), show the poster until then, and offer captions through the player's CC control.

### What the publish gate does

`getCreateGallery()` is the safety net. The data file can hold work in progress, and this function decides what is public:

- Entries with `status: "pending"` are dropped.
- Entries with no `sources` are dropped.
- Credits missing a name, contribution, or evidence are dropped.
- Media without a complete `clearance` (including `peopleConsented: true`) is replaced by the striped placeholder.
- A clip without sources, a poster, and captions is replaced by the placeholder.

In `npm run dev`, every drop logs a `createGallery:` warning in the browser console, so you can see why something is missing.

---

## 2. Semester update workflow

**At the start of the semester**

1. Add the semester to `createSemesters`. Add `showcase` only once a public page (MavEngage event, ACM post) exists, and use that page as `sourceUrl`.

**After the showcase**

2. For each team, collect: a one or two sentence description, the stack, demo and repo links, each member's specific contribution, and media. Ask the team for these directly. A form or a message thread works. Do not scrape them from private channels.
3. Run the credit checks and media checks below.
4. Add an entry with `status: "pending"` while a check is still open, and set `pendingReason`. Flip it to `"published"` when everything passes.
5. Optimize the media, put it in `public/assets/create-gallery/<semester-id>/`, and reference it.
6. Run the checks in the Testing section, then open a PR.

**Continuing projects:** add a new entry for the new semester. Do not edit the old one, because the old entry is the historical record.

**Corrections and removals:** if anyone asks to change or remove their name, credit, or image, do it in the next PR, without debate. Removing an entry or credit is always safe.

---

## 3. Credit and permission checks

### What counts as a credit

- **Credit specific, demonstrated work**, phrased as an action: "Built the transcript parser", "Designed the AWS architecture". A role counts only with what the person did in it ("Guided the team through development as project manager").
- **Never credit attendance, membership, or "was on the team"** on its own.
- **No negative or comparative labels.** Don't write "inactive", "didn't contribute", or "left the team". Don't post rankings or awards either, because those imply a ranking of everyone else. If a member's contribution can't be shown, leave them off and say nothing.
- **Names:** use the name the person uses publicly. If the only evidence is a GitHub account with no display name, use the handle (`@handle`) until the person gives you the name they want.

### Evidence, in order of strength

| Evidence | Use as | `evidence` value |
|---|---|---|
| The person's own public post or profile describing the work | Credit | the URL |
| Public commits or merged PRs in an `acmuta` repo | Credit | link to the PRs or commits |
| A teammate's public post naming the person and the work | Credit, but confirm with the person when you can | the URL |
| The person confirmed the credit to a director in private | Credit | `"approved YYYY-MM-DD"` (no private links or screenshots in the repo) |
| Discord messages, Drive files, private repos, sign-in sheets | **Leads only.** Ask the person; never copy the content into the repo | n/a |

### Committee and semester

An entry needs a public source, or a director's confirmation, that it was a **Create** project in **that** semester. An `acmuta` repo alone is not enough, because other committees use the org too. Commit dates show when work happened, not which committee it belonged to.

### Media permission

- **A public image is a lead, not a license.** A screenshot on someone's LinkedIn or a photo in a public album does not mean we may reuse it. Get the team's OK for the specific file.
- **People in frame:** every identifiable person must agree to appear. Set `peopleConsented: true` only when they have. Otherwise crop them out, or use a UI screenshot instead.
- **Screens with personal data:** blur or replace real names, emails, transcripts, grades, and student IDs before export.
- Record who checked (`clearedBy`, as a role) and when (`date`). Keep the approval itself (message, form response) in the directors' records, not in this repo.

---

## 4. Media optimization

The site's CSP (`vercel.json`) only allows self-hosted media, so every file goes under `public/assets/create-gallery/`. `npm run build` fails when:

- a still is over **250 KB** or **1600 px** on either side
- a clip is over **4 MB**
- any **`.gif`** is present (convert it, see below)
- the data file points at a file that doesn't exist, or at a remote URL

**Stills:** 16:10 crops look best (the frame is 16:10). Export WebP at 1600 px wide:

```sh
# sharp is already a dev dependency
node -e "require('sharp')('screenshot.png').resize(1600).webp({ quality: 78 }).toFile('public/assets/create-gallery/fall-2026/project.webp')"
# or, with ffmpeg:
ffmpeg -i screenshot.png -vf "scale=1600:-2" -c:v libwebp -quality 78 project.webp
```

**Clips:** keep them short (5 to 20 seconds) and show one flow. Strip audio unless it matters. Export MP4 (H.264, plays everywhere) and WebM (VP9, smaller), then pull a poster frame:

```sh
# from a screen recording or a GIF
ffmpeg -i input.mov -an -vf "scale=1280:-2,fps=30" -c:v libx264 -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart demo.mp4
ffmpeg -i input.mov -an -vf "scale=1280:-2,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 demo.webm
ffmpeg -ss 1 -i demo.mp4 -frames:v 1 -c:v libwebp -quality 78 demo.webp
```

**Captions (required for clips):** write a WebVTT file next to the clip. For a silent clip, describe what happens on screen:

```
WEBVTT

00:00.000 --> 00:04.000
[Signing in with Google]

00:04.000 --> 00:09.000
[Uploading a transcript; recommended courses appear]
```

**Alt text:** describe what the image shows that matters for the project ("Recommendation dashboard listing three CSE courses with ranked professors"). Don't write "screenshot of…".

---

## 5. Testing

```sh
npm run lint
npm run build          # also runs img:officers and check:assets
```

To look at the page locally without Supabase credentials, give Vite placeholder values. Supabase calls then fail and pages fall back to local data:

```sh
VITE_SUPABASE_URL=http://127.0.0.1:9 VITE_SUPABASE_ANON_KEY=local-only npx vite --port 8091
```

Then open `/create/gallery` and check:

- light and dark theme (toggle in the header), at 1440, 390, and 320 px wide
- a semester with entries, one with none, and one with an upcoming showcase
- the placeholder when an entry has no media
- a clip: no autoplay, the poster shows, play/pause/seek work, and CC shows captions
- the semester index links jump to their sections
- the "Projects by semester" link on `/create`
- no `createGallery:` warnings in the console, unless you expect them

---

## 6. LinkedIn: Content Admin turnover vs. personal recommendations

These are two different things. Keep them apart.

**ACM page roles (organization accounts).** The ACM @ UT Arlington LinkedIn Page has admin roles. A **Super admin** can manage admins and page settings. A **Content admin** can post as the page, manage events, and reply to comments. When a director's term ends:

1. A Super admin adds the incoming director as Content admin before the outgoing director leaves.
2. The outgoing director hands over the posting calendar and any drafts, then a Super admin removes their admin role.
3. Gallery-related page posts (a semester recap, a project spotlight) go out from the page. Tag people only with their OK, and credit the same specific contributions the gallery shows. Never post Discord or Drive content.

Admin access belongs to the role, not the person. Nobody keeps it after their term, and nobody shares login credentials.

**Personal recommendations (individual accounts).** A LinkedIn recommendation is written by one person on their own profile, for a 1st-degree connection. It only appears after the recipient accepts it. It is a personal statement, not an ACM endorsement.

- Write recommendations from your own account, never from the ACM page, and don't present them as ACM's view.
- Base them on work you saw directly. The gallery's credits and evidence are a good reference, but the recommendation is yours.
- Leaving the director role doesn't end recommendations you already wrote. Offer them to members as individuals, not as a Create perk.

LinkedIn changes role names and permissions from time to time. Check LinkedIn Help ("Page admin roles") before a handover.
