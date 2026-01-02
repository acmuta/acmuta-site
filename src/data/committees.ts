export interface Committee {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  logo: string;
  banner: string;
  color: string;        
  gradientFrom: string; 
  gradientTo: string; 
}

export const committees: Committee[] = [
  {
    id: "create",
    name: "Create",
    slug: "create",
    summary:
      "Dedicated to developing industry-applicable skills and technological knowledge through semester-long projects.",
    description:
      "The Create committee focuses on hands-on project development, teaching students practical skills they'll use in their careers. We work on real-world applications, web development, mobile apps, and innovative tech solutions.",
    logo: "/assets/logo/create.png",
    banner: "/assets/logo/create.png",
    color: "#ff3d61",
    gradientFrom: "#ff3d61",
    gradientTo: "#8b1c1b",
  },
  {
    id: "educate",
    name: "Educate",
    slug: "educate",
    summary:
      "Provides students with valuable skills and opportunities to develop themselves for the workforce.",
    description:
      "Our Educate committee organizes workshops, guest speakers, and training sessions to help students build professional skills. From technical tutorials to career development, we prepare students for success.",
    logo: "/assets/logo/educate.png",
    banner: "/assets/logo/educate.png",
    color: "#34d399",
    gradientFrom: "#34d399",
    gradientTo: "#059669",
  },
  {
    id: "research",
    name: "Research",
    slug: "research",
    summary:
      "Fosters research skills and offers opportunities for innovative projects and future challenges.",
    description:
      "The Research committee connects students with faculty research opportunities, organizes research presentations, and supports students in exploring cutting-edge technologies and academic pursuits.",
    logo: "/assets/logo/research.png",
    banner: "/assets/logo/research.png",
    color: "#9333ea",
    gradientFrom: "#9333ea",
    gradientTo: "#6b21a8",
  },
  {
    id: "marketing",
    name: "Marketing",
    slug: "marketing",
    summary: "Drives ACM's brand through design, content, and social strategy.",
    description:
      "Our Marketing committee handles all visual design, social-media presence, promotional materials, and brand strategy. We create engaging content that showcases ACM's activities and attracts new members.",
    logo: "/assets/logo/marketing.png",
    banner: "/assets/logo/marketing.png",
    color: "#fb7185",
    gradientFrom: "#fb7185",
    gradientTo: "#f43f5e",
  },
  {
    id: "outreach",
    name: "Outreach",
    slug: "outreach",
    summary:
      "Connects ACM with local schools & communities through tech-education events.",
    description:
      "The Outreach committee builds relationships with local schools and community organisations, organising coding workshops for K-12 students and promoting computer-science education throughout the DFW area.",
    logo: "/assets/logo/outreach.png",
    banner: "/assets/logo/outreach.png",
    color: "#facc15",
    gradientFrom: "#facc15",
    gradientTo: "#f59e0b",
  },
  {
    id: "community",
    name: "Community",
    slug: "community",
    summary: "Builds a welcoming culture via socials, game nights, and peer mentoring.",
    description:
      "Community committee creates a welcoming environment for all members through social events, game nights, study groups, and mentorship programmes. We ensure every member feels valued and connected.",
    logo: "/assets/logo/community.png",
    banner: "/assets/logo/community.png",
    color: "#2563eb",
    gradientFrom: "#2563eb",
    gradientTo: "#06b6d4",
  },
  {
    id: "hackuta",
    name: "HackUTA",
    slug: "hackuta",
    summary:
      "Home of UTA's official student hackathon returning this October.",
    description:
      "HackUTA is our premier event-planning committee that organizes UTA's largest hackathon. We bring together hundreds of students for 24 hours of innovation, coding, and creativity with amazing prizes and sponsors.",
    logo: "/assets/logo/hackuta.png",
    banner: "/assets/logo/hackuta.png",
    color: "#a855f7",
    gradientFrom: "#a855f7",
    gradientTo: "#ec4899",
  },
];
