import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Code, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(logoRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    )
    .fromTo(buttonsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    )
    .fromTo(statsRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.1"
    );

    return () => {
      tl.kill();
    };

    gsap.to(logoRef.current, {
    y: 100,
    opacity: 0.3,
    scale: 0.8,
    scrollTrigger: {
      trigger: heroRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
    }
  );



  }, []);

  const stats = [
    { icon: Users, label: 'Active Members', value: '1,600+' },
    { icon: Code, label: 'Students Reached', value: '25,000+' },
    { icon: Zap, label: 'Events Per Year', value: '100+' },
  ];

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden "
    >
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto mt-8">
          {/* Logo */}
          <img
            ref={logoRef}
            src="/assets/logo/acm-logo.png"
            alt="ACM UTA Logo"
            className="h-60 w-60 mx-auto"
          />

          {/* Title */}
          <h1 ref={titleRef} className="hero-text text-white mb-2">
            ASSOCIATION FOR COMPUTING MACHINERY
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed">
            The premier student computing organization at the{' '}
            <span className="text-accent font-semibold">University of Texas at Arlington</span>.
            <br />
            Fostering innovation, education, and community in computer science.
          </p>

          {/* CTA Buttons */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a
              href="https://mavengage.uta.edu/submitter/form/start/623436"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg px-6 py-3 inline-flex items-center group"
            >
              Join ACM
            </a>
            <Link to="/about" className="btn-secondary text-lg px-6 py-3 inline-flex items-center">
              About Us
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <stat.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};