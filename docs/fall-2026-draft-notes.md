# Fall 2026 gallery draft — reviewer notes

Internal working notes for the eight Fall 2026 draft entries in
`src/data/createGallery.ts`. Written Nov 23, 2026, the day before the Create
Summit. Nothing here is publication evidence; see `docs/create-gallery.md` for
what has to be true before these can ship.

## Status of the whole cohort

- **All eight repos are private** (`acmuta/404`, `notewave`, `musync`,
  `crock-security`, `Alpha-Wolf`, `creating-creepers`, `dopamine`,
  `team-squared`). `repoUrl` is omitted everywhere. If a repo goes public later,
  add the URL — and for credits, replace `pending director review` with commit
  or PR links.
- **No public deployment was found for any team.** BreakUTA demoed over a
  temporary ngrok tunnel and Laundry Now has a Firebase project; neither is a
  stable public URL. Ask each team whether they deployed; add `demoUrl` if yes.
- **`sources` is only the MavEngage summit page** for all eight entries. It
  backs the committee, semester and event, but it may not list the teams
  publicly. After the summit recap (LinkedIn posts, member posts), add the
  per-team public sources.
- **Every credit's evidence is `pending director review`** on purpose: the
  supporting commits and PRs all live in private repos, and Discord content is
  a lead, not a source. A director has to approve each credit (or public
  evidence has to appear) before this can be considered publishable.
- Rosters come from messages the PMs posted in officer `#create-general`
  (Sep 21) plus the director weekly reports in `#director-docs`. GitHub↔Discord
  mapping below is from those posts; each is flagged where inferred.

## Housekeeping flag for directors (not gallery content)

- `acmuta/crock-security` has `backend/secrets/firebase-admin.json` committed.
  Tell the team to rotate it and purge history.
- A Motion Arena member pasted Firebase web config + a service-account path in
  the team Discord channel. Web keys are public by design, but the habit is
  worth a reminder.

## MovieMatch (`acmuta/404`, private)

Roster (PM Boredom, Sep 21): 5 members — RonithDatla, sbeneze, SujitShres1ha,
serdarbozan, ivanss-git — plus PM Talal Aamer.

- **Inferred:** Talal's GitHub is `Xterionix` — the only repo contributor not
  in his member list, and it made the sign/login commits he claimed in `#404`
  (Nov 5). Confirm with Talal before publishing.
- **Seth's surname is unknown** (`sbeneze`, Discord "Seth" / recbott). Ask the
  team.
- "Serdar Bozan" is inferred from the `serdarbozan` handle + `srrr_10` Discord;
  confirm spelling.
- Ask the team: the recommendation-model dataset (MovieLens?) and whether
  anyone else trained/evaluated it — the PM picked Sujit as team MVP.

## NoteWave (`acmuta/notewave`, private)

- **Unconfirmed merge:** is "John Nguyen" (Discord jonjohn048, self-posted
  LinkedIn) the same person as "Dat Nguyen" (GitHub `DaQ-Ng`, the heaviest
  backend contributor)? They are credited separately. A Nov 9 director note
  called John's contribution "iffy" while DaQ-Ng carried the backend — likely
  two people, but ask Rishav.
- **"Sudin"** (`sudinTech`, Discord sudin5041) — full name needed.
- **Unlisted members:** `saintly` (saintly3150) posted idea research and the
  basic-pitch reference; `zamee.me` was invited per torrential Sep 28. Neither
  has attributable repo work — ask Rishav whether to credit them.
- Rishav commits under two accounts (`rxb1825-glitch`,
  `rishavbhattarai39-lang`); only the first is linked.
- MVP pick per PM (Nov 23): the member behind Discord ID `782491042356265050`
  — resolve the name if the gallery ever lists MVPs.

## MuSync (`acmuta/musync`, private)

- Roster never posted in `#create-general`; reconstructed from the team group
  DM (Sep 28–Oct 17) and PM's member names (pratik, aayush, sameer).
- **"Rija Aziz"** is inferred from Discord display "Rija" + handle `rijaaziz`.
  Confirm full name.
- **Uncredited members:** `rightfootcreeper0` (display "malone") and `_pratik`
  were named members but have no attributable repo work in the capture. Ask
  Aroudra what they did (malone posted competitor research early on).
- Commits authored by `claude` (11) were left unattributed — several features
  are clearly agent-written; worth asking the team who directed them so the
  right person gets the credit.
- The app is called "Layer" in some commits/docs; summit title is "MuSync".
  Confirm the final public name.

## Crock Security (`acmuta/crock-security`, private)

- Full roster from PM (Sep 21) — names are solid.
- Nahiyan Saraf and Sammuel Buhisan have no attributable commits; the PM
  flagged them as unresponsive in a private report. No contribution is claimed
  and nothing negative is stated, per gallery rules — ask the PM whether to
  keep or drop them.
- "Sammuel" spelled as the PM wrote it; "Nahiyan" uses his Discord display
  (roster wrote "Nahian").

## UTA BugHouse (`acmuta/Alpha-Wolf`, private)

- **Name conflict:** PM roster says "Angus Ta", GitHub shows "Andy Ta",
  LinkedIn slug is `andy-khang-ta` — all map to `AndyKhandy` /
  Discord `academic_zer` ("Agent June"). Entry uses "Andy Ta" (his public
  GitHub name); confirm which he wants.
- **Andrew Dang's GitHub** (`andrewkernel`) is inferred — he merged the Oct 5
  codebase import; no self-posted handle found. Confirm.
- **Fall code location:** the org repo only contains the Oct 5 bulk import +
  Spring history. The reported Fall work (auth, email confirmation,
  MavID→email swipe mapping, backend cleanup) must live in member forks or
  elsewhere — ask Andrew where it is and who wrote it, then replace the
  generic credit text.
- Avanish Gjaula was requested for this team (Mc-Daniels, Sep 21) — confirm
  whether he joined.

## BreakUTA (`acmuta/creating-creepers`, private)

- **Two Daniels:** roster lists "Daniel Lopez Sanchez" (`Danny1o30`, avatar
  art) while commits come from `danielbarriow-alt` ("Daniel Barrios", sessions
  + scavenger hunt). Credited as two people — confirm with Samyog.
- **"Yap"** (yap3495) checked the breakuta domain and sent game docs in DMs but
  is not in the posted roster and has no commits — ask if he is a member and
  what his name is.
- "Sushanta Raut" (roster) vs GitHub display "Sushant Raut" — confirm spelling.
- Anupa Pandey's only commits update the member list — ask what else she did.
- Stack from PM's finalized-stack post (Oct 7): Next.js/TS/Tailwind + FastAPI +
  PostgreSQL + Redis; Clerk was added later (Dilmi's commits).

## Laundry Now (`acmuta/dopamine`, private)

- **Positional Discord↔GitHub pairing** from the PM's two-column list:
  `maxine1092`→`AUR-RA` and `vickymomicky`→`vickymoemicky` are inferred from
  order. `vickymoemicky` no longer resolves on GitHub; the dashboard commits
  are under `vicemont` ("Victoria") — likely the same person renamed. Confirm
  account + her surname.
- **"Maxine"** and **"Victoria"** full names needed.
- The Wokwi washer simulation was posted by XTP (`Tung151008`, GitHub name
  "Xuan Tung Pham"); the emulator/firmware commits are `TCamp-dev` (Terry
  Camp). Ask who built what on the hardware side.
- Aakansh Thapa has no attributable work — ask the PM.

## Motion Arena (`acmuta/team-squared`, private)

- Strongest attribution of the cohort: the repo README names subsystem owners
  (Manish camera+IMU, Ayman pose, Jason AI, Dat frontend, Josue combat, Ali
  backend) and the commits line up.
- "Roy" (Discord `roy066712`) is Ali Zagham — proven by his posted env path
  containing `/Users/syedmuhammadalizagham`.
- Display names: "Alvin Ly" = Nguyen Khanh Ly; "Thanh Phan" goes by "Dat" in
  the README; "Jason Pham" = Quang Tuong Pham (his own intro says "call me
  Jason"). Confirm the names each wants shown.
- **Fahran Alam** (`fahranalam04-cmd`, Discord `fahgon`) is in the PM's roster
  but has no captured work and never posted in the team channel — confirm he is
  still on the team before keeping the credit.
- "Azazel" (Discord) = `manixh` = Manish Shrestha.

## What to collect at/after the Summit

1. One or two sentences from each team describing the shipped demo (for
   `summary`/`semesterWork` polish).
2. Any public links: deployed app, public repo, LinkedIn/devpost recap.
3. Each member's preferred display name, and their own okay to be credited for
   the specific work listed.
4. Screenshots or a 5–20 s clip per project, with everyone's consent for media
   (see the media rules in `docs/create-gallery.md`).
5. Confirm/deny each flagged inference above; fill the `pending` contributions
   or drop those credits.
