import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Committees', path: '/committees' },
    { name: 'Officers', path: '/officers' },
    { name: 'Events', path: '/events' },
  ];

  const resources = [
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
    { name: 'Join ACM', path: 'https://mavengage.uta.edu/submitter/form/start/623436', external: true },
    { name: 'Mailing List', path: 'https://forms.gle/vvu4T9SKP5LnZtgs6', external: true },
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/acmuta', label: 'GitHub' }, 
    { icon: Linkedin, href: 'https://www.linkedin.com/company/acmuta', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/acmuta', label: 'Instagram' },
    { icon: Mail, href: 'mailto:acm.uta@gmail.com', label: 'Email' }, 
  ];

  return (
    <footer className="border-t border-white/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img
                src="/assets/logo/acm-logo.png"
                alt="ACM UTA Logo"
                className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
              />              
              <div>
                <div className="text-2xl font-bold text-gradient">ACM UTA</div>
                <div className="text-sm text-white/60">Association for Computing Machinery</div>
              </div>
            </Link>
            <p className="text-white/70 mb-6 max-w-md">
              The premier student computing organization at the University of Texas at Arlington, 
              fostering innovation, education, and community in computer science and technology.
            </p>
            <div className="flex items-center space-x-2 text-white/60 mb-4">
              <MapPin size={16} />
              <span className="text-sm">University of Texas at Arlington</span>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="glass-card p-3 hover:bg-white/10 transition-colors group"
                  aria-label={social.label}
                >
                  <social.icon size={20} className="text-white/60 group-hover:text-accent transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-accent transition-colors flex items-center space-x-1"
                    >
                      <span>{link.name}</span>
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-white/70 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © {currentYear} ACM UTA. All rights reserved.
          </div>
          <div className="text-white/60 text-sm">
            Built with ❤️ by the ACM UTA Marketing Committee
          </div>
        </div>
      </div>
    </footer>
  );
};