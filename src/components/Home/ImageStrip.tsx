import { useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Eye } from 'lucide-react';
import { gallery } from '@/data/gallery';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGES: string[] = [];

export const ImageStrip = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.strip-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: '.strip-header',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const strip = stripRef.current;
      if (strip) {
        gsap.set(strip, { x: 0 });
        gsap.to(strip, {
          x: '-50%',
          duration: 30,
          ease: 'none',
          repeat: -1,
          repeatDelay: 0,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const trackImages = useMemo(() => {
    const imgs = Array.isArray(FALLBACK_IMAGES) ? FALLBACK_IMAGES : [];
    return imgs.slice(0, 24);
  }, []);

  const hasImages = trackImages.length > 0;

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container mx-auto px-6">
        <div className="strip-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Our Moments
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Capturing the energy, innovation, and community spirit that defines ACM UTA.
            From hackathons to workshops, these moments tell our story.
          </p>
        </div>

        <div className="relative mb-12">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-dark to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-dark to-transparent z-10" />

          <div className="overflow-hidden">
            {hasImages ? (
              <div ref={stripRef} className="flex space-x-6" style={{ width: 'max-content' }}>
                {[...trackImages, ...trackImages].map((src, index) => (
                  <div
                    key={`${index}-${src}`}
                    className="flex-shrink-0 w-96 h-72 glass-card overflow-hidden group hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      className="w-full h-full bg-gradient-to-br from-primary to-accent relative"
                      style={{
                        backgroundImage: `url(${src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="glass-card p-2">
                          <Eye className="h-4 w-4 text-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-white/70">
                Photo highlights coming soon. Check out the full gallery below.
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">{gallery.length}+</div>
            <div className="text-white/70">Photo Albums</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">Many</div>
            <div className="text-white/70">Photos Captured</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-white/70">Events Documented</div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/gallery" className="btn-primary text-lg px-8 py-4 inline-flex items-center group">
            View All Photos
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
