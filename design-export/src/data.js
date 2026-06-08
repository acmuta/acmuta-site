/* ============================================================================
   ACM at UTA — mock data layer
   Mirrors the typed src/data/ files in the acmuta-site repo.
   Shapes match the eventual Supabase schema (snake_case for backed entities)
   so the swap to a real backend is a clean, low-effort change.
   Components NEVER import this directly — they go through window.acmApi (api.js).
   ============================================================================ */
(function () {
  // ---- Committees -------------------------------------------------------------
  // interface Committee { id, name, slug, summary, description, logo, banner,
  //                       color, gradientFrom, gradientTo }
  // Per the brief: identity comes from each committee's LOGO, not per-committee
  // color. We keep the color fields on the shape for repo-compatibility but the
  // UI uses one global accent and a logo slot.
  const committees = [
    {
      id: "create",
      name: "Create",
      slug: "create",
      kind: "application", // takes member applications + runs teams
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
      summary:
        "Workshops, career development, and the mentor/mentee program.",
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

  // ---- Projects ---------------------------------------------------------------
  // interface Project { id, title, image, summary, codeUrl?, websiteUrl?, committee }
  const projects = [
    {
      id: "mavgrades",
      title: "MavGrades",
      image: "",
      summary:
        "Grade distribution data for every UTA course and professor, in a fast, searchable interface. Built by students, used by thousands every registration season.",
      websiteUrl: "https://mavgrades.com",
      codeUrl: "https://github.com/acmuta",
      committee: "Create",
      year: "2024",
      featured: true,
    },
    {
      id: "discord-job-bot",
      title: "Discord Job Bot",
      image: "",
      summary:
        "A bot that scrapes new-grad and internship postings and drops them straight into the ACM Discord, so members see openings the day they go live.",
      codeUrl: "https://github.com/acmuta",
      committee: "Create",
      year: "2024",
      featured: false,
    },
    {
      id: "hackuta-site",
      title: "HackUTA Website",
      image: "",
      summary:
        "The registration and info site for HackUTA, ACM's flagship hackathon. Handles applications, schedules, and sponsor placement for 500+ hackers.",
      websiteUrl: "https://hackuta.org",
      codeUrl: "https://github.com/acmuta",
      committee: "Create",
      year: "2024",
      featured: true,
    },
    {
      id: "acm-site",
      title: "ACM Site",
      image: "",
      summary:
        "This site. Open-source, built and maintained by the Create and Marketing committees as a living project members can actually contribute to.",
      websiteUrl: "https://acmuta.com",
      codeUrl: "https://github.com/acmuta/acmuta-site",
      committee: "Create",
      year: "2025",
      featured: false,
    },
    {
      id: "mav-research-tools",
      title: "Research Toolkit",
      image: "",
      summary:
        "Internal tooling the Research committee uses to organize reading groups, track experiments, and share datasets across teams.",
      codeUrl: "https://github.com/acmuta",
      committee: "Research",
      year: "2025",
      featured: false,
    },
    {
      id: "acm-bot",
      title: "ACM Discord Bot",
      image: "",
      summary:
        "Role assignment, event reminders, and committee channels: the bot that keeps a 1,700-member Discord organized.",
      codeUrl: "https://github.com/acmuta",
      committee: "Create",
      year: "2023",
      featured: false,
    },
  ];

  // ---- Events (Supabase-backed shape) ----------------------------------------
  // type EventItem { id, title, description, committee_id|null, location,
  //                  start_time(ISO), end_time(ISO), google_photos_url|null }
  const events = [
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

  // ---- Photo albums (Supabase-backed shape) ----------------------------------
  // type PhotoAlbum { id, title, event_id|null, album_date(ISO), google_photos_url, cover_image_url }
  const albums = [
    { id: "a1", title: "HackUTA 2025", event_id: "p1", album_date: "2025-10-19", google_photos_url: "https://photos.google.com", cover_image_url: "", count: 248 },
    { id: "a2", title: "Fall Kickoff 2025", event_id: null, album_date: "2025-09-04", google_photos_url: "https://photos.google.com", cover_image_url: "", count: 86 },
    { id: "a3", title: "Industry Night", event_id: "p2", album_date: "2025-11-12", google_photos_url: "https://photos.google.com", cover_image_url: "", count: 64 },
    { id: "a4", title: "End of Semester Social", event_id: "p3", album_date: "2025-12-05", google_photos_url: "https://photos.google.com", cover_image_url: "", count: 132 },
    { id: "a5", title: "Create Demo Night", event_id: null, album_date: "2025-04-22", google_photos_url: "https://photos.google.com", cover_image_url: "", count: 51 },
    { id: "a6", title: "Spring Banquet", event_id: null, album_date: "2025-05-01", google_photos_url: "https://photos.google.com", cover_image_url: "", count: 97 },
  ];

  // ---- Officers --------------------------------------------------------------
  // { name, role, committee, photo, tier, instagram?, linkedin? }
  // social handles are optional — the UI only renders the icons that exist.
  const officers = [
    { name: "Priya Nair", role: "President", committee: "Leadership", tier: "exec", photo: "", instagram: "priya.codes", linkedin: "priya-nair" },
    { name: "Marcus Webb", role: "Vice President", committee: "Leadership", tier: "exec", photo: "", instagram: "marcus.webb", linkedin: "marcuswebb" },
    { name: "Sofia Reyes", role: "Treasurer", committee: "Leadership", tier: "exec", photo: "", linkedin: "sofia-reyes" },
    { name: "Dev Patel", role: "Secretary", committee: "Leadership", tier: "exec", photo: "", instagram: "dev.patel", linkedin: "devpatel" },

    { name: "Alex Chen", role: "Create Director", committee: "Create", tier: "director", photo: "", instagram: "alexbuilds", linkedin: "alex-chen-dev" },
    { name: "Jordan Blake", role: "Create Officer", committee: "Create", tier: "officer", photo: "", linkedin: "jordan-blake" },

    { name: "Hana Suzuki", role: "Research Director", committee: "Research", tier: "director", photo: "", instagram: "hana.research", linkedin: "hana-suzuki" },
    { name: "Omar Haddad", role: "Research Officer", committee: "Research", tier: "officer", photo: "", linkedin: "omar-haddad" },

    { name: "Grace Liu", role: "Educate Director", committee: "Educate", tier: "director", photo: "", instagram: "grace.teaches", linkedin: "grace-liu" },
    { name: "Tyler Brooks", role: "Mentorship Lead", committee: "Educate", tier: "officer", photo: "", instagram: "tyler.mentors" },

    { name: "Nadia Ahmed", role: "Marketing Director", committee: "Marketing", tier: "director", photo: "", instagram: "nadia.designs", linkedin: "nadia-ahmed" },
    { name: "Leo Martins", role: "Design Lead", committee: "Marketing", tier: "officer", photo: "", instagram: "leo.makes" },

    { name: "Ethan Park", role: "Outreach Director", committee: "Outreach", tier: "director", photo: "", linkedin: "ethan-park" },
    { name: "Maya Johnson", role: "Sponsorship Officer", committee: "Outreach", tier: "officer", photo: "", instagram: "maya.j", linkedin: "maya-johnson" },

    { name: "Ravi Kumar", role: "Community Director", committee: "Community", tier: "director", photo: "", instagram: "ravi.irl", linkedin: "ravi-kumar" },
    { name: "Chloe Nguyen", role: "Socials Officer", committee: "Community", tier: "officer", photo: "", instagram: "chloe.acm" },
  ];

  // ---- Alumni ----------------------------------------------------------------
  const alumni = [
    { name: "Daniel Cho", role: "Past President '23", now: "SWE @ a big tech co", photo: "" },
    { name: "Aisha Rahman", role: "Past Create Director '22", now: "Founding Engineer", photo: "" },
    { name: "Sam Whitfield", role: "Past HackUTA Lead '23", now: "ML Engineer", photo: "" },
  ];

  // ---- News / announcements --------------------------------------------------
  // { id, title, date(ISO), blurb, link, tag }
  const news = [
    { id: "n1", title: "Applications are open for fall dev teams", date: "2026-08-25", blurb: "Create and Research are taking applications. Pick a team, ship something real this semester.", link: "#/committees", tag: "Apply" },
    { id: "n2", title: "HackUTA 2026 dates locked: Oct 18–19", date: "2026-08-20", blurb: "Our flagship hackathon returns to College Park Center. Hacker registration opens soon.", link: "#/hackuta", tag: "HackUTA" },
    { id: "n3", title: "Mentor/mentee matching for fall is live", date: "2026-08-18", blurb: "New to CS? Get paired with someone who's been through it. Sign-ups close the second week.", link: "#/educate", tag: "Educate" },
    { id: "n4", title: "We crossed 1,700 members", date: "2026-08-10", blurb: "ACM at UTA is now one of the largest tech orgs on campus. Thanks for building this with us.", link: "#/about", tag: "Org" },
  ];

  // ---- Sponsors --------------------------------------------------------------
  // { name, logo, tier, url }
  const sponsors = [
    { name: "Lockheed Martin", logo: "", tier: "Platinum", url: "#" },
    { name: "State Farm", logo: "", tier: "Platinum", url: "#" },
    { name: "Texas Instruments", logo: "", tier: "Gold", url: "#" },
    { name: "Capital One", logo: "", tier: "Gold", url: "#" },
    { name: "American Airlines", logo: "", tier: "Gold", url: "#" },
    { name: "Sabre", logo: "", tier: "Silver", url: "#" },
    { name: "Bell", logo: "", tier: "Silver", url: "#" },
    { name: "GM Financial", logo: "", tier: "Silver", url: "#" },
  ];

  // ---- Org stats -------------------------------------------------------------
  const stats = [
    { value: "1,700", suffix: "+", label: "members", note: "across every major" },
    { value: "50", suffix: "+", label: "officers", note: "running the org" },
    { value: "140", suffix: "+", label: "events a year", note: "workshops to socials" },
    { value: "10", prefix: "$", suffix: "k+", label: "in sponsorship", note: "keeps it free" },
  ];

  window.acmData = { committees, projects, events, albums, officers, alumni, news, sponsors, stats };
})();
