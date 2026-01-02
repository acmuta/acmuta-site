import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Award, Target, Zap, Code, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(".about-hero",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        }
      );

      // Section animations
      const sections = gsap.utils.toArray('.about-section');
      sections.forEach((section, index) => {
        gsap.fromTo(section as Element,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section as Element,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );
      });

      const statElements = gsap.utils.toArray('.stat-number');
      statElements.forEach((element) => {
        const el = element as HTMLElement;
        const targetValue = el.getAttribute('data-value') || '0';
        const numericValue = parseInt(targetValue.replace(/[^0-9]/g, ''));
        const hasPlus = targetValue.includes('+');
        const hasComma = targetValue.includes(',');

        gsap.fromTo(el,
          { innerText: 0 },
          {
            innerText: numericValue,
            duration: 2,
            ease: "power1.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse"
            },
            snap: { innerText: 1 },
            onUpdate: function() {
              const currentValue = Math.ceil(this.targets()[0].innerText);
              let formattedValue = currentValue.toString();
              
              if (hasComma && currentValue >= 1000) {
                formattedValue = currentValue.toLocaleString();
              }
              
              if (hasPlus) {
                formattedValue += '+';
              }
              
              el.innerText = formattedValue;
            }
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: Users, label: 'Active Members', value: '1,600+', description: 'Students across all majors' },
    { icon: Code, label: 'Officers', value: '50+', description: 'Enrolled this year' },
    { icon: Award, label: 'Students', value: '25,000+', description: 'Reached' },
    { icon: Zap, label: 'Events', value: '100+', description: 'Hosted annually' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'We foster creativity and push the boundaries of technology through hands-on projects and research opportunities.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building lasting connections and mentorship opportunities that extend beyond graduation into successful tech careers.'
    },
    {
      icon: Code,
      title: 'Excellence',
      description: 'Maintaining high standards in everything we do, from our events to our projects, ensuring quality learning experiences.'
    },
    {
      icon: Heart,
      title: 'Inclusivity',
      description: 'Creating a welcoming environment where students from all backgrounds can thrive and contribute to the tech community.'
    }
  ];

  return (
    <div ref={pageRef} className="min-h-screen pt-20">
      <section className="about-hero section-padding">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-8">
            About ACM @ UTA
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            We are the Association for Computing Machinery chapter at the University of Texas at Arlington, 
            dedicated to advancing computing as a science and profession. Our mission is to foster innovation, 
            education, and community within the field of computer science and technology.
          </p>
        </div>
      </section>

      <section className="about-section section-padding">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                To advance computing as a science and profession by providing students with 
                opportunities to develop technical skills, engage in research, build professional 
                networks, and contribute to the broader computing community.
              </p>
              <p className="text-white/70">
                We believe in the power of collaboration, continuous learning, and giving back 
                to our community through education and outreach programs.
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                To be the leading student organization that bridges academic learning with 
                industry practice, creating the next generation of computing professionals 
                who are technically proficient, ethically grounded, and globally minded.
              </p>
              <p className="text-white/70">
                We envision a future where our members become leaders in technology, 
                driving innovation and positive change in their communities and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="about-section section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              These numbers represent the growth and success of our community over the years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-8 text-center group hover:scale-105 transition-transform duration-300">
                <div className="glass-card p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <stat.icon className="h-8 w-8 text-accent" />
                </div>
                <div 
                  className="stat-number text-4xl font-bold text-white mb-2" 
                  data-value={stat.value}
                >
                  0
                </div>
                <div className="text-lg font-semibold text-accent mb-2">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-section section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              These principles guide everything we do and shape the culture of our organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="glass-card p-8 group hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-start space-x-6">
                  <div className="glass-card p-4 flex-shrink-0">
                    <value.icon className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-white/80 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="about-section section-padding">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From humble beginnings to becoming UTA's premier computing organization.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-12">
              <div className="space-y-12">
                <div className="text-center">
                  <div className="inline-block glass-card p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Chapter Founded</h3>
                    <p className="text-white/80">
                      ACM UTA was established to serve the growing computer science community 
                      at the University of Texas at Arlington, providing students with opportunities 
                      to connect, learn, and grow together.
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-block glass-card p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Growing Strong</h3>
                    <p className="text-white/80">
                      Today, we continue to expand our impact through innovative programs, 
                      industry partnerships, and a commitment to excellence in everything we do.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
