import Department from '../../components/Department';

export default function Officers() {
  const departments = [
    {
      name: 'executive directors',
      logoUrl: '/assets/acm-logo.svg',
      people: [
        {
          name: 'devrat patel',
          role: 'president',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://www.instagram.com/johndoe',
            website: 'https://www.johndoe.com',
          },
        },
        {
          name: 'yash',
          role: 'vice president',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://www.instagram.com/johndoe',
            website: 'https://www.johndoe.com',
          },
        },
        {
          name: 'muhammad',
          role: 'treasurer',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://www.instagram.com/johndoe',
            website: 'https://www.johndoe.com',
          },
        },
        {
          name: 'jeremiah',
          role: 'events coordinator',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://www.instagram.com/johndoe',
            website: 'https://www.johndoe.com',
          },
        },
        {
          name: 'vrindha',
          role: 'events planner',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://www.instagram.com/johndoe',
            website: 'https://www.johndoe.com',
          },
        },
        {
          name: 'bobby f',
          role: 'student advisor',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://www.instagram.com/johndoe',
            website: 'https://www.johndoe.com',
          },
        },
      ],
    },
    {
      name: 'create',
      logoUrl: '/assets/acm-create-logo.svg',
      people: [
        {
          name: 'talha tahmid',
          role: 'officer',
          imageUrl: '/images/talhaheadshot.jpg',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/talhatahmid',
            instagram: 'https://www.instagram.com/talha.thmd',
            website: 'https://www.talhathmd.com',
          },
        },
      
      ],
    },
    {
      name: 'marketing',
      logoUrl: '/assets/acm-hackuta-logo.svg',
      people: [
        {
          name: 'abcd',
          role: 'officer',
          imageUrl: '/images/noheadshot.webp',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            instagram: 'https://www.instagram.com/johndoe',
            website: 'https://www.johndoe.com',
          },
        },
        // Add more people here...
      ],
    },
    // Add more departments here...
  ];

  return (
    <div className="py-10 px-5">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">meet the team</h1>
        <p className="text-lg text-gray-200">get to know the amazing people behind our work!</p>
      </header>

      <div className="space-y-12">
        {departments.map((department, index) => (
          <Department 
            key={index} 
            name={department.name} 
            logoUrl={department.logoUrl} 
            people={department.people} 
          />
        ))}
      </div>
    </div>
  );
}
