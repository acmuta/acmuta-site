export interface NewsItem {
  id: string;
  title: string;
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  blurb: string;
  /** Internal path or external URL */
  link: string;
  /** Short tag shown in mono above the title */
  tag: string;
}

export const newsData: NewsItem[] = [
  {
    id: "n1",
    title: "Applications are open for fall dev teams",
    date: "2026-08-25",
    blurb:
      "Create and Research are taking applications. Pick a team, ship something real this semester.",
    link: "/committees",
    tag: "Apply",
  },
  {
    id: "n2",
    title: "HackUTA 2026 dates locked: Oct 18–19",
    date: "2026-08-20",
    blurb:
      "Our flagship hackathon returns to College Park Center. Hacker registration opens soon.",
    link: "/hackuta",
    tag: "HackUTA",
  },
  {
    id: "n3",
    title: "Mentor/mentee matching for fall is live",
    date: "2026-08-18",
    blurb:
      "New to CS? Get paired with someone who's been through it. Sign-ups close the second week.",
    link: "/educate",
    tag: "Educate",
  },
  {
    id: "n4",
    title: "We crossed 1,700 members",
    date: "2026-08-10",
    blurb:
      "ACM at UTA is now one of the largest tech orgs on campus. Thanks for building this with us.",
    link: "/about",
    tag: "Org",
  },
];

// Legacy compat export - removed when pages are rewritten in Stage D/E.
export const news = newsData;
