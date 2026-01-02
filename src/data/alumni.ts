export interface AlumniOfficer {
  id: string;
  name: string;
  role: string;
  year: string;
  avatar: string;
  linkedin?: string;
  focus?: string[];
}

export const alumni: AlumniOfficer[] = [
  {
    id: 'alumni-yash',
    name: 'Yash Rao',
    role: 'Student Advisor',
    year: '2024–2025',
    avatar: '/assets/officerpics/yash.jpeg',
    linkedin: 'https://www.linkedin.com/in/yash-rao-9082bb246',
    focus: ['Mentorship', 'Advising', 'Org Continuity']
  },
  {
    id: 'alumni-tobi',
    name: 'Tobi Akere',
    role: 'Create Director',
    year: '2024–2025',
    avatar: '/assets/officerpics/tobi.png',
    linkedin: '',
    focus: ['Projects', 'Development', 'Innovation']
  },
];
