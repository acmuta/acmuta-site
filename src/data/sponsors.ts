export interface Sponsor {
  id: string;
  tier: 'platinum' | 'gold' | 'silver' | 'general';
  name: string;
  logo: string;
  site: string;
  description?: string;
}

export const sponsors: Sponsor[] = [
  // Platinum Sponsors
  {
    id: 'microsoft',
    tier: 'platinum',
    name: 'Microsoft',
    logo: '/assets/companies/microsoft.png',
    site: 'https://microsoft.com',
    description: 'Leading technology company supporting student innovation'
  },
  {
    id: 'google',
    tier: 'platinum',
    name: 'Google',
    logo: '/assets/companies/blackstone.png',
    site: 'https://google.com',
    description: 'Empowering the next generation of developers'
  },
  
  // Gold Sponsors
  {
    id: 'amazon',
    tier: 'gold',
    name: 'Amazon',
    logo: '/assets/companies/perplexity.png',
    site: 'https://amazon.com',
    description: 'Innovation in cloud computing and e-commerce'
  },
  {
    id: 'lockheed',
    tier: 'gold',
    name: 'Lockheed Martin',
    logo: '/assets/companies/lockheed.png',
    site: 'https://lockheedmartin.com',
    description: 'Building the future of aerospace and defense technology'
  },
  {
    id: 'paycom',
    tier: 'gold',
    name: 'Paycom',
    logo: '/assets/companies/paycom.png',
    site: 'https://paycom.com',
    description: 'Think different with innovative technology'
  },

  
  // General Sponsors
  {
    id: 'jobright',
    tier: 'general',
    name: 'Jobright',
    logo: '/assets/companies/jobright.svg',
    site: 'https://jobright.ai',
    description: 'Where the world builds software'
  },
];