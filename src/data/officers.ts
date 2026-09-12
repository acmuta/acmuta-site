export type OfficerTier = "exec" | "director" | "officer";

export interface Officer {
  id: string;
  name: string;
  role: string;
  /** Committee name (matches Committee.name), or "Leadership" for exec */
  committee: string;
  tier: OfficerTier;
  /** Photo base path without extension, e.g. "/assets/officerpics/jane" (see scripts/officer-photos.mjs); empty string = use placeholder */
  photo: string;
  /** Instagram handle (no @) - optional */
  instagram?: string;
  /** LinkedIn profile slug or full URL - optional */
  linkedin?: string;
}

export const officersData: Officer[] = [
  // ── Executive board ──────────────────────────────────────────────────────
  {
    id: "pres",
    name: "Ghiya El Daouk El Kadi",
    role: "President",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/ghiya",
    linkedin: "https://www.linkedin.com/in/ghiya-el-daouk/",
  },
  {
    id: "vpres-internal",
    name: "Adam Heatley",
    role: "Vice President - Internal",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/adam",
    linkedin: "https://www.linkedin.com/in/adam-heatley-5a2008215/",
  },
  {
    id: "vpres-external",
    name: "Salima Salman",
    role: "Vice President - External",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/salima",
    linkedin: "https://www.linkedin.com/in/salima-salman/",
  },
  {
    id: "secretary",
    name: "Brian Shamayev",
    role: "Secretary",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/brian",
    linkedin: "https://www.linkedin.com/in/brian-shamayev/",
  },
  {
    id: "treasurer",
    name: "Rohita Konjeti",
    role: "Treasurer",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/rohita",
    linkedin: "https://www.linkedin.com/in/rohita-k/",
  },
  {
    id: "studadv-bobby",
    name: "Ali Jifi-Bahlool",
    role: "Student Advisor",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/ali",
    linkedin: "https://www.linkedin.com/in/ali-jifi-bahlool/",
  },

  // ── Create ────────────────────────────────────────────────────────────────
  {
    id: "create-prajit",
    name: "Prajit Viswanadha",
    role: "Create Director",
    committee: "Create",
    tier: "director",
    photo: "/assets/officerpics/prajit",
    linkedin: "https://www.linkedin.com/in/prajit-viswanadha/",
  },
  {
    id: "create-bryan",
    name: "Bryan Nguyen",
    role: "Create Director",
    committee: "Create",
    tier: "director",
    photo: "/assets/officerpics/bryan",
    linkedin: "https://www.linkedin.com/in/bryan-m-nguyen/",
  },
  {
    id: "create-wendolee",
    name: "Wendolee Villegas",
    role: "Project Manager",
    committee: "Create",
    tier: "officer",
    photo: "/assets/officerpics/wendolee",
  },

  // ── Research ──────────────────────────────────────────────────────────────
  {
    id: "research-rohita",
    name: "Rohita Konjeti",
    role: "Research Director",
    committee: "Research",
    tier: "director",
    photo: "/assets/officerpics/rohita",
    linkedin: "https://www.linkedin.com/in/rohita-k/",
  },
  {
    id: "research-vamshi",
    name: "Vamshi Vavilla",
    role: "Research Officer",
    committee: "Research",
    tier: "officer",
    photo: "/assets/officerpics/vamshi",
  },

  // ── Educate ───────────────────────────────────────────────────────────────
  {
    id: "educate-will",
    name: "Will Maberry",
    role: "Educate Director",
    committee: "Educate",
    tier: "director",
    photo: "/assets/officerpics/will",
    linkedin: "https://www.linkedin.com/in/will-maberry/",
  },
  {
    id: "educate-zaineel",
    name: "Zaineel Mithani",
    role: "Educate Director",
    committee: "Educate",
    tier: "director",
    photo: "/assets/officerpics/zain",
  },
  {
    id: "educate-ishana",
    name: "Ishana Khandakar",
    role: "Educate Officer",
    committee: "Educate",
    tier: "officer",
    photo: "/assets/officerpics/iggy",
  },

  // ── Marketing ─────────────────────────────────────────────────────────────
  {
    id: "marketing-salima",
    name: "Salima Salman",
    role: "Marketing Director",
    committee: "Marketing",
    tier: "director",
    photo: "/assets/officerpics/salima",
  },
  {
    id: "marketing-nnanna",
    name: "Nnanna Ejim",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/nnanna",
    linkedin: "https://www.linkedin.com/in/nnanna-ejim/",
  },
  {
    id: "marketing-mohammed",
    name: "Mohammed Hajee",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/mohammed",
  },
  {
    id: "marketing-hania",
    name: "Hania Abbasi",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/hania",
  },
  {
    id: "marketing-namira",
    name: "Namira Asem",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/namira",
  },

  // ── Outreach ──────────────────────────────────────────────────────────────
  {
    id: "outreach-paul",
    name: "Paul Santana",
    role: "Outreach Director",
    committee: "Outreach",
    tier: "director",
    photo: "/assets/officerpics/paul",
    linkedin: "https://www.linkedin.com/in/paul-hunter-santana/",
  },
  {
    id: "outreach-vincent",
    name: "Vincent Dang",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/vincent",
    linkedin: "https://www.linkedin.com/in/vdanguta/",
  },
  {
    id: "outreach-evelyn",
    name: "Evelyn Trevino",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/eve",
  },
  {
    id: "outreach-peter",
    name: "Peter Tran",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/peter",
    linkedin: "https://www.linkedin.com/in/peter-phi-tran/",
  },

  // ── Community ─────────────────────────────────────────────────────────────
  {
    id: "community-yoselin",
    name: "Yoselin Ventura",
    role: "Community Director",
    committee: "Community",
    tier: "director",
    photo: "/assets/officerpics/yoselin",
    linkedin: "http://linkedin.com/in/yoselin-ventura-a01036334",
  },
  {
    id: "community-samera",
    name: "Samera Wadud",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/mera",
  },
  {
    id: "community-paul",
    name: "Paul Dang",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/pauld",
    linkedin: "https://www.linkedin.com/in/paul-dang-260a74290",
  },
  {
    id: "community-christopher",
    name: "Christopher Tran",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/christ",
    linkedin: "https://www.linkedin.com/in/christran4209",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hall of Fame
// Manually curated list of exceptional past and present ACM officers.
// To add someone: copy an entry below and fill in their details.
// ─────────────────────────────────────────────────────────────────────────────

export interface HallOfFameMember {
  id: string;
  name: string;
  /** Role(s) they are most known for */
  role: string;
  /** One-line description of their impact */
  impact: string;
  /** Year or year range (e.g. "2024–25") */
  years: string;
  photo: string;
  linkedin?: string;
}

export const hallOfFameData: HallOfFameMember[] = [
  {
    id: "hof-muhammad",
    name: "Muhammad Khurram",
    role: "President",
    impact: "Led ACM at UTA through its largest growth period, rebuilding the organization's leadership structure, launching HackUTA, and scaling membership to 1,700+ students.",
    years: "2024–25",
    photo: "/assets/officerpics/muhammad",
    linkedin: "https://www.linkedin.com/in/m-khurram/",
  },
  {
    id: "hof-yash",
    name: "Yash Rao",
    role: "Student Advisor",
    impact: "Instrumental in establishing the mentorship and advising culture at ACM, guiding dozens of officers through their roles and helping build long-term organizational health.",
    years: "2024–25",
    photo: "/assets/officerpics/yash",
    linkedin: "https://www.linkedin.com/in/yash-rao-9082bb246",
  },
];

// Legacy compat exports - removed when Officers page is rewritten in Stage D/E.
export const officers = officersData;
