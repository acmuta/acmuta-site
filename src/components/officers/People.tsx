import Image from 'next/image';
import { BsLinkedin } from "react-icons/bs";
import { FiInstagram } from "react-icons/fi";
import { FaGlobeAmericas } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

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

  
  const People: React.FC<PeopleProps> = ({ name, role, imageUrl, socialLinks }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center space-x-6 py-4">
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
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 text-lg">
              <BsLinkedin />
            </a>
          )}
          {socialLinks?.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-rose-300 text-lg">
              <FiInstagram />
            </a>
          )}
          {socialLinks?.github && (
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white hover:text-neutral-400 text-lg">
              <FaGithub />
            </a>
          )}
          {socialLinks?.website && (
            <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-300 text-lg">
              <FaGlobeAmericas />
            </a>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default People;