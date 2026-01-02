export interface Project {
  id: string;
  title: string;
  image: string;
  summary: string;
  codeUrl?: string;
  websiteUrl?: string;
  committee: string;
}

export const projects: Project[] = [
  {
    id: 'mavgrades',
    title: 'MavGrades',
    image: '/assets/projects/mavgrades.png',
    summary: 'A grade tracking and GPA calculation platform for UTA students with semester summaries, historical trends, and course-specific performance insights.',
    codeUrl: 'https://github.com/ACMUTA/mavgrades',
    websiteUrl: 'https://mavgrades.com',
    committee: 'Create'
  },
    {
    id: 'discord-job-bot',
    title: 'Discord Job Bot',
    image: '/assets/projects/discordjobbot.png',
    summary: 'A Discord bot that scrapes multiple job boards and posts relevant tech job listings directly to ACM’s Discord channels.',
    codeUrl: 'https://github.com/MuhammadHunainKhurram/DiscordJobBot',
    committee: 'Create'
  },
  {
    id: 'acm-website',
    title: 'ACM Website Redesign',
    image: '/assets/projects/acmwebsite.png',
    summary: 'Complete redesign of the ACM UTA website with a modern UI, improved navigation, event calendar, and integrated officer dashboard.',
    codeUrl: 'https://github.com/acmuta/acmuta-site',
    websiteUrl: 'https://acmuta.com',
    committee: 'Create'
  },
  {
    id: 'hackuta-website',
    title: 'HackUTA Website',
    image: '/assets/projects/hackuta.png',
    summary: 'Official HackUTA website for event information, registration, sponsor highlights, and live updates during the hackathon.',
    codeUrl: 'https://github.com/MelodicAlbuild/hackuta-2025-monorepo',
    websiteUrl: 'https://hackuta.org',
    committee: 'HackUTA'
  }
];
