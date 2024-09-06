import Department from '../../components/Department';
import Image from 'next/image';

export default function Officers() {
  const departments = [
    {
      name: 'executive directors',
      logoUrl: '/assets/acm-logo.svg',
      people: [
        {
          name: 'devrat patel',
          role: 'president',
          imageUrl: '/images/devrat.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/devratpatel/',
            instagram: 'https://www.instagram.com/devratpatel',
            github: 'https://github.com/DevratPatel',
          },
        },
        {
          name: 'yash rao',
          role: 'vice president',
          imageUrl: '/images/yash.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/yash-rao-9082bb246',
            instagram: 'https://www.instagram.com/yash.r.rao',
            github: 'https://github.com/tecno5',
          },
        },
        {
          name: 'muhammad khurram',
          role: 'treasurer',
          imageUrl: '/images/mohammad.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/m-khurram',
            instagram: 'https://www.instagram.com/ultimatem.90',
            github: 'https://github.com/MuhammadHunainKhurram',
          },
        },
        {
          name: 'jeremiah pitts',
          role: 'events coordinator',
          imageUrl: '/images/jeremiah.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/jeremiahpitts',
            instagram: 'https://www.instagram.com/jpfit321',
            github: 'https://github.com/xchar08',
          },
        },
        {
          name: 'vrindha koppisetty',
          role: 'events planner',
          imageUrl: '/images/vrindha.png',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
        {
          name: 'bobby flennoy',
          role: 'student advisor',
          imageUrl: '/images/bobby.png',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
      ],
    },
    {
      name: 'create',
      logoUrl: '/assets/acm-create-logo.svg',
      people: [
        {
          name: 'atiqur rahman',
          role: 'director',
          imageUrl: '/images/atiq.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/atiqurx',
            instagram: 'https://www.instagram.com/atiqur__',
            github: 'https://github.com/atiqurx',
            website: 'https://www.atiqurx.com',
          },
        },
        {
          name: 'kevin farokhrouz',
          role: 'director',
          imageUrl: '/images/kevin.png',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/kevinrouz',
            instagram: 'https://www.instagram.com/kevinrouz',
            github: 'https://github.com/kevinrouz',
          },
        },
        {
          name: 'talha tahmid',
          role: 'officer',
          imageUrl: '/images/talhatahmid.png',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/talhatahmid',
            instagram: 'https://www.instagram.com/talha.thmd',
            github: 'https://github.com/talhathmd',
            website: 'https://www.talhathmd.com',
          },
        },
        {
          name: 'md rashidul alam sami',
          role: 'officer',
          imageUrl: '/images/rashidul.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/rashidulas/',
            instagram: 'https://www.instagram.com/rashidul___',
            github: 'https://github.com/rashidulas',
          },
        },
        {
          name: 'prajit viswanadha',
          role: 'officer',
          imageUrl: '/images/prajit.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/prajit-viswanadha/',
            instagram: '',
            github: 'https://github.com/V-prajit',
          },
        },
        {
          name: 'shashank yaji',
          role: 'officer',
          imageUrl: '/images/shashank.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/shashankyaji/',
            instagram: 'https://www.instagram.com/yajishashank',
            github: 'https://github.com/SSKYAJI',
          },
        },
        {
          name: 'shloka bhatt',
          role: 'officer',
          imageUrl: '/images/shloka.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/shloka-bhatt/',
            instagram: 'https://www.instagram.com/shhhhhlokaa',
            github: 'https://github.com/shloka2212',
          },
        },
      ],
    },
    {
      name: 'marketing',
      logoUrl: '/assets/acm-hackuta-logo.svg',
      people: [
        {
          name: 'felix cherian',
          role: 'director',
          imageUrl: '/images/felix.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/felix-cherian',
            instagram: 'https://www.instagram.com/felix_cherian',
            github: 'https://github.com/Flexinos717',
          },
        },
        {
          name: 'jaideep singh',
          role: 'officer',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
        {
          name: 'tista manandhar',
          role: 'officer',
          imageUrl: '/images/tista.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/tistamanandhar19/',
            instagram: 'https://www.instagram.com/_tistaa',
            github: 'https://github.com/txm19',
          },
        },
        {
          name: 'ishu pokhrel',
          role: 'officer',
          imageUrl: '/images/ishu.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/ishu-pokhrel',
            instagram: 'https://www.instagram.com/ishuthexplorer',
            github: '',
          },
        },
        {
          name: 'dominic lamana',
          role: 'officer',
          imageUrl: '/images/dominic.png',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
      ],
    },
    {
      name: 'educate',
      logoUrl: '/assets/acm-educate-logo.svg',
      people: [
        {
          name: 'trevor',
          role: 'director',
          imageUrl: '/images/trevor.png',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
        {
          name: 'linh nguyen',
          role: 'director',
          imageUrl: '/images/linh.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/lninnn',
            instagram: 'https://www.instagram.com/_lninn_',
            github: 'https://github.com/lninnn',
          },
        },
        {
          name: 'shloka bhatt',
          role: 'officer',
          imageUrl: '/images/shloka.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/shloka-bhatt/',
            instagram: 'https://www.instagram.com/shhhhhlokaa',
            github: 'https://github.com/shloka2212',
          },
        },
        {
          name: 'sheena buwemi',
          role: 'officer',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
        {
          name: 'meghana chevva',
          role: 'officer',
          imageUrl: '/images/meghana.png',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
        {
          name: 'aryan',
          role: 'officer',
          imageUrl: '/images/aryan.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/meghana-chevva/',
            instagram: 'https://www.instagram.com/Meghana_anahgem',
            github: 'https://github.com/meggitt',
          },
        },
      ],
    },
    {
      name: 'outreach',
      logoUrl: '/assets/acm-research-logo.svg',
      people: [
        {
          name: 'paul santana',
          role: 'director',
          imageUrl: '/images/paul.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/paul-hunter-santana/',
            instagram: 'https://www.instagram.com/smhpaul_',
            github: 'https://github.com/PostHScript',
          },
        },
        {
          name: 'will maberry',
          role: 'officer',
          imageUrl: '/images/will.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/will-maberry/',
            instagram: 'https://www.instagram.com/maberrywill',
            github: 'https://github.com/dinosaur-oatmeal',
          },
        },
        {
          name: 'tista manandhar',
          role: 'officer',
          imageUrl: '/images/tista.png',
          socialLinks: {
            linkedin: 'https://www.linkedin.com/in/tistamanandhar19/',
            instagram: 'https://www.instagram.com/_tistaa',
            github: 'https://github.com/txm19',
          },
        },
      ],
    },
    {
      name: 'research',
      logoUrl: '/assets/acm-research-logo.svg',
      people: [
        {
          name: 'bobby flennoy',
          role: 'director',
          imageUrl: '/images/bobby.png',
          socialLinks: {
            linkedin: '',
            instagram: '',
            github: '',
          },
        },
      ],
    },
    
  ];

  return (
    <div className="py-10 px-5">
      <header className="text-start mb-28 m-20 ml-40">
        <h1 className="text-5xl font-bold mb-4">meet the team</h1>
        <p className="text-xl text-gray-200">get to know the amazing people behind our work!</p>
      </header>

      <div className="space-y-12 ml-20">
        {departments.map((department, index) => (
          <Department 
            key={index} 
            name={department.name} 
            logoUrl={department.logoUrl} 
            people={department.people} 
          />
        ))}
      </div>
      <div className="absolute top-96 right-72 rotate-90 blur-sm transform -translate-y-1/2">
      <Image 
        src="/assets/crystal-1.png" 
        alt="Crystal Design Element" 
        width={400} 
        height={400} 
        className="opacity-100" 
      />
    </div>
    <div className="absolute top-60 right-24 transform blur-sm -translate-y-1/2">
      <Image 
        src="/assets/crystal-2.png" 
        alt="Crystal Design Element" 
        width={300} 
        height={300} 
        className="opacity-100" 
      />
    </div>
    <div className="absolute top-44 right-96 rotate-90 blur-sm transform -translate-y-1/2">
      <Image 
        src="/assets/crystal-2.png" 
        alt="Crystal Design Element" 
        width={200} 
        height={200} 
        className="opacity-100" 
      />
    </div>
    <div className="absolute blur-sm right-0 -translate-y-72 -rotate-12 transform">
      <Image 
        src="/assets/web.png" 
        alt="Crystal Design Element" 
        width={600} 
        height={600} 
        className="opacity-100" 
      />
    </div>
    </div>
  );
}
