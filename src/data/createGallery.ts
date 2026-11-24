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

export const createGalleryEntries: CreateGalleryEntry[] = [
  {
    id: "mavprep-fall-2025",
    semester: "fall-2025",
    status: "published",
    title: "MavPrep",
    summary:
      "A study platform for UTA students, with real-time text channels and voice and video study rooms.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "AWS Amplify", "Cognito", "DynamoDB", "Socket.IO", "WebRTC"],
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
];
