import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, Filter, X } from 'lucide-react';
import { officers } from '@/data/officers';
import { committees } from '@/data/committees';
import { alumni } from '@/data/alumni';

gsap.registerPlugin(ScrollTrigger);

const Officers = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>('all');

  const execOfficers = officers.filter(officer => officer.isExec);
  const committeeOfficers = officers.filter(officer => !officer.isExec);

  const filteredOfficers = filter === 'all' 
    ? [...execOfficers, ...committeeOfficers]
    : filter === 'exec'
    ? execOfficers
    : committeeOfficers.filter(officer => officer.committeeId === filter);

  const filterOptions = [
    { id: 'all', label: 'All Officers', count: execOfficers.length + committeeOfficers.length },
    { id: 'exec', label: 'Executive Board', count: execOfficers.length },
    ...committees.map(committee => ({
      id: committee.id,
      label: committee.name,
      count: committeeOfficers.filter(o => o.committeeId === committee.id).length
    }))
  ];

  const sortedAlumni = [...alumni].sort((a, b) => {
    const aIsPresident = a.role.toLowerCase().includes('president');
    const bIsPresident = b.role.toLowerCase().includes('president');
    
    if (aIsPresident && !bIsPresident) return -1;
    if (!aIsPresident && bIsPresident) return 1;
    
    return b.year.localeCompare(a.year);
  });

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="officers-hero section-padding">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-8">
            Our Officers
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Meet the dedicated leaders who drive ACM UTA forward. Our officers are passionate 
            students committed to serving our community and advancing the field of computing.
          </p>
        </div>
      </section>

      {/* Executive Board - Always Visible */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Executive Board
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              The executive team provides strategic leadership and governance for ACM UTA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto justify-items-center">
            {execOfficers.map((officer, index) => (
              <div key={officer.id} className="officer-card group">
                <div className="relative mb-6">
                  <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                    <div 
                      className="w-full h-full bg-gradient-to-br from-primary to-accent"
                      style={{
                        backgroundImage: `url(${officer.avatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                    </div>
                  </div>
                  
                  {/* LinkedIn overlay */}
                  <a
                    href={officer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 glass-card p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/20"
                  >
                    <Linkedin className="h-5 w-5 text-accent" />
                  </a>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">{officer.name}</h3>
                  <div className="text-accent font-medium mb-3">{officer.role}</div>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {officer.focus.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Committee Officers
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Discover the leaders of our specialized committees who organize events, 
              manage projects, and build our community.
            </p>

            {/* Filter Controls */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="flex items-center glass-card p-2 rounded-lg">
                <Filter className="h-4 w-4 text-accent mr-2" />
                <span className="text-white/70 text-sm">Filter by:</span>
              </div>
              
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                    filter === option.id
                      ? 'bg-accent text-black'
                      : 'glass-card text-white hover:bg-white/10'
                  }`}
                >
                  {option.label} {option.count > 0 && `(${option.count})`}
                </button>
              ))}
              
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="glass-card p-2 text-white hover:bg-white/10 transition-colors"
                  title="Clear filter"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Officers Grid */}
          {filteredOfficers.length > 0 ? (
            <div className="officers-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto justify-items-center">
              {filteredOfficers.map((officer, index) => (
                <div key={officer.id} className="officer-card group">
                  <div className="relative mb-6">
                    <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                      <div 
                        className="w-full h-full bg-gradient-to-br from-primary to-accent"
                        style={{
                          backgroundImage: `url(${officer.avatar})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    </div>
                    
                    {/* LinkedIn overlay */}
                    <a
                      href={officer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-4 right-4 glass-card p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/20"
                    >
                      <Linkedin className="h-5 w-5 text-accent" />
                    </a>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{officer.name}</h3>
                    <div className="text-accent font-medium mb-3">{officer.role}</div>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      {officer.focus.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="glass-card p-8 max-w-md mx-auto">
                <p className="text-white/70 text-lg">
                  No officers found for the selected filter.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* Join Leadership CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gradient mb-6">
              Interested in Leadership?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              ACM UTA is always looking for passionate students to join our leadership team. 
              Officer positions become available each semester, and we encourage members 
              to get involved and make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://mavengage.uta.edu/submitter/form/start/623436"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4"
              >
                Become a Member
              </a>
              <a
                href="/contact"
                className="btn-secondary text-lg px-8 py-4"
              >
                Contact Leadership
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Officers;
