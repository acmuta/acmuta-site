import Image from 'next/image';
import { BsLinkedin } from "react-icons/bs";
import { FiInstagram } from "react-icons/fi";
import { FaGlobeAmericas } from "react-icons/fa";

interface PeopleProps {
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
    socialLinks: {
      linkedin?: string;
      instagram?: string;
      website?: string; 
      [key: string]: string | undefined; // If you want to support additional links
    };
  }

  const People: React.FC<PeopleProps> = ({ name, role, imageUrl, socialLinks }) => {
  return (
    <div className="flex items-center space-x-6 py-4">
      <div className="flex-shrink-0">
        <Image 
          src={imageUrl} 
          alt={`${name}'s picture`} 
          width={100} 
          height={100} 
          className="rounded-full"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <h4 className="text-sm mb-2 text-green-100">{role}</h4>
        <div className="flex space-x-4">
          {socialLinks?.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-600 text-2xl">
              <BsLinkedin />
            </a>
          )}
          {socialLinks?.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-black hover:text-rose-600 text-2xl">
              <FiInstagram />
            </a>
          )}
          {socialLinks?.website && (
            <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-black hover:text-indigo-600 text-2xl">
              <FaGlobeAmericas />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default People;