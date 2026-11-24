/**
 * Create committee project gallery, grouped by semester.
 *
 * Every published entry must be backed by public sources or by an approval
 * recorded outside this repo. Read docs/create-gallery.md before adding an
 * entry, a credit, or any media file.
 */

export type CreateTerm = "spring" | "summer" | "fall";

export interface CreateShowcase {
  name: string;
  /** Local calendar date, YYYY-MM-DD */
  date: string;
  location?: string;
  /** Public page that announces or recaps the showcase */
  sourceUrl: string;
}

export interface CreateSemester {
  /** `${term}-${year}`, referenced by CreateGalleryEntry.semester */
  id: string;
  term: CreateTerm;
  year: number;
  showcase?: CreateShowcase;
}

export interface CreateCredit {
  /** The name the person uses publicly; a GitHub handle (with @) when no public name exists */
  name: string;
  /** The specific work they did, phrased as an action. Never a role alone or attendance. */
  contribution: string;
  /** Public URL that shows the work, or "approved YYYY-MM-DD" when the person approved the credit privately */
  evidence: string;
  /** Role on the team, e.g. "Project manager" or "Frontend" */
  role?: string;
  linkedin?: string;
  github?: string;
}

export interface CreateMediaClearance {
  /** Role of the person who checked permission, e.g. "Create Director" */
  clearedBy: string;
  /** YYYY-MM-DD */
  date: string;
  /** True only when every identifiable person in the frame agreed to appear */
  peopleConsented: boolean;
}

export interface CreateImageMedia {
  kind: "image";
  /** Self-hosted path under /assets/create-gallery/ (CSP blocks remote images) */
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  clearance: CreateMediaClearance;
}

export interface CreateVideoMedia {
  kind: "video";
  /** List WebM first, then MP4. Both self-hosted under /assets/create-gallery/ */
  sources: { src: string; type: "video/webm" | "video/mp4" }[];
  /** First meaningful frame as WebP; shown until the visitor presses play */
  poster: string;
  /** WebVTT captions; for silent clips, describe what happens on screen */
  captions: string;
  width: number;
  height: number;
  /** Accessible name for the player, e.g. "MavPrep demo: joining a study room" */
  label: string;
  caption?: string;
  clearance: CreateMediaClearance;
}

export type CreateMedia = CreateImageMedia | CreateVideoMedia;

export interface CreateGalleryEntry {
  /** `${project-slug}-${semester id}` */
  id: string;
  semester: string;
  /** Only "published" entries render. "pending" keeps vetted public facts ready while a check is open. */
  status: "published" | "pending";
  /** Why a pending entry is not live yet */
  pendingReason?: string;
  title: string;
  /** What the project is, in one or two sentences */
  summary: string;
  /** What the team did this semester, for projects that span semesters */
  semesterWork?: string;
  stack: string[];
  media?: CreateMedia;
  demoUrl?: string;
  repoUrl?: string;
  /** Slides, Devpost, demo video, or other public links */
  extraLinks?: { label: string; url: string }[];
  credits: CreateCredit[];
  /** Public URLs that back the entry itself (semester, committee, description) */
  sources: string[];
}

export const createSemesters: CreateSemester[] = [
  {
    id: "fall-2025",
    term: "fall",
    year: 2025,
    showcase: {
      name: "Create Summit",
      date: "2025-12-01",
      sourceUrl:
        "https://www.linkedin.com/posts/acmuta_acmcreate-createsummit-projects-activity-7401755175545458688-nV4M",
    },
  },
  {
    id: "spring-2026",
    term: "spring",
    year: 2026,
  },
  {
    id: "fall-2026",
    term: "fall",
    year: 2026,
    showcase: {
      name: "Create Summit",
      date: "2026-11-24",
      location: "NH 108",
      sourceUrl: "https://mavengage.uta.edu/event/12959206",
    },
  },
];

const MAVPREP_AZAD_POST =
  "https://www.linkedin.com/posts/tanzid-azad_uta-acm-acmcreate-activity-7401705023086456833-0GlT";
const MAVPREP_THAKUR_POST =
  "https://www.linkedin.com/posts/aroudra-thakur-69203630a_acm-acmcreate-mavprep-activity-7409495976568287232-KQDy";
const SA = "https://github.com/acmuta/SmartAdvisors";
const MR = "https://github.com/acmuta/mavresume";
const CREATE_SUMMIT_FALL_2026 = "https://mavengage.uta.edu/event/12959206";

export const createGalleryEntries: CreateGalleryEntry[] = [
  {
    id: "mavprep-fall-2025",
    semester: "fall-2025",
    status: "published",
    title: "MavPrep",
    summary:
      "A study platform for UTA students, with real-time text channels and voice and video study rooms.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "AWS Amplify", "Cognito", "DynamoDB", "Socket.IO", "WebRTC"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/mavprep-1280.webp",
      width: 1280,
      height: 800,
      alt: "MavPrep landing page describing the study platform",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Aroudra Thakur",
        contribution:
          "Built the interface, WebRTC voice and video calling, and Socket.IO messaging, and stored chat and channel data in DynamoDB.",
        evidence: MAVPREP_THAKUR_POST,
      },
      {
        name: "Tanzid Noor Azad",
        contribution: "Designed the AWS architecture with Soumik Sen.",
        evidence: MAVPREP_AZAD_POST,
      },
      {
        name: "Soumik Sen",
        contribution: "Designed the AWS architecture with Tanzid Noor Azad.",
        evidence: MAVPREP_AZAD_POST,
      },
      {
        name: "Zaineel Mithani",
        contribution: "Guided the team through development as project manager.",
        evidence: MAVPREP_AZAD_POST,
      },
    ],
    sources: [MAVPREP_AZAD_POST, MAVPREP_THAKUR_POST],
  },
  {
    id: "smartadvisors-fall-2025",
    semester: "fall-2025",
    // A Create director confirmed the affiliation on Nov 23, 2026; no public page states it.
    status: "published",
    title: "SmartAdvisors",
    summary:
      "Upload a UTA transcript, set your preferences, and get ranked course and professor recommendations for next semester.",
    semesterWork: "The team built the transcript parser, the course data pipeline, and the recommendation dashboard, then shipped the first full version.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Flask", "SQLAlchemy"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/smartadvisors-1280.webp",
      width: 1280,
      height: 800,
      alt: "SmartAdvisors landing page with a sample course recommendation card",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    repoUrl: SA,
    credits: [
      {
        name: "Kanishkar Manoj",
        contribution: "Built the recommendation engine and professor scoring, and shipped versions 1.0 through 1.5.",
        evidence: `${SA}/commits?author=krm3798`,
      },
      {
        name: "@ShawnAbe12",
        contribution: "Scraped department catalogs, split prerequisites and corequisites, and assembled grade and degree-plan data.",
        evidence: `${SA}/pulls?q=is%3Apr+author%3AShawnAbe12`,
      },
      {
        name: "@Raaps-gg",
        contribution: "Built the transcript upload flow, the all-classes view, and the recommendation dashboard UI.",
        evidence: `${SA}/pulls?q=is%3Apr+author%3ARaaps-gg`,
      },
      {
        name: "Nishchal Bhandari Chhetri",
        contribution: "Drew the low-fidelity wireframes for sign-in, onboarding, and recommendations.",
        evidence: `${SA}/pull/1`,
      },
      {
        name: "Shreyak Silwal",
        contribution: "Connected the Flask server to the database.",
        evidence: `${SA}/pull/3`,
      },
    ],
    sources: [SA],
  },
  {
    id: "smartadvisors-spring-2026",
    semester: "spring-2026",
    // A Create director confirmed the affiliation on Nov 23, 2026; no public page states it.
    status: "published",
    title: "SmartAdvisors",
    summary:
      "Upload a UTA transcript, set your preferences, and get ranked course and professor recommendations for next semester.",
    semesterWork:
      "The team added Google sign-in and semester-by-semester degree plans, expanded to more College of Engineering majors, and redesigned the landing page and dashboard.",
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Flask", "SQLAlchemy"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/smartadvisors-1280.webp",
      width: 1280,
      height: 800,
      alt: "SmartAdvisors landing page with a sample course recommendation card",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    repoUrl: SA,
    credits: [
      {
        name: "Kanishkar Manoj",
        contribution: "Restructured the app for deployment, added Google sign-in and degree planning, and tightened recommendation accuracy.",
        evidence: `${SA}/commits?author=krm3798`,
      },
      {
        name: "Chukwuziri Ekpe",
        contribution: "Built the landing and sign-in pages and connected the dashboard to real plan and transcript data.",
        evidence: `${SA}/pulls?q=is%3Apr+author%3AZiri06`,
      },
      {
        name: "Shaun Jacob",
        contribution: "Integrated the frontend pages into the degree-plan flow.",
        evidence: `${SA}/pulls?q=is%3Apr+author%3Ashaun50152`,
      },
      {
        name: "@Raaps-gg",
        contribution: "Fixed the catalog scraper's missing prerequisites and a CS elective edge case.",
        evidence: `${SA}/pulls?q=is%3Apr+author%3ARaaps-gg`,
      },
    ],
    sources: [SA],
  },
  {
    id: "mavresume-fall-2025",
    semester: "fall-2025",
    // The Fall 2025 Create project brief corroborates the affiliation; keep the internal link out of the site.
    status: "published",
    title: "MavResume",
    summary: "A guided resume builder for UTA students, with AI bullet refinement and reviewer feedback on the same PDF.",
    semesterWork: "The first version of the builder: personal info, education, skills, and project sections with a live preview.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/mavresume-1280.webp",
      width: 1280,
      height: 800,
      alt: "MavResume landing page showing the builder and review workflow",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    demoUrl: "https://mavresume.com",
    repoUrl: MR,
    credits: [
      {
        name: "Tobi Akere",
        contribution: "Built the first version of the resume builder and its sections.",
        evidence: `${MR}/commits?author=Tobidevs&until=2025-12-31`,
      },
    ],
    sources: [MR, "https://mavresume.com"],
  },
  {
    id: "mavresume-spring-2026",
    semester: "spring-2026",
    // A Create director confirmed the affiliation on Nov 23, 2026; no public page states it.
    status: "published",
    title: "MavResume",
    summary: "A guided resume builder for UTA students, with AI bullet refinement and reviewer feedback on the same PDF.",
    semesterWork: "Accounts, saved resumes, cached AI refinement, and a review system where reviewers annotate the PDF directly.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "OpenAI", "Upstash Redis"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/mavresume-1280.webp",
      width: 1280,
      height: 800,
      alt: "MavResume landing page showing the builder and review workflow",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    demoUrl: "https://mavresume.com",
    repoUrl: MR,
    credits: [
      {
        name: "Tobi Akere",
        contribution:
          "Added Supabase sign-in and resume storage, caching and rate limits for AI refinement, and the PDF review and annotation system.",
        evidence: `${MR}/pulls?q=is%3Apr+author%3ATobidevs`,
      },
      {
        name: "Trevor Bakker",
        contribution: "Contributed a set of security fixes.",
        evidence: `${MR}/pull/20`,
      },
    ],
    sources: [MR, "https://mavresume.com"],
  },
  // DRAFT — Fall 2026 cohort (Create Summit Nov 24). All eight repos are private,
  // so repoUrl is omitted and per-credit evidence is "pending director review" until
  // public evidence or an approval exists. Public source for the cohort today is the
  // MavEngage summit page; replace with per-team public sources after the recap.
  //
  // Sources: ACM Create director weekly reports in #director-docs (Oct 5, Oct 20,
  // Nov 2); summit deck one-liner; acmuta/404 (PRIVATE) contributors/commits Oct 1–
  // Nov 21; member roster posted by PM Boredom in officer #create-general Sep 21;
  // team channel #404 Oct 4–Nov 23. Talal's LinkedIn self-posted in #networking
  // Jun 27. GitHub Xterionix is treated as Talal's account: it is the only repo
  // contributor absent from his posted member list and it did the sign/login work
  // he claimed in #404 (Nov 5) — confirm before publishing.
  {
    id: "moviematch-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "MovieMatch",
    summary:
      "A movie recommendation app: rate a few films to cold-start, then get picks from a PyTorch model trained on rating data.",
    semesterWork:
      "The team went from proposal to a working app this semester: cleaned movie-rating datasets, trained the recommendation model, and built the FastAPI backend and React frontend with cold-start, home, history and sign-in screens.",
    stack: ["React", "Vite", "Tailwind CSS", "Zustand", "FastAPI", "MongoDB", "PyTorch"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/moviematch-1280.webp",
      width: 1280,
      height: 800,
      alt: "MovieMatch home wireframe with a spotlight movie and like/not-liked controls",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Talal Aamer",
        role: "Project manager",
        contribution:
          "Led the team as project manager, published the GitHub roadmap and issues, and unified the sign-in and login pages.",
        evidence: "pending director review",
        linkedin: "https://www.linkedin.com/in/talal-aamer/",
        github: "https://github.com/Xterionix",
      },
      {
        name: "Serdar Bozan",
        role: "Frontend, ML",
        contribution:
          "Built the cold-start, home and history screens and the Zustand auth store, and added the rating model with user and movie embeddings.",
        evidence: "pending director review",
        github: "https://github.com/serdarbozan",
      },
      {
        name: "Sujit Shrestha",
        role: "Machine learning",
        contribution:
          "Prepared the dataset and trained the recommendation model: data loader, training and evaluation, and the user-vector and movie-scoring functions.",
        evidence: "pending director review",
        github: "https://github.com/SujitShres1ha",
      },
      {
        name: "Ivan Ibarra",
        role: "Backend",
        contribution:
          "Set up the FastAPI backend with uv and built the movies, popular-movies and recommendation endpoints with tests.",
        evidence: "pending director review",
        github: "https://github.com/ivanss-git",
      },
      {
        name: "Seth",
        role: "Frontend",
        contribution:
          "Scaffolded the React app and built the sign-up, login, protected-route and history views.",
        evidence: "pending director review",
        github: "https://github.com/sbeneze",
      },
      {
        name: "Ronith Datla",
        role: "Backend",
        contribution:
          "Set up MongoDB, built the ratings system, and integrated the login, signup and ratings endpoints.",
        evidence: "pending director review",
        github: "https://github.com/RonithDatla",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
  // Sources: same director reports; summit deck one-liner; acmuta/notewave (PRIVATE)
  // contributors/commits Oct 5–Nov 24; team channel #notewave Sep 28–Nov 23. John's
  // LinkedIn self-posted in #networking Jun 22. Rishav commits under both
  // rxb1825-glitch and rishavbhattarai39-lang. Whether "John Nguyen" (Discord) is the
  // same person as "Dat Nguyen" (GitHub DaQ-Ng) is unconfirmed — see draft notes.
  {
    id: "notewave-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "NoteWave",
    summary:
      "An audio tool that transcribes an uploaded song into musical notes and lights them up on a piano roll during playback.",
    semesterWork:
      "The team built the first version this semester: MP3 upload, basic-pitch transcription running in Redis-backed background jobs, and a frontend that highlights detected notes while the song plays.",
    stack: ["React", "Vite", "FastAPI", "Redis", "RQ", "basic-pitch", "librosa"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/notewave-1280.webp",
      width: 1280,
      height: 800,
      alt: "NoteWave landing page with audio upload for note visualization",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Rishav Bhattarai",
        role: "Project manager",
        contribution:
          "Led the team as project manager, built audio loading and metadata on upload, and merged the note-display frontend that highlights detected notes during playback.",
        evidence: "pending director review",
        github: "https://github.com/rxb1825-glitch",
      },
      {
        name: "Dat Nguyen",
        role: "Backend",
        contribution:
          "Built the analysis backend: temporary-file uploads, RQ background workers, Redis job and result caching, and the note-detection API.",
        evidence: "pending director review",
        github: "https://github.com/DaQ-Ng",
      },
      {
        name: "Sudin",
        role: "Backend",
        contribution: "Added the basic-pitch JSON transcription endpoint.",
        evidence: "pending director review",
        github: "https://github.com/sudinTech",
      },
      {
        name: "Karla Reyes",
        role: "Frontend",
        contribution: "Built the basic frontend and connected it to the backend.",
        evidence: "pending director review",
        github: "https://github.com/kreyescse",
      },
      {
        name: "John Nguyen",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        linkedin: "https://www.linkedin.com/in/john-nguyen-0b02a9387/",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
  // Sources: same director reports; summit deck one-liner; acmuta/musync (PRIVATE)
  // contributors/commits Oct 5–Nov 16 and README; team group DM (rightfootcreeper0,
  // childishangel, _pratik, kolorless1, hellomonoh, rija0058) Sep 28–Oct 17, where
  // childishangel posted the AngelCodeCyber account and kolourless named the pratik/
  // aayush/sameer members. Aroudra's LinkedIn derives from his own public post used
  // as evidence in the Fall 2025 entry. Commits authored by "claude" are excluded.
  {
    id: "musync-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "MuSync",
    summary:
      "Version control for music producers: private Dev branches, Collab pull requests and live workspaces for a shared arrangement, backed by Supabase.",
    semesterWork:
      "The team built the first version this semester, merging over 80 PRs: records as the canonical entity, Dev branches, Collab pull requests, live workspaces, an assistant chat with history, and the dashboard UI.",
    stack: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind CSS", "OpenAI", "Playwright"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/musync-1280.webp",
      width: 1280,
      height: 800,
      alt: "MuSync landing page showing version control for music producers",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Aroudra Thakur",
        role: "Project manager",
        contribution:
          "Led the team as project manager and built most of the app: records as the canonical entity, the dashboard UI, undo/redo with autosave, merge-conflict detection, PR review and arrangement diffs, and the assistant chat.",
        evidence: "pending director review",
        linkedin: "https://www.linkedin.com/in/aroudra-thakur-69203630a",
        github: "https://github.com/aroudrasthakur",
      },
      {
        name: "Rija Aziz",
        contribution:
          "Built synchronized multitrack audio playback, agent-controlled producer edits, and the agent tool registry.",
        evidence: "pending director review",
        github: "https://github.com/rijaaziz",
      },
      {
        name: "Sameer Laxman Manchala",
        contribution: "Resolved a set of tracked issues across the app.",
        evidence: "pending director review",
        github: "https://github.com/hellomonoh",
      },
      {
        name: "Aayush Mishra",
        contribution: "Built immutable commit snapshots and the consent-based training dataset exporter.",
        evidence: "pending director review",
        github: "https://github.com/AayushMishra00",
      },
      {
        name: "@AngelCodeCyber",
        role: "Frontend",
        contribution: "Built the studio sidebar with search, empty state and collapse.",
        evidence: "pending director review",
        github: "https://github.com/AngelCodeCyber",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
  // Sources: same director reports; summit deck one-liner; acmuta/crock-security
  // (PRIVATE) contributors/commits Oct 1–Nov 24 and repo layout; member roster
  // posted by PM NateClickbait in #create-general Sep 21; team channel
  // #crock-security Sep 21–Nov 23. Nahiyan and Sammuel had no attributable public
  // work in the capture, so their contributions are left pending.
  {
    id: "crock-security-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "Crock Security",
    summary:
      "A web-managed multi-camera security system that detects people and animal activity, logs events, and searches footage with vector similarity.",
    semesterWork:
      "The team built the first version this semester: multi-camera streaming through MediaMTX, a motion-gated YOLO + ByteTrack detection pipeline, event search with pgvector embeddings, and the admin dashboard.",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Firebase Auth",
      "YOLO",
      "ByteTrack",
      "MediaMTX",
      "Docker",
    ],
    media: {
      kind: "image",
      src: "/assets/create-gallery/crock-security-1280.webp",
      width: 1280,
      height: 800,
      alt: "Crock Security home dashboard showing live camera previews",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Andrew Truong",
        role: "Project manager",
        contribution:
          "Led the team as project manager, designed the initial system, and built multi-camera streaming, the first media and detection-analysis pipeline, and camera authorization.",
        evidence: "pending director review",
        github: "https://github.com/AndrewTruong744",
      },
      {
        name: "Ian Wallace",
        role: "Computer vision",
        contribution:
          "Built the motion-gated object-detection and analysis pipeline with ByteTrack, JSONL event logging, and pgvector similarity search over motion events.",
        evidence: "pending director review",
        github: "https://github.com/ianizer",
      },
      {
        name: "Bruno Garbuio De Souza",
        role: "Frontend",
        contribution:
          "Built the clips library, events timeline and dashboard integration, the login and system pages, and camera registration.",
        evidence: "pending director review",
        github: "https://github.com/BrunoGDZZ",
      },
      {
        name: "Brian Chime",
        role: "Backend",
        contribution:
          "Built the FastAPI backend with the Postgres schema and Firebase auth, admin endpoints, the video clip API, and CORS.",
        evidence: "pending director review",
        github: "https://github.com/brianchime",
      },
      {
        name: "Nahiyan Saraf",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/nahiansaraf",
      },
      {
        name: "Sammuel Buhisan",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/SammB8588",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
  // Sources: same director reports; summit deck one-liner; acmuta/Alpha-Wolf
  // (PRIVATE) — Spring codebase imported in PR #11 on Oct 5; member roster posted
  // by PM burger in #create-general Sep 21; team channel #team-mog and #alpha-wolf.
  // Andrew's LinkedIn self-posted in #networking Apr 25; Andy's in #networking
  // Feb 14 (academic_zer = "Agent June" = AndyKhandy, same Discord account).
  // GitHub andrewkernel is treated as Andrew Dang's account (he merged the import);
  // the roster name "Angus Ta" vs public "Andy Ta" is unresolved — see draft notes.
  {
    id: "uta-bughouse-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "UTA BugHouse",
    summary:
      "Digital sign-in and dashboards for UTA's BugHouse tutoring lab: MavID card swipes map to student emails and feed attendance tools.",
    semesterWork:
      "A continuing project. The Spring codebase was imported into the ACM repo on Oct 5; this semester the team finished auth with email confirmation and the MavID swipe-to-email check-in, and cleaned up the backend.",
    stack: ["React", "TypeScript", "Vite", "Supabase", "FastAPI", "Playwright"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/uta-bughouse-1280.webp",
      width: 1280,
      height: 800,
      alt: "BugHouse upcoming-events calendar view",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Andrew Dang",
        role: "Project manager",
        contribution:
          "Led the team as project manager and moved the Spring BugHouse codebase into the ACM repo; drove auth with email confirmation, the swipe-card check-in, and backend cleanup.",
        evidence: "pending director review",
        linkedin: "https://www.linkedin.com/in/andrewdanguta/",
        github: "https://github.com/andrewkernel",
      },
      {
        name: "Andy Ta",
        contribution:
          "Described the dual-system MagSwipe design that digitizes the lab's paper sign-in and built much of the imported codebase.",
        evidence: "pending director review",
        linkedin: "https://www.linkedin.com/in/andy-khang-ta",
        github: "https://github.com/AndyKhandy",
      },
      {
        name: "Joshua Salu",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/Joshua-S24",
      },
      {
        name: "Armando Compean",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/armandocompean1207-glitch",
      },
      {
        name: "Khoa Nguyen Van Anh",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/akunilqd",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
  // Sources: same director reports; summit deck one-liner; acmuta/creating-creepers
  // (PRIVATE) contributors/commits Oct 1–Nov 23 and README; member roster posted by
  // PM IamSamyog in #create-general Sep 21; team channel #creating-creepers
  // Oct 7–Nov 23, including the finalized-stack post of Oct 7. Danny1o26 (Discord,
  // avatar/design) and danielbarriow-alt (GitHub, sessions/scavenger hunt) appear to
  // be two different Daniels — see draft notes. "Yap" (yap3495) posted game docs and
  // the domain check but is not in the posted roster — ask the PM.
  {
    id: "breakuta-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "BreakUTA",
    summary:
      "A campus icebreaker game: organizers run events with text and photo challenges, players join from their phone with a six-digit PIN, and a live leaderboard ranks them.",
    semesterWork:
      "The team built the first version this semester: Clerk auth, event and challenge APIs, the host dashboard and player lobby, scoring and leaderboard, and a scavenger-hunt round.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Clerk", "FastAPI", "PostgreSQL", "Redis", "WebSockets"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/breakuta-1280.webp",
      width: 1280,
      height: 800,
      alt: "BreakUTA landing page with a game PIN join box and mascot art",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Samyog Maharjan",
        role: "Project manager",
        contribution:
          "Led the team as project manager and built the host dashboard and game-show pages, the scavenger-hunt round, and GitHub Actions CI.",
        evidence: "pending director review",
        github: "https://github.com/Iam-samyog",
      },
      {
        name: "Daniel Barrios",
        role: "Backend",
        contribution: "Built event sessions and participant join flows and added the scavenger-hunt game.",
        evidence: "pending director review",
        github: "https://github.com/danielbarriow-alt",
      },
      {
        name: "Daniel Lopez Sanchez",
        role: "Design",
        contribution: "Created the avatar art and game-asset drafts.",
        evidence: "pending director review",
        github: "https://github.com/Danny1o30",
      },
      {
        name: "Dilmi Wickramanayake",
        role: "Frontend, auth",
        contribution:
          "Built Clerk sign-up and login, the host and player lobby, and organizer challenge-management APIs.",
        evidence: "pending director review",
        github: "https://github.com/DilmiWickramanayake",
      },
      {
        name: "Chukwuziri Ekpe",
        role: "Backend",
        contribution:
          "Built the scoring and leaderboard APIs, finished the PostgreSQL migration, and drew the frontend flow wireframes.",
        evidence: "pending director review",
        github: "https://github.com/Ziri06",
      },
      {
        name: "Aweksha Ghimire",
        role: "Database",
        contribution: "Designed the game, quiz and challenge database schema.",
        evidence: "pending director review",
        github: "https://github.com/Aweksha",
      },
      {
        name: "Anupa Pandey",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/anupAA06",
      },
      {
        name: "Sushanta Raut",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/i-mhim",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
  // Sources: same director reports; summit deck one-liner; acmuta/dopamine
  // (PRIVATE) contributors/commits Oct 1–Nov 17 and README (Firestore device doc,
  // laundry-now-c3514); member roster posted by PM Mc-Daniels in #create-general
  // Sep 21 (Discord↔GitHub mapping is positional and inferred for Maxine/Victoria);
  // team channel #dopamine Sep 21–Nov 23, including the PM's role-lead post of
  // Oct 4 and XTP's Wokwi simulation link of Oct 18. Victoria's and Maxine's full
  // names are unconfirmed — see draft notes.
  {
    id: "laundry-now-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "Laundry Now",
    summary:
      "Campus laundry availability: an ESP32 vibration sensor on each washer reports to Firebase, and a live page shows which machines are free.",
    semesterWork:
      "The team built the first version this semester: washer emulator and ESP32 door/vibration firmware, the Firestore device feed, and a live availability dashboard.",
    stack: ["ESP32", "C++", "React", "Vite", "Firebase", "Firestore"],
    media: {
      kind: "image",
      src: "/assets/create-gallery/laundry-now-1280.webp",
      width: 1280,
      height: 800,
      alt: "Laundry Now landing page showing live residence-hall laundry status",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Mc-Daniels Chukwukelu",
        role: "Project manager",
        contribution:
          "Led the team as project manager, assigned the firmware, hardware, cloud and dashboard roles, and connected the UI to Firestore.",
        evidence: "pending director review",
        github: "https://github.com/TheMc-D",
      },
      {
        name: "Terry Camp",
        role: "Firmware",
        contribution: "Wrote the washer emulator test code and the v2 firmware with door-state detection.",
        evidence: "pending director review",
        github: "https://github.com/TCamp-dev",
      },
      {
        name: "Victoria",
        role: "Frontend",
        contribution: "Built the dashboard UI.",
        evidence: "pending director review",
        github: "https://github.com/vicemont",
      },
      {
        name: "Maxine",
        role: "Frontend",
        contribution: "Redesigned the frontend around live machine availability.",
        evidence: "pending director review",
        github: "https://github.com/AUR-RA",
      },
      {
        name: "Xuan Tung Pham",
        role: "Hardware simulation",
        contribution: "Built the washer simulation in Wokwi.",
        evidence: "pending director review",
        github: "https://github.com/Tung151008",
      },
      {
        name: "Aakansh Thapa",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/Aakansh-4-real",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
  // Sources: same director reports; summit deck one-liner; acmuta/team-squared
  // (PRIVATE) contributors/commits Oct 1–Nov 24 and the README owner table; member
  // roster posted by PM Alvin in #create-general Sep 21; team channel #team²
  // Sep 26–Nov 23. Roy (roy066712) is Ali Zagham — his posted env path names
  // /Users/syedmuhammadalizagham. Alvin's and Jason's LinkedIns are self-posted
  // (#rocktags Dec 11 2025; #intros Aug 12). Discord "Azazel" = manixh. Fahran Alam
  // has no captured work — confirm he is still on the team.
  {
    id: "motion-arena-fall-2026",
    semester: "fall-2026",
    status: "published",
    title: "Motion Arena",
    summary:
      "A 3D fighting game you control with your body: one webcam tracks two players' poses into a Unity arena, with local two-player and human-vs-AI modes plus an optional wrist sensor.",
    semesterWork:
      "The team built the first version this semester: webcam pose tracking for two players, the Unity arena and combat engine, an AI opponent, the web build with profiles and match history, and two wrist IMUs.",
    stack: [
      "Unity 6",
      "C#",
      "Python",
      "OpenCV",
      "MediaPipe",
      "scikit-learn",
      "React",
      "Vite",
      "FastAPI",
      "PostgreSQL",
      "Firebase",
      "ESP32",
    ],
    media: {
      kind: "image",
      src: "/assets/create-gallery/motion-arena-1280.webp",
      width: 1280,
      height: 800,
      alt: "Motion Arena split-screen match preview with two fighters and health bars",
      // Draft: sourced from the team's repo or public site; a director still needs to sign off.
      clearance: { clearedBy: "Pending director review", date: "2026-11-23", peopleConsented: true },
    },
    credits: [
      {
        name: "Alvin Ly",
        role: "Project manager",
        contribution:
          "Led the team as project manager, merged the integration PRs, and built the web camera fighting game, fighter animations, the wrist-sensor dashboard and keyboard backup controls.",
        evidence: "pending director review",
        linkedin: "https://www.linkedin.com/in/nkalvinly",
        github: "https://github.com/AlvinalphaLy",
      },
      {
        name: "Josue Trejo",
        role: "Combat, computer vision",
        contribution:
          "Built the camera combat controls — punches, dodges and side-steps for both players — and improved pose-tracker player identity.",
        evidence: "pending director review",
        github: "https://github.com/korot0",
      },
      {
        name: "Jason Pham",
        role: "AI",
        contribution:
          "Built the AI fighter: the combat adapter, practice scenes, the trained local model, and sandbox mode.",
        evidence: "pending director review",
        linkedin: "https://www.linkedin.com/in/phạm-quang-tường-9478783a2/",
        github: "https://github.com/jasonpham2002",
      },
      {
        name: "Thanh Phan",
        role: "Unity frontend",
        contribution:
          "Built the Unity arena scene and HUD, the two-player keyboard-combat demo, and connected the web profiles and match flow to the backend.",
        evidence: "pending director review",
        github: "https://github.com/datphandp333",
      },
      {
        name: "Syed Muhammad Ali Zagham",
        role: "Backend",
        contribution:
          "Built the backend: Firebase auth, PostgreSQL player profiles, match lifecycle, history and stats, and deployment setup.",
        evidence: "pending director review",
        github: "https://github.com/AliZagham1",
      },
      {
        name: "Manish Shrestha",
        role: "Hardware",
        contribution: "Built the optional wrist-sensor input: two ESP32 IMUs streaming into the Unity game and web build.",
        evidence: "pending director review",
        github: "https://github.com/Manixh-S",
      },
      {
        name: "Ayman Ishraq",
        role: "Computer vision",
        contribution:
          "Built pose tracking with persistent player IDs, the PoseFrame stream for Unity, skeleton mode and IMU-camera fusion.",
        evidence: "pending director review",
        github: "https://github.com/AymanIshraq",
      },
      {
        name: "Fahran Alam",
        contribution: "Contribution details coming after the Summit.",
        evidence: "pending director review",
        github: "https://github.com/fahranalam04-cmd",
      },
    ],
    sources: [CREATE_SUMMIT_FALL_2026],
  },
];
