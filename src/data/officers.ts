export interface Officer {
id: string;
name: string;
role: string;
focus: string[];
linkedin: string;
avatar: string;
isExec?: boolean;
committeeId?: string;
isDirector?: boolean;
}

export const officers: Officer[] = [
  {
  id: 'pres',
  name: 'Muhammad Khurram',
  role: 'President',
  focus: ['Leadership', 'Strategy', 'Organization'],
  linkedin: 'https://www.linkedin.com/in/m-khurram/',
  avatar: '/assets/officerpics/muhammad.png',
  isExec: true
  },
  {
  id: 'vpres',
  name: 'Kevin Farokhrouz',
  role: 'Vice President',
  focus: ['Operations', 'Events', 'Coordination'],
  linkedin: 'https://linkedin.com/in/kevinrouz',
  avatar: '/assets/officerpics/kevin.png',
  isExec: true
  },
  {
  id: 'secretary',
  name: 'Aastha Khatri',
  role: 'Secretary',
  focus: ['Documentation', 'Communications', 'Records'],
  linkedin: 'https://www.linkedin.com/in/aastha-k-b69a5a248/',
  avatar: '/assets/officerpics/aastha.jpeg',
  isExec: true
  },
  {
  id: 'treasurer',
  name: 'Ali Jifi-Bahlool',
  role: 'Treasurer',
  focus: ['Finance', 'Budgeting', 'Sponsorships'],
  linkedin: 'https://www.linkedin.com/in/ali-jifi-bahlool/',
  avatar: '/assets/officerpics/ali.JPG',
  isExec: true
  },
  {
  id: 'studadv-bobby',
  name: 'Bobby Flennoy',
  role: 'Student Advisor',
  focus: ['Mentorship', 'Advising', 'Org Continuity'],
  linkedin: 'https://www.linkedin.com/in/bobby-flennoy/',
  avatar: '/assets/officerpics/bobby.JPG',
  isExec: true
  },
  {
  id: 'studadv-yash',
  name: 'Yash Rao',
  role: 'Student Advisor',
  focus: ['Mentorship', 'Advising', 'Org Continuity'],
  linkedin: 'https://www.linkedin.com/in/yash-rao-9082bb246',
  avatar: '/assets/officerpics/yash.jpeg',
  isExec: true
  },

  // Create (Red)
  {
  id: 'create-tobi',
  name: 'Tobi Akere',
  role: 'Create Director',
  focus: ['Projects', 'Development', 'Innovation'],
  linkedin: '',
  avatar: '/assets/officerpics/tobi.png',
  committeeId: 'create',
  isDirector: true
  },
  {
  id: 'create-ghiya',
  name: 'Ghiya El Daouk El Kadi',
  role: 'Create Director',
  focus: ['Projects', 'Development', 'Innovation'],
  linkedin: '',
  avatar: '/assets/officerpics/ghiya.jpeg',
  committeeId: 'create',
  isDirector: true
  },
  {
  id: 'create-prajit',
  name: 'Prajit Viswanadha',
  role: 'Create Director',
  focus: ['Projects', 'Development', 'Innovation'],
  linkedin: 'https://www.linkedin.com/in/prajit-viswanadha/',
  avatar: '/assets/officerpics/prajit.jpg',
  committeeId: 'create'
  },  
  {
  id: 'create-wendolee',
  name: 'Wendolee Villegas',
  role: 'Project Manager',
  focus: ['Projects', 'Development', 'Innovation'],
  linkedin: '',
  avatar: '/assets/officerpics/wendolee.jpeg',
  committeeId: 'create'
  },

  // Research (Teal)
  {
  id: 'research-mariah',
  name: 'Mariah Gardner',
  role: 'Research Director',
  focus: ['Academic Research', 'Reading Groups', 'Publications'],
  linkedin: '',
  avatar: '/assets/officerpics/mariah.jpg',
  committeeId: 'research',
  isDirector: true
  },
  {
  id: 'research-rohita',
  name: 'Rohita Konjeti',
  role: 'Research Director',
  focus: ['Academic Research', 'Reading Groups', 'Publications'],
  linkedin: 'https://www.linkedin.com/in/rohita-k/',
  avatar: '/assets/officerpics/rohita.jpg',
  committeeId: 'research',
  isDirector: true
  },
  {
  id: 'research-janet',
  name: 'Janet Barba',
  role: 'Research Officer',
  focus: ['Academic Research', 'Reading Groups', 'Publications'],
  linkedin: '',
  avatar: '/assets/officerpics/janet.jpg',
  committeeId: 'research'
  },
  {
  id: 'research-subhaan',
  name: 'Subhaan Elburz',
  role: 'Research Officer',
  focus: ['Academic Research', 'Reading Groups', 'Publications'],
  linkedin: '',
  avatar: '/assets/officerpics/subhaan.jpg',
  committeeId: 'research'
  },
  {
  id: 'research-vamshi',
  name: 'Vamshi Vavilla',
  role: 'Research Officer',
  focus: ['Academic Research', 'Reading Groups', 'Publications'],
  linkedin: '',
  avatar: '/assets/officerpics/vamshi.png',
  committeeId: 'research'
  },


  // Outreach (Orange)
  {
  id: 'outreach-paul',
  name: 'Paul Santana',
  role: 'Outreach Director',
  focus: ['Community Engagement', 'Partners', 'K-12'],
  linkedin: 'https://www.linkedin.com/in/paul-hunter-santana/',
  avatar: '/assets/officerpics/paul.jpg',
  committeeId: 'outreach',
  isDirector: true
  },
  {
  id: 'outreach-vincent',
  name: 'Vincent Dang',
  role: 'Outreach Officer',
  focus: ['Community Engagement', 'Partners', 'K-12'],
  linkedin: 'https://www.linkedin.com/in/vdanguta/',
  avatar: '/assets/officerpics/vincent.jpg',
  committeeId: 'outreach'
  },
  {
  id: 'outreach-addison',
  name: 'Jacob Mathew',
  role: 'Outreach Officer',
  focus: ['Community Engagement', 'Partners', 'K-12'],
  linkedin: 'https://www.linkedin.com/in/jacob-mathew-794987306/',
  avatar: '/assets/officerpics/jacob.jpg',
  committeeId: 'outreach'
  },
  {
  id: 'outreach-evelyn',
  name: 'Evelyn Trevino',
  role: 'Outreach Officer',
  focus: ['Community Engagement', 'Partners', 'K-12'],
  linkedin: '',
  avatar: '/assets/officerpics/eve.jpeg',
  committeeId: 'outreach'
  },
  {
  id: 'outreach-mahim',
  name: 'Mahim Kabir',
  role: 'Outreach Officer',
  focus: ['Community Engagement', 'Partners', 'K-12'],
  linkedin: 'http://linkedin.com/in/tasmim-kabir-mahim',
  avatar: '/assets/officerpics/mahim.JPG',
  committeeId: 'outreach'
  },
  {
  id: 'outreach-peter',
  name: 'Peter Tran',
  role: 'Outreach Officer',
  focus: ['Community Engagement', 'Partners', 'K-12'],
  linkedin: 'https://www.linkedin.com/in/peter-phi-tran/',
  avatar: '/assets/officerpics/peter.jpeg',
  committeeId: 'outreach'
  },


  // Marketing (Yellow)
  {
  id: 'marketing-salima',
  name: 'Salima Salman',
  role: 'Marketing Director',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: '',
  avatar: '/assets/officerpics/salima.jpeg',
  committeeId: 'marketing',
  isDirector: true
  },
  {
  id: 'marketing-felix',
  name: 'Felix Cherian',
  role: 'Marketing Director',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: 'https://www.linkedin.com/in/felix-cherian',
  avatar: '/assets/officerpics/felix.jpeg',
  committeeId: 'marketing',
  isDirector: true
  },
  {
  id: 'marketing-nnanna',
  name: 'Nnanna Ejim',
  role: 'Marketing Officer',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: 'https://www.linkedin.com/in/nnanna-ejim/',
  avatar: '/assets/officerpics/nnanna.png',
  committeeId: 'marketing'
  },
  {
  id: 'marketing-mohammed',
  name: 'Mohammed Hajee',
  role: 'Marketing Officer',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: '',
  avatar: '/assets/officerpics/mohammed.png',
  committeeId: 'marketing'
  },
  {
  id: 'marketing-sarah',
  name: 'Sarah Naifa',
  role: 'Marketing Officer',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: 'www.linkedin.com/in/sarah-naifa',
  avatar: '/assets/officerpics/sarah.png',
  committeeId: 'marketing'
  },
  {
  id: 'marketing-hania',
  name: 'Hania Abbasi',
  role: 'Marketing Officer',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: '',
  avatar: '/assets/officerpics/hania.jpeg',
  committeeId: 'marketing'
  },
  {
  id: 'marketing-thinh',
  name: 'Thinh Tran',
  role: 'Marketing Officer',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: '',
  avatar: '/assets/officerpics/thinh.jpeg',
  committeeId: 'marketing'
  },
  {
  id: 'marketing-namira',
  name: 'Namira Asem',
  role: 'Marketing Officer',
  focus: ['Design', 'Social Media', 'Branding'],
  linkedin: '',
  avatar: '/assets/officerpics/namira.jpeg',
  committeeId: 'marketing'
  },

  // Educate (Green)
  {
  id: 'educate-will',
  name: 'Will Maberry',
  role: 'Educate Director',
  focus: ['Teaching', 'Workshops', 'Career Development'],
  linkedin: 'https://www.linkedin.com/in/will-maberry/',
  avatar: '/assets/officerpics/will.jpg',
  committeeId: 'educate',
  isDirector: true
  },
  {
  id: 'create-zaineel',
  name: 'Zaineel Mithani',
  role: 'Educate Director',
  focus: ['Careers', 'Tech Interviews', 'Networking'],
  linkedin: '',
  avatar: '/assets/officerpics/zain.jpeg',
  committeeId: 'educate',
  isDirector: true
  },
  {
  id: 'educate-ishana',
  name: 'Ishana Khandakar',
  role: 'Educate Officer',
  focus: ['Teaching', 'Workshops', 'Career Development'],
  linkedin: '',
  avatar: '/assets/officerpics/iggy.jpeg',
  committeeId: 'educate'
  },
  {
  id: 'educate-an',
  name: 'An Duong',
  role: 'Educate Officer',
  focus: ['Teaching', 'Workshops', 'Career Development'],
  linkedin: 'https://www.linkedin.com/in/real-an-duong',
  avatar: '/assets/officerpics/an.jpeg',
  committeeId: 'educate'
  },
  {
  id: 'educate-grace',
  name: 'Grace Whitney',
  role: 'Educate Officer',
  focus: ['Teaching', 'Workshops', 'Career Development'],
  linkedin: 'www.linkedin.com/in/whitney-grace',
  avatar: '/assets/officerpics/grace.JPG',
  committeeId: 'educate'
  },

  // Community (Purple)
  {
  id: 'community-yoselin',
  name: 'Yoselin Ventura',
  role: 'Community Director',
  focus: ['Social Events', 'Member Engagement', 'Culture'],
  linkedin: 'http://linkedin.com/in/yoselin-ventura-a01036334',
  avatar: '/assets/officerpics/yoselin.jpeg',
  committeeId: 'community',
  isDirector: true
  },
  {
  id: 'community-kimiya',
  name: 'Kimiya Ceballos',
  role: 'Community Officer',
  focus: ['Social Events', 'Member Engagement', 'Culture'],
  linkedin: 'https://www.linkedin.com/in/kimiyaceballos/',
  avatar: '/assets/officerpics/kimiya.jpeg',
  committeeId: 'community',
  isDirector: true
  },
  {
  id: 'community-steven',
  name: 'Steven Nguyen',
  role: 'Community Officer',
  focus: ['Social Events', 'Member Engagement', 'Culture'],
  linkedin: 'https://www.linkedin.com/in/stevnnguyen/',
  avatar: '/assets/officerpics/steven.jpg',
  committeeId: 'community'
  },
  {
  id: 'community-samera',
  name: 'Samera Wadud',
  role: 'Community Officer',
  focus: ['Social Events', 'Member Engagement', 'Culture'],
  linkedin: '',
  avatar: '/assets/officerpics/mera.jpeg',
  committeeId: 'community'
  },
  {
  id: 'community-paul',
  name: 'Paul Dang',
  role: 'Community Officer',
  focus: ['Social Events', 'Member Engagement', 'Culture'],
  linkedin: 'https://www.linkedin.com/in/paul-dang-260a74290',
  avatar: '/assets/officerpics/pauld.jpeg',
  committeeId: 'community'
  },
  {
  id: 'community-christopher',
  name: 'Christopher Tran',
  role: 'Community Officer',
  focus: ['Social Events', 'Member Engagement', 'Culture'],
  linkedin: 'https://www.linkedin.com/in/christran4209',
  avatar: '/assets/officerpics/christ.jpg',
  committeeId: 'community'
  },

  // HackUTA
  {
  id: 'hackuta-dominic',
  name: 'Dominic Lamana',
  role: 'HackUTA Exec Director',
  focus: ['Event Planning', 'Hackathons', 'Logistics'],
  linkedin: 'https://www.linkedin.com/in/dominic-lamana/',
  avatar: '/assets/officerpics/dominic.jpg',
  committeeId: 'hackuta',
  isDirector: true
  },
  {
  id: 'hackuta-may',
  name: 'Tanmayee Siddineni',
  role: 'HackUTA Exec Director',
  focus: ['Event Planning', 'Hackathons', 'Experience'],
  linkedin: 'https://www.linkedin.com/in/tanmayee523/',
  avatar: '/assets/officerpics/may.jpg',
  committeeId: 'hackuta',
  isDirector: true
  },
  {
  id: 'hackuta-oscar',
  name: 'Oscar Ventura',
  role: 'HackUTA Officer',
  focus: ['Event Planning', 'Hackathons', 'Logistics'],
  linkedin: 'https://www.linkedin.com/in/oscar-ventura-cs',
  avatar: '/assets/officerpics/oscar.png',
  committeeId: 'hackuta',
  },
    {
  id: 'hackuta-ved',
  name: 'Ved Dharmatti',
  role: 'HackUTA Officer',
  focus: ['Event Planning', 'Hackathons', 'Experience'],
  linkedin: 'http://linkedin.com/in/ved-dharmatti',
  avatar: '/assets/officerpics/ved.jpg',
  committeeId: 'hackuta',
  },
];
