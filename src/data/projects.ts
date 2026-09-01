export interface Project {
  id: string;
  title: string;
  /** URL to a cover image; empty string = use placeholder */
  image: string;
  summary: string;
  /** Optional live URL */
  websiteUrl?: string;
  /** Optional source code URL */
  codeUrl?: string;
  /** Name of the owning committee (matches Committee.name) */
  committee: string;
  year: string;
  /** Featured projects span two columns in the grid */
  featured: boolean;
}

export const projectsData: Project[] = [
  {
    id: "mavgrades",
    title: "MavGrades",
    image: "/assets/projects/mavgrades.png",
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
    image: "/assets/projects/discordjobbot.png",
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
    image: "/assets/projects/hackuta.png",
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
    image: "/assets/projects/acmwebsite.png",
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

// Legacy compat export - removed when Projects page is rewritten in Stage D/E.
export const projects = projectsData;
