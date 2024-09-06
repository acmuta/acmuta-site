import Image from 'next/image';
import People from './People';

interface PeopleProps {
    name: string;
    role: string;
    imageUrl: string;
    socialLinks: {
      linkedin?: string;
      instagram?: string;
      website?: string;
      [key: string]: string | undefined;
    };
  }

interface DepartmentProps {
  name: string;
  logoUrl: string;
  people: PeopleProps[];
}

const Department: React.FC<DepartmentProps> = ({ name, logoUrl, people }) => {
  return (
    <section className="items-center mb-12">
      <div className="flex items-center space-x-4 mb-6">
        <Image 
          src={logoUrl} 
          alt={`${name} logo`} 
          width={50} 
          height={50} 
          className="object-contain"
        />
        <h2 className="text-3xl font-bold">{name}</h2>
      </div>

      <div className="grid ml-20 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person, index) => (
          <People key={index} {...person} />
        ))}
      </div>
    </section>
  );
}

export default Department;
