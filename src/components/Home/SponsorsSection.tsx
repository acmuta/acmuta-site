import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink } from 'lucide-react';
import { sponsors } from '@/data/sponsors';

gsap.registerPlugin(ScrollTrigger);

export const SponsorsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'platinum' | 'gold' | 'silver'>('all');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".sponsors-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: ".sponsors-header",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      const cards = gsap.utils.toArray('.sponsor-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".sponsors-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [activeTab]);

  const tabs = [
    { id: 'all', label: 'All', count: sponsors.length },
    { id: 'platinum', label: 'Platinum', count: sponsors.filter(s => s.tier === 'platinum').length },
    { id: 'gold', label: 'Gold', count: sponsors.filter(s => s.tier === 'gold').length },
    { id: 'silver', label: 'Silver', count: sponsors.filter(s => s.tier === 'silver').length },
  ] as const;

  const filteredSponsors = activeTab === 'all' 
    ? sponsors 
    : sponsors.filter(sponsor => sponsor.tier === activeTab);

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-gray-300 to-gray-100 text-gray-800';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-800';
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800';
      default: return 'bg-gradient-to-r from-accent/20 to-primary/20 text-accent';
    }
  };

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container mx-auto px-6">
        <div className="sponsors-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Our Partners
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We're grateful for the support of these amazing organizations that help 
            make our mission possible and provide opportunities for our members.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-accent text-black'
                  : 'glass-card text-white hover:bg-white/10'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* Sponsors Grid */}
        <div className="sponsors-grid grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center max-w-4xl mx-auto">
          {filteredSponsors.map((sponsor) => (
            <a 
              key={sponsor.id} 
              href={sponsor.site}
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-card glass-card p-8 flex items-center justify-center transition-all duration-300 hover:bg-white/[0.05] hover:scale-105 cursor-pointer w-full max-w-xs"
            >
              <img 
                src={sponsor.logo} 
                alt={sponsor.name}
                className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          ))}
        </div>

        {/* Empty State */}
        {filteredSponsors.length === 0 && (
          <div className="text-center py-16">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-white/70 text-lg">
                No sponsors found in this category.
              </p>
            </div>
          </div>
        )}

        {/* Become a Sponsor CTA */}
        <div className="text-center mt-16">
          <div className="glass-card inline-block p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Become a Sponsor</h3>
            <p className="text-white/70 mb-6">
              Partner with us to support the next generation of tech leaders.
            </p>
            <a
              href="/contact"
              className="btn-primary inline-flex items-center"
            >
              Contact Us
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};