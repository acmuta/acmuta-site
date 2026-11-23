# acmuta-site audit, November 2026

This audit is separate from the Create gallery work. Nothing below was changed in this branch. Findings were checked against the code on `create/project-gallery` (based on `main` at `61e2371`), with `npm run build` output, `tsc`, a browser render at 320 to 1440 px, and computed WCAG contrast ratios.

Priority scale: **P0** broken or unsafe now · **P1** fix next, real user or performance impact · **P2** worth scheduling · **P3** cleanup.

No P0 issues found.

---

## P1

**1. Oversized images (118 MB in `public/assets`).**
The largest files are `homepage/acm_stem.png` (21 MB), `homepage/lookdown.JPG` (9.7 MB), and `homepage/hackathon.JPG` (8.8 MB). The committee images are 7 to 8.4 MB each (`committees/Outreach.png`, `Create.png`, `Marketing.png`, `Community.png`, `Research.png`). `scripts/check-assets.mjs` only checks `officerpics/` (and now `create-gallery/`).
*Fix:* convert these to WebP or AVIF with `srcset` widths, the same way `scripts/officer-photos.mjs` handles officer photos. Then extend `check-assets` to cover all of `public/assets`. Delete files that nothing references.

**2. One 918 KB JavaScript bundle (259 KB gzipped), with no code splitting.**
Every route, including the admin panel, the application builder, and `recharts`, ships on first load. `JSZip` is statically imported in `src/lib/api.ts:37` but only used for one admin export.
*Fix:* `React.lazy` the admin and portal routes in `App.tsx`, and dynamically import JSZip where it's used.

**3. Unused dependencies.**
Nothing in `src/` imports `googleapis`, `three`, `vanta`, `framer-motion`, `locomotive-scroll`, `zod`, or `date-fns`. `gsap` is only imported by `src/components/Home/*`, which no page uses.
*Fix:* remove them from `package.json`. This shrinks installs and the supply-chain surface.

**4. Text contrast below WCAG AA in the light theme.**
Measured on `--bg` `#EAE6DC`: `--text-dim` is 4.22:1 (needs 4.5:1 for body text), `--text-faint` is 2.37:1, and `--accent` used as text is 3.29:1. `--accent-ink` on `--accent` is 3.83:1, which fails for small button text. In dark mode `--text-faint` is 3.30:1.
*Fix:* darken `--text-dim` and `--text-faint` in `:root`, and keep `--text-faint` for decorative text only. The gallery works around this locally with `--cg-dim`, which can go once the tokens are fixed.

**5. Keyboard and screen-reader gaps in overlays.**
`src/components/Modal.tsx` closes on Escape and sets `aria-modal`, but it doesn't trap focus, restore focus on close, or name itself with `aria-labelledby`. The header's overlay menu (`src/components/Layout/Header.tsx`) has no Escape handler and no focus trap.
*Fix:* use the Radix Dialog already in `components/ui/dialog.tsx`, or add a focus trap, Escape handling, and focus restore.

**6. Every page has the same browser title.**
No route sets `document.title`, so tabs, history, bookmarks, and shared links all read the same. (`/create/gallery` now sets its own.)
*Fix:* a small `usePageTitle()` hook, called from each page.

---

## P2

**7. Dates show one day early.** `new Date("YYYY-MM-DD")` parses as UTC midnight, which is the previous evening in Texas. This happens in `src/pages/Gallery.tsx:48` and `src/pages/Index.tsx:328` (and in the unused `components/Home/NewsSection.tsx:110`). *Fix:* parse the parts into a local date, as `localDate()` in `src/pages/CreateGallery.tsx` does.

**8. Contact form labels aren't connected to their fields** (`src/pages/Contact.tsx:142`, `151`, `161`, `182`). Clicking a label doesn't focus its field, and screen readers don't announce the label. *Fix:* add `htmlFor` and `id`.

**9. Horizontal scroll at 320 px.** A `.tag.mono` label (`white-space: nowrap`) runs to 368 px on every page, for example `/projects`. *Fix:* allow it to wrap below about 360 px.

**10. The scroll progress bar never shows.** `.scrollbar` (`src/index.css:249`) starts at `width: 0%`, while the header animates `scaleX`, so the bar stays at zero width. *Fix:* use one method, either width or a full-width bar with `transform: scaleX()`.

**11. Stale project data.** Five entries in `src/data/projects.ts` set `codeUrl` to the org root (`https://github.com/acmuta`) instead of the project's repo. `MavGrades` has a real repo at `acmuta/mavgrades`. The README's project schema (`github`, `demo`, `tags`, numeric `year`) doesn't match the real `Project` interface (`codeUrl`, `websiteUrl`, string `year`).

**12. `tsc` reports 17 errors, and nothing in CI catches them.** There's no `src/vite-env.d.ts`, so `import.meta.env` is untyped. `components/ui/calendar.tsx` targets a newer `react-day-picker`. Several unused `components/Home/*` files reference fields that no longer exist. `vite build` doesn't type-check, so these go unnoticed. `npm run lint` also exits non-zero on `main` (4 errors, 13 warnings: `no-explicit-any`, two empty blocks, and a `require()` in `tailwind.config.ts`). *Fix:* add `vite-env.d.ts`, delete the dead files, fix the lint errors, and add `tsc --noEmit` and `npm run lint` to CI.

**13. CSP allows `https://r.jina.ai` in `connect-src`,** but nothing in `src/` calls it. *Fix:* remove it.

---

## P3

**14. Dead code.** `src/components/Home/*`, the `projects` legacy export in `src/data/projects.ts`, and the unused `Snowflake` import in `src/components/CommitteePage.tsx:10`.

**15. A CSS minifier warning** (`Unexpected "{"`) appears on every build, including on `main`. It comes from a generated Tailwind rule. *Fix:* find the arbitrary-variant class that produces it.

**16. Admin nav active state uses a side stripe.** `.adm-nav-link.active::before` in `src/index.css` is the one pattern the design detector flags. A full tint or border would match the rest of the site.

**17. Mixed breakpoints** (560, 640, 680, 700, 720, 760, 820, 860, 880, 900, 940, 980, 1000, 1040, 1080 px) across `index.css`. Settling on four or five would make layouts easier to reason about.
