export type CommitteeKind = "application" | "program" | "staff";

export interface Committee {
  id: string;
  name: string;
  slug: string;
  kind: CommitteeKind;
  /** Short tag shown in the list row (e.g. "build / ship") */
  tag: string;
  /** One-sentence summary for the list row */
  summary: string;
  /** Full paragraph shown on the committee detail page */
  description: string;
  /** Bullet points for the "What members do" section */
  doing: string[];
  /** Paragraph for the "How to get involved" card */
  involve: string;
  /** URL to the committee's logo image; empty string = use CommitteeMark SVG */
  logo: string;
}

export const committeesData: Committee[] = [
  {
    id: "create",
    name: "Create",
    slug: "create",
    kind: "application",
    tag: "build / ship",
    summary: "Build real projects and ship products on small dev teams.",
    description:
      "Create is where ACM builds things people actually use. Members join small product teams, pick up real tickets, and ship: web apps, tools, bots, whatever the team is building that semester. You learn the parts of software that class never covers: working in a repo with other people, reviewing each other's code, and getting something to done.",
    doing: [
      "Join a dev team and ship a real product over the semester",
      "Work in a shared repo with code review and standups",
      "Pair with experienced members on your first PRs",
      "Demo what you built at the end-of-semester showcase",
    ],
    involve:
      "Membership is by application. Teams form at the start of each semester. Apply with your Mavs email.",
    logo: "",
  },
  {
    id: "research",
    name: "Research",
    slug: "research",
    kind: "application",
    tag: "papers / teams",
    summary: "Read papers, run research teams, and dig into open CS problems.",
    description:
      "Research pairs students with faculty and each other to dig into real CS research. Teams read papers together, reproduce results, and work toward something publishable. It's the on-ramp for anyone curious about grad school or just what's past the edge of the syllabus.",
    doing: [
      "Join a research team around a topic you're into",
      "Read and break down papers in a weekly reading group",
      "Reproduce results and run your own experiments",
      "Work toward a poster, talk, or publication",
    ],
    involve:
      "Membership is by application. Teams are small on purpose. Apply with your Mavs email.",
    logo: "",
  },
  {
    id: "educate",
    name: "Educate",
    slug: "educate",
    kind: "program",
    tag: "workshops / mentorship",
    summary: "Workshops, career development, and the mentor/mentee program.",
    description:
      "Educate runs the things that level you up: hands-on workshops, career and interview prep, and the mentor/mentee program that pairs newer students with people who've been through it. If you're new to all this, start here, and someone will have your back.",
    doing: [
      "Get matched with a mentor (or become one)",
      "Hit workshops on Git, the terminal, data structures, and more",
      "Sharpen your resume and run mock interviews",
      "Track a learning path from first-year to internship-ready",
    ],
    involve:
      "Open to all, no application needed. Sign up for the mentor/mentee program at the start of the semester.",
    logo: "",
  },
  {
    id: "marketing",
    name: "Marketing",
    slug: "marketing",
    kind: "staff",
    tag: "brand / content",
    summary: "Brand, social, design, and content for the whole org.",
    description:
      "Marketing owns how ACM looks and sounds. The team runs social, shoots and edits content at events, designs everything from flyers to this site, and keeps the brand sharp. If you like making things look good and getting them in front of people, this is your committee.",
    doing: [
      "Design flyers, slides, and social posts",
      "Shoot photo and video at events and edit recaps",
      "Run the Instagram, write the captions, build the brand",
      "Keep the site and visual identity consistent",
    ],
    involve:
      "Staff committee with officer and director roles. Get involved by showing up and pitching in.",
    logo: "",
  },
  {
    id: "outreach",
    name: "Outreach",
    slug: "outreach",
    kind: "staff",
    tag: "sponsors / partners",
    summary: "Sponsorships, industry relationships, and partnerships.",
    description:
      "Outreach is the bridge between ACM and the outside world. The team lands sponsors, builds relationships with companies, and brings industry into the room: recruiters, tech talks, and the funding that makes everything else free for members.",
    doing: [
      "Reach out to companies and pitch sponsorship",
      "Coordinate industry tech talks and recruiting events",
      "Steward sponsor relationships across the year",
      "Help bring $10k+ of funding to the org",
    ],
    involve:
      "Staff committee with officer and director roles. Comfortable with email and people? Come talk to us.",
    logo: "",
  },
  {
    id: "community",
    name: "Community",
    slug: "community",
    kind: "staff",
    tag: "socials / culture",
    summary: "Socials, culture, and the day-to-day member experience.",
    description:
      "Community makes ACM feel like a place you belong, not just a club you joined. The team runs game nights, socials, and the small things that turn a Discord server into actual friends. Culture is a feature, and Community owns it.",
    doing: [
      "Plan socials, game nights, and end-of-semester parties",
      "Keep the Discord alive and welcoming",
      "Welcome new members and help them find their people",
      "Set the tone for what ACM feels like",
    ],
    involve:
      "Staff committee with officer and director roles. The easiest place to start. Just hang out.",
    logo: "",
  },
];

// Legacy compat export — removed when pages are rewritten in Stage D/E.
export const committees = committeesData;
