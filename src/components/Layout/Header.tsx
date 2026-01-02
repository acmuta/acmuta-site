import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Committees', path: '/committees' },
    { name: 'Officers', path: '/officers' },
    { name: 'Projects', path: '/projects' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass-card backdrop-blur-md' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>
            <img
              src="/assets/logo/acm-logo.png"
              alt="ACM UTA Logo"
              className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gradient">ACM UTA</div>
              <div className="text-xs text-white/60">University of Texas at Arlington</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                className={`nav-link ${
                  location.pathname === item.path ? 'text-accent' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="https://mavengage.uta.edu/submitter/form/start/623436"
              target="_blank"
              rel="noopener noreferrer"
              className=""
            >
              Join ACM
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg glass-card text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass-card backdrop-blur-md border-t border-white/10 mt-1">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    setIsOpen(false);
                  }}
                  className={`block py-2 text-lg transition-colors ${
                    location.pathname === item.path 
                      ? 'text-accent' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <a
                  href="https://mavengage.uta.edu/submitter/form/start/623436"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center"
                >
                  Join ACM
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};