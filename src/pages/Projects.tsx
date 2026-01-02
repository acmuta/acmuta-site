import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '@/data/projects';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  image: string;
  summary: string;
  codeUrl?: string;
  websiteUrl?: string;
  committee: string;
}

export default function Projects() {
  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content > *', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power2.out" 
        }
      );

      const projectCards = gsap.utils.toArray('.project-card');
      gsap.fromTo(projectCards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding">
        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Projects
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Explore the innovative projects built by ACM UTA members. 
              From web applications to research platforms, our committees create 
              solutions that benefit the university and broader community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="glass-card p-4 flex items-center gap-3">
                <Github className="h-6 w-6 text-accent" />
                <span className="text-white">Open Source</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <ExternalLink className="h-6 w-6 text-accent" />
                <span className="text-white">Live Demos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section ref={projectsRef} className="section-padding">
        <div className="container mx-auto px-6">
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="project-card glass-card overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                      {project.committee}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">
                    {project.summary}
                  </p>
                  
                  <div className="flex gap-3">
                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-primary to-primary-light text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        View Code
                      </a>
                    )}
                    {project.websiteUrl && (
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 glass-card text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-300 hover:bg-white/10 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}