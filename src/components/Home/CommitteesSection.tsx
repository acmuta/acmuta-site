import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function chunkArray(array, size) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export const CommitteesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.committee-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.committees-container',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const committees = [
    { name: 'HackUTA', image: '/assets/logo/hackuta.png', description: "UTA's official student hackathon", link: '/hackuta' },
    { name: 'Marketing', image: '/assets/logo/marketing.png', description: "Drive ACM's brand and social strategy", link: '/marketing' },
    { name: 'Outreach', image: '/assets/logo/outreach.png', description: 'Connect with schools and communities', link: '/outreach' },
    { name: 'Community', image: '/assets/logo/community.png', description: 'Build welcoming culture through events', link: '/community' },
    { name: 'Create', image: '/assets/logo/create.png', description: 'Build skills through hands-on projects', link: '/create' },
    { name: 'Educate', image: '/assets/logo/educate.png', description: 'Develop valuable skills for the workforce', link: '/educate' },
    { name: 'Research', image: '/assets/logo/research.png', description: 'Foster research skills and innovation', link: '/research' },
  ];

  const committeeRows = chunkArray(committees, 4);

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Our Committees
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Seven specialized committees working together to create opportunities, 
            foster learning, and build an inclusive tech community.
          </p>
        </div>

        <div className="committees-container flex flex-col gap-6 mb-12">
          {committeeRows.map((row, idx) => (
            <div
              key={idx}
              className="
                flex flex-col
                sm:flex-row
                justify-center
                gap-6
              "
            >
              {row.map((committee) => (
                <Link 
                  key={committee.name} 
                  to={committee.link}
                  className="committee-card group flex-1 max-w-xs sm:max-w-sm md:max-w-none"
                >
                  <div className="mb-4">
                    <img
                      src={committee.image}
                      alt={`${committee.name} logo`}
                      className="h-12 w-auto mx-auto group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{committee.name}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {committee.description}
                  </p>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/committees" 
            className="btn-primary text-lg px-8 py-4 inline-flex items-center group"
          >
            Learn More About Our Committees
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
