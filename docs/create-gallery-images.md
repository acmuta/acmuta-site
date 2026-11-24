# Create gallery image manifest

Generated 2026-11-23 on branch `gallery-images`. Each entry produced
`<slug>-1280.webp` (1280x800) and `<slug>-640.webp` (640x400), cropped to
16:10 and encoded as WebP (q82), all under the 250 KB gallery budget.
Captures were logged out, 1440x900 viewport; no logins, no form submissions.

| slug | source | shows | private repo | quality notes | alt text |
|---|---|---|---|---|---|
| mavprep | local render of `zaineel/Cloud_Migration` `mavprep-landing/` @ HEAD (prod URL `main.d1tuwgozwz7swd.amplifyapp.com` is dead — DNS fails) | dark landing hero: "MavPrep — collaborative study platform for UTA students" with feature chips | no | Real repo code run in `next dev` with placeholder env; clean render | MavPrep landing page describing the study platform |
| smartadvisors | live capture, https://mavadvisors.vercel.app | landing hero "Plan Your Perfect Semester" with course-match card | no | Disclaimer modal dismissed before capture | SmartAdvisors landing page with a sample course recommendation card |
| mavresume | live capture, https://mavresume.com | landing hero "Draft with guidance. Review in context." with builder/review feature cards | no | Sharp, on-brand | MavResume landing page showing the builder and review workflow |
| meowvericks | PR #11 image on `ghiyascode/meowvericks` | landing page of the "microwave" cat-map app (sign-in card, hero, stats) | no | Very sparse/washed-out layout; best available — repo's only other images are stock cat photos and a 288x180 GIF | Microwave (Meowvericks) landing page for mapping UTA campus cats |
| forumverse | local render of `acmuta/ForumVerse` `frontend/` @ HEAD (Vite, placeholder env) | landing hero "A Smarter Place For Discussion" with course search bar | yes | Real frontend renders without backend; hero only | ForumVerse landing page with a course discussion search bar |
| bughouse-spring-2026 | PR #6 image on `acmuta/Alpha-Wolf` (merged 2026-04-07, matches pinned commit 24e391c era) | "Analytics Dashboard": stat cards, attendance-over-time chart | yes | Clean full app view; the only repo image at that commit is a group photo with faces (skipped) | BugHouse analytics dashboard with attendance and tutor-hour charts |
| uta-bughouse | PR #4 image on `acmuta/Alpha-Wolf` (merged 2026-03-30) | "Upcoming Events" month calendar with bugHouse Hours events | yes | Clean; companion shot to the spring dashboard from the same codebase | BugHouse upcoming-events calendar view |
| ratemavhousing | PR #4 image on `acmuta/CHUD` | "Best Rated Apartments Near UTA" listing cards with ratings, prices, amenity chips | yes | Crisp product UI; repo's other images are raw apartment photos only | RateMavHousing ranked apartment listings with ratings and amenity tags |
| mavvision | PR #6 image on `acmuta/MavVision` | "Your Career Roadmap" dashboard: geographic hubs, market valuation, industry distribution, skill gaps | yes | Rich, polished dark UI; best of 5 PR shots | MavVision career roadmap dashboard with salary estimate and skill-gap analysis |
| yichi | PR #24 image on `acmuta/code-father` | "Open Markets" prediction-market board with YES/NO prices | yes | Dark UI, good density | Yichi open-markets board showing prediction markets with yes/no pricing |
| silo | live capture, https://silo-frontend.onrender.com | landing hero "Catch drift before it reaches users" with terminal preview | yes | On-brand dark landing | Silo landing page for CI/CD prompt drift testing |
| moviematch | `acmuta/404` `docs/wireframes/04-home.png` @ HEAD | home-page wireframe: spotlight movie card + rating queue | yes | Wireframe, not final UI — only design artifacts exist; frontend code has no screenshots yet | MovieMatch home wireframe with a spotlight movie and like/not-liked controls |
| notewave | local render of `acmuta/notewave` `frontend/` @ HEAD (Vite) | landing "Discover the notes behind the sound" with MP3 upload dropzone | yes | Needed case-symlink fix for `Waveform`/`PianoRoll` imports to render on Linux; clean after | NoteWave landing page with audio upload for note visualization |
| musync | local render of `acmuta/musync` @ HEAD (`next dev`, mock env) | landing "Version control for people who make music" with branch-graph preview card | yes | Polished dark hero | MuSync landing page showing version control for music producers |
| crock-security | PR #7 image on `acmuta/crock-security` | "Home Dashboard" with camera preview tiles (Minecraft camera mod demo feed) | yes | Good product shot; repo's `camera-demo.png` (334x224) was too small alone | Crock Security home dashboard showing live camera previews |
| laundry-now | local render of `acmuta/dopamine` static frontend @ HEAD (live Firestore data loaded) | landing "Laundry without the wait" with clothesline art and LIVE status pill | yes | Bold, distinctive design; live badge rendered from real Firestore config | Laundry Now landing page showing live residence-hall laundry status |
| motion-arena | `acmuta/team-squared` `design/MotionArenaWebsitePreview/Arena.png` @ HEAD | split-screen "Skyship Arena" match view: two third-person fighters, HP/energy bars | yes | Labeled "design preview — concept art", not real gameplay; richest visual available | Motion Arena split-screen match preview with two fighters and health bars |
| breakuta | local render of `acmuta/creating-creepers` `Frontend/` @ HEAD (`next dev`, placeholder Clerk env) | landing "BREAK UTA" with jellyfish mascot and game-PIN join box | yes | Headline clips left edge at 1440px (site's own layout); still reads clearly | BreakUTA landing page with a game PIN join box and mascot art |

## Nothing usable found

- **autoreel** (`acmuta/Mavs-Buddy`, private): backend-only repo — audio/video
  pipeline code (acoustic spike detection, caption generation), no frontend,
  no images in tree, no PR attachments, no live URL. Needs a UI screenshot or
  demo still from the team.

## Notes

- `bughouse-spring-2026` / `uta-bughouse`: the only image inside the Alpha-Wolf
  repo at the pinned commit (and at HEAD) is `src/assets/bugHouse.png`, a group
  photo of six identifiable people — skipped per the no-faces rule. PR
  screenshots were used instead.
- All images were checked for identifiable faces before selection.
- `check-assets.mjs` reports no errors for these files; its remaining failures
  are pre-existing missing `officerpics` variants generated by
  `npm run img:officers`.
