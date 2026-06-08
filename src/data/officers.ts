export type OfficerTier = "exec" | "director" | "officer";

export interface Officer {
  id: string;
  name: string;
  role: string;
  /** Committee name (matches Committee.name), or "Leadership" for exec */
  committee: string;
  tier: OfficerTier;
  /** Photo URL; empty string = use placeholder */
  photo: string;
  /** Instagram handle (no @) — optional */
  instagram?: string;
  /** LinkedIn profile slug or full URL — optional */
  linkedin?: string;
}

export interface Alumni {
  id: string;
  name: string;
  /** Historical role, e.g. "Create Director '24" */
  role: string;
  /** Where they are now */
  now: string;
  photo: string;
}

export const officersData: Officer[] = [
  // ── Executive board ──────────────────────────────────────────────────────
  {
    id: "pres",
    name: "Muhammad Khurram",
    role: "President",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/muhammad.png",
    linkedin: "https://www.linkedin.com/in/m-khurram/",
  },
  {
    id: "vpres",
    name: "Kevin Farokhrouz",
    role: "Vice President",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/kevin.png",
    linkedin: "https://linkedin.com/in/kevinrouz",
  },
  {
    id: "secretary",
    name: "Aastha Khatri",
    role: "Secretary",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/aastha.jpeg",
    linkedin: "https://www.linkedin.com/in/aastha-k-b69a5a248/",
  },
  {
    id: "treasurer",
    name: "Ali Jifi-Bahlool",
    role: "Treasurer",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/ali.JPG",
    linkedin: "https://www.linkedin.com/in/ali-jifi-bahlool/",
  },
  {
    id: "studadv-bobby",
    name: "Bobby Flennoy",
    role: "Student Advisor",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/bobby.JPG",
    linkedin: "https://www.linkedin.com/in/bobby-flennoy/",
  },
  {
    id: "studadv-yash",
    name: "Yash Rao",
    role: "Student Advisor",
    committee: "Leadership",
    tier: "exec",
    photo: "/assets/officerpics/yash.jpeg",
    linkedin: "https://www.linkedin.com/in/yash-rao-9082bb246",
  },

  // ── Create ────────────────────────────────────────────────────────────────
  {
    id: "create-tobi",
    name: "Tobi Akere",
    role: "Create Director",
    committee: "Create",
    tier: "director",
    photo: "/assets/officerpics/tobi.png",
  },
  {
    id: "create-ghiya",
    name: "Ghiya El Daouk El Kadi",
    role: "Create Director",
    committee: "Create",
    tier: "director",
    photo: "/assets/officerpics/ghiya.jpeg",
  },
  {
    id: "create-prajit",
    name: "Prajit Viswanadha",
    role: "Create Director",
    committee: "Create",
    tier: "director",
    photo: "/assets/officerpics/prajit.jpg",
    linkedin: "https://www.linkedin.com/in/prajit-viswanadha/",
  },
  {
    id: "create-wendolee",
    name: "Wendolee Villegas",
    role: "Project Manager",
    committee: "Create",
    tier: "officer",
    photo: "/assets/officerpics/wendolee.jpeg",
  },

  // ── Research ──────────────────────────────────────────────────────────────
  {
    id: "research-mariah",
    name: "Mariah Gardner",
    role: "Research Director",
    committee: "Research",
    tier: "director",
    photo: "/assets/officerpics/mariah.jpg",
  },
  {
    id: "research-rohita",
    name: "Rohita Konjeti",
    role: "Research Director",
    committee: "Research",
    tier: "director",
    photo: "/assets/officerpics/rohita.jpg",
    linkedin: "https://www.linkedin.com/in/rohita-k/",
  },
  {
    id: "research-janet",
    name: "Janet Barba",
    role: "Research Officer",
    committee: "Research",
    tier: "officer",
    photo: "/assets/officerpics/janet.jpg",
  },
  {
    id: "research-subhaan",
    name: "Subhaan Elburz",
    role: "Research Officer",
    committee: "Research",
    tier: "officer",
    photo: "/assets/officerpics/subhaan.jpg",
  },
  {
    id: "research-vamshi",
    name: "Vamshi Vavilla",
    role: "Research Officer",
    committee: "Research",
    tier: "officer",
    photo: "/assets/officerpics/vamshi.png",
  },

  // ── Educate ───────────────────────────────────────────────────────────────
  {
    id: "educate-will",
    name: "Will Maberry",
    role: "Educate Director",
    committee: "Educate",
    tier: "director",
    photo: "/assets/officerpics/will.jpg",
    linkedin: "https://www.linkedin.com/in/will-maberry/",
  },
  {
    id: "educate-zaineel",
    name: "Zaineel Mithani",
    role: "Educate Director",
    committee: "Educate",
    tier: "director",
    photo: "/assets/officerpics/zain.jpeg",
  },
  {
    id: "educate-ishana",
    name: "Ishana Khandakar",
    role: "Educate Officer",
    committee: "Educate",
    tier: "officer",
    photo: "/assets/officerpics/iggy.jpeg",
  },
  {
    id: "educate-an",
    name: "An Duong",
    role: "Educate Officer",
    committee: "Educate",
    tier: "officer",
    photo: "/assets/officerpics/an.jpeg",
    linkedin: "https://www.linkedin.com/in/real-an-duong",
  },
  {
    id: "educate-grace",
    name: "Grace Whitney",
    role: "Educate Officer",
    committee: "Educate",
    tier: "officer",
    photo: "/assets/officerpics/grace.JPG",
    linkedin: "https://www.linkedin.com/in/whitney-grace",
  },

  // ── Marketing ─────────────────────────────────────────────────────────────
  {
    id: "marketing-salima",
    name: "Salima Salman",
    role: "Marketing Director",
    committee: "Marketing",
    tier: "director",
    photo: "/assets/officerpics/salima.jpeg",
  },
  {
    id: "marketing-felix",
    name: "Felix Cherian",
    role: "Marketing Director",
    committee: "Marketing",
    tier: "director",
    photo: "/assets/officerpics/felix.jpeg",
    linkedin: "https://www.linkedin.com/in/felix-cherian",
  },
  {
    id: "marketing-nnanna",
    name: "Nnanna Ejim",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/nnanna.png",
    linkedin: "https://www.linkedin.com/in/nnanna-ejim/",
  },
  {
    id: "marketing-mohammed",
    name: "Mohammed Hajee",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/mohammed.png",
  },
  {
    id: "marketing-sarah",
    name: "Sarah Naifa",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/sarah.png",
    linkedin: "https://www.linkedin.com/in/sarah-naifa",
  },
  {
    id: "marketing-hania",
    name: "Hania Abbasi",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/hania.jpeg",
  },
  {
    id: "marketing-thinh",
    name: "Thinh Tran",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/thinh.jpeg",
  },
  {
    id: "marketing-namira",
    name: "Namira Asem",
    role: "Marketing Officer",
    committee: "Marketing",
    tier: "officer",
    photo: "/assets/officerpics/namira.jpeg",
  },

  // ── Outreach ──────────────────────────────────────────────────────────────
  {
    id: "outreach-paul",
    name: "Paul Santana",
    role: "Outreach Director",
    committee: "Outreach",
    tier: "director",
    photo: "/assets/officerpics/paul.jpg",
    linkedin: "https://www.linkedin.com/in/paul-hunter-santana/",
  },
  {
    id: "outreach-vincent",
    name: "Vincent Dang",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/vincent.jpg",
    linkedin: "https://www.linkedin.com/in/vdanguta/",
  },
  {
    id: "outreach-jacob",
    name: "Jacob Mathew",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/jacob.jpg",
    linkedin: "https://www.linkedin.com/in/jacob-mathew-794987306/",
  },
  {
    id: "outreach-evelyn",
    name: "Evelyn Trevino",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/eve.jpeg",
  },
  {
    id: "outreach-mahim",
    name: "Mahim Kabir",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/mahim.JPG",
    linkedin: "http://linkedin.com/in/tasmim-kabir-mahim",
  },
  {
    id: "outreach-peter",
    name: "Peter Tran",
    role: "Outreach Officer",
    committee: "Outreach",
    tier: "officer",
    photo: "/assets/officerpics/peter.jpeg",
    linkedin: "https://www.linkedin.com/in/peter-phi-tran/",
  },

  // ── Community ─────────────────────────────────────────────────────────────
  {
    id: "community-yoselin",
    name: "Yoselin Ventura",
    role: "Community Director",
    committee: "Community",
    tier: "director",
    photo: "/assets/officerpics/yoselin.jpeg",
    linkedin: "http://linkedin.com/in/yoselin-ventura-a01036334",
  },
  {
    id: "community-kimiya",
    name: "Kimiya Ceballos",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/kimiya.jpeg",
    linkedin: "https://www.linkedin.com/in/kimiyaceballos/",
  },
  {
    id: "community-steven",
    name: "Steven Nguyen",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/steven.jpg",
    linkedin: "https://www.linkedin.com/in/stevnnguyen/",
  },
  {
    id: "community-samera",
    name: "Samera Wadud",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/mera.jpeg",
  },
  {
    id: "community-paul",
    name: "Paul Dang",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/pauld.jpeg",
    linkedin: "https://www.linkedin.com/in/paul-dang-260a74290",
  },
  {
    id: "community-christopher",
    name: "Christopher Tran",
    role: "Community Officer",
    committee: "Community",
    tier: "officer",
    photo: "/assets/officerpics/christ.jpg",
    linkedin: "https://www.linkedin.com/in/christran4209",
  },
];

export const alumniData: Alumni[] = [
  {
    id: "alumni-yash",
    name: "Yash Rao",
    role: "Student Advisor '24–25",
    now: "Mentorship & Advising",
    photo: "/assets/officerpics/yash.jpeg",
  },
  {
    id: "alumni-tobi",
    name: "Tobi Akere",
    role: "Create Director '24–25",
    now: "Software Engineering",
    photo: "/assets/officerpics/tobi.png",
  },
];

// Legacy compat exports — removed when Officers page is rewritten in Stage D/E.
export const officers = officersData;
export const alumni = alumniData;
