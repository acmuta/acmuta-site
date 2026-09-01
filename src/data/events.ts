export interface EventItem {
  id: string;
  title: string;
  description: string;
  /** ID matching Committee.id, or null for org-wide events */
  committee_id: string | null;
  location: string;
  /** ISO 8601 datetime string */
  start_time: string;
  /** ISO 8601 datetime string */
  end_time: string;
  /** Google Photos album URL for past events, or null */
  google_photos_url: string | null;
}

export const eventsData: EventItem[] = [
  // ---- upcoming (relative to fall 2026) ----
  {
    id: "e1",
    title: "General Meeting: Fall Kickoff",
    description:
      "The semester opener. Meet the committees, find your people, and figure out where you fit. Free food.",
    committee_id: null,
    location: "ERB 105",
    start_time: "2026-09-03T18:00:00-05:00",
    end_time: "2026-09-03T19:30:00-05:00",
    google_photos_url: null,
  },
  {
    id: "e2",
    title: "Git & GitHub Workshop",
    description:
      "Hands-on intro to version control. Bring a laptop and leave knowing how to branch, commit, and open a PR.",
    committee_id: "educate",
    location: "ERB 130",
    start_time: "2026-09-10T18:00:00-05:00",
    end_time: "2026-09-10T20:00:00-05:00",
    google_photos_url: null,
  },
  {
    id: "e3",
    title: "Create Team Demo Night",
    description:
      "Dev teams show what they shipped this semester. Live demos, Q&A, and a look at what you could build next.",
    committee_id: "create",
    location: "SEIR Atrium",
    start_time: "2026-09-17T18:30:00-05:00",
    end_time: "2026-09-17T20:00:00-05:00",
    google_photos_url: null,
  },
  {
    id: "e4",
    title: "Resume Review + Mock Interviews",
    description:
      "Bring your resume, leave with it fixed. Officers and industry mentors run mock technical interviews.",
    committee_id: "educate",
    location: "ERB 105",
    start_time: "2026-09-24T17:30:00-05:00",
    end_time: "2026-09-24T20:00:00-05:00",
    google_photos_url: null,
  },
  {
    id: "e5",
    title: "HackUTA 2026",
    description:
      "ACM's flagship 24-hour hackathon. 500+ hackers, workshops, mentors, prizes, and zero sleep. Open to all skill levels.",
    committee_id: null,
    location: "UTA College Park Center",
    start_time: "2026-10-18T09:00:00-05:00",
    end_time: "2026-10-19T15:00:00-05:00",
    google_photos_url: null,
  },
  {
    id: "e6",
    title: "Paper Reading Group: Transformers",
    description:
      "Research committee breaks down a foundational ML paper. No prior reading required. Come curious.",
    committee_id: "research",
    location: "ERB 228",
    start_time: "2026-10-01T18:00:00-05:00",
    end_time: "2026-10-01T19:30:00-05:00",
    google_photos_url: null,
  },
  {
    id: "e7",
    title: "Game Night",
    description:
      "Community committee takes over. Switch, board games, and the good kind of chaos. Snacks provided.",
    committee_id: "community",
    location: "MAC Lounge",
    start_time: "2026-10-08T19:00:00-05:00",
    end_time: "2026-10-08T21:30:00-05:00",
    google_photos_url: null,
  },
  // ---- past ----
  {
    id: "p1",
    title: "HackUTA 2025",
    description:
      "Last year's hackathon brought together 480 hackers across two days. Full recap and photos in the gallery.",
    committee_id: null,
    location: "UTA College Park Center",
    start_time: "2025-10-19T09:00:00-05:00",
    end_time: "2025-10-20T15:00:00-05:00",
    google_photos_url: "https://photos.google.com",
  },
  {
    id: "p2",
    title: "Industry Night with Sponsors",
    description:
      "Recruiters and engineers from sponsor companies met members over food and short tech talks.",
    committee_id: "outreach",
    location: "SEIR Atrium",
    start_time: "2025-11-12T18:00:00-06:00",
    end_time: "2025-11-12T20:30:00-06:00",
    google_photos_url: "https://photos.google.com",
  },
  {
    id: "p3",
    title: "End of Semester Social",
    description:
      "Closed out the fall with the whole org. Awards, demos, and a lot of photos.",
    committee_id: "community",
    location: "MAC Lounge",
    start_time: "2025-12-05T18:00:00-06:00",
    end_time: "2025-12-05T21:00:00-06:00",
    google_photos_url: "https://photos.google.com",
  },
];
