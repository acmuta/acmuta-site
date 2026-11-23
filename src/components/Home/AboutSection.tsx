import { useRef } from 'react';
import { Award, Users, Code2, Lightbulb } from 'lucide-react';


// Matches .about-card: 2 columns inside Tailwind's container (1280/1536px)
const IMG_SIZES = "(min-width: 1536px) 720px, (min-width: 1024px) 46vw, 100vw";

export const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const aboutItems = [
    {
      icon: Award,
      title: "What is ACM?",
      content: "The Association for Computing Machinery (ACM) is the world's largest educational and scientific computing society. At UTA, we bring this global mission to our local community, creating opportunities for students to grow, learn, and connect.",
      image: "/assets/homepage/lookdown-1280.webp",
      srcSet: "/assets/homepage/lookdown-640.webp 640w, /assets/homepage/lookdown-1280.webp 1280w",
      alt: "ACM members seen from above at a meeting"
    },
    {
      icon: Users,
      title: "Our Community",
      content: "We are a diverse group of students passionate about technology, innovation, and making a difference. From computer science majors to students from all disciplines interested in tech, everyone is welcome in our community.",
      image: "/assets/homepage/acm_stem-1280.webp",
      srcSet: "/assets/homepage/acm_stem-640.webp 640w, /assets/homepage/acm_stem-1280.webp 1280w",
      alt: "ACM members gathered at a STEM event"
    },
    {
      icon: Code2,
      title: "What We Do",
      content: "Through workshops, hackathons, research projects, and social events, we provide hands-on learning experiences that complement classroom education. We bridge the gap between academic learning and industry practice.",
      image: "/assets/homepage/hackuta-1280.webp",
      srcSet: "/assets/homepage/hackuta-640.webp 640w, /assets/homepage/hackuta-1280.webp 1280w",
      alt: "Students hacking together at HackUTA"
    },
    {
      icon: Lightbulb,
      title: "Our Impact",
      content: "Our members go on to work at top tech companies, pursue graduate research, and start their own ventures. We're proud to be launching pad for the next generation of technology leaders.",
      image: "/assets/homepage/nokia-1280.webp",
      srcSet: "/assets/homepage/nokia-640.webp 640w, /assets/homepage/nokia-1280.webp 1280w",
      alt: "Members at a Nokia industry event"
    }
  ];

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            About ACM @ UTA
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Empowering the next generation of computing professionals through innovation, 
            education, and community building at the University of Texas at Arlington.
          </p>
        </div>

        <div className="space-y-24">
          {aboutItems.map((item, index) => (
            <div 
              key={index} 
              className={`about-card grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>

              <div className="group relative bg-white/[0.02] border-l-4 border-accent/50 p-8 
                              rounded-r-2xl
                              transition-all duration-500 hover:bg-white/[0.04] hover:border-accent">
                <div className="flex items-center mb-6">
                  <div className="bg-accent/10 border border-accent/30 p-4 mr-4 
                                  rounded-r-lg
                                  group-hover:bg-accent/20 group-hover:scale-110 
                                  transition-all duration-300">
                    <item.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-white/70 text-lg leading-relaxed">
                  {item.content}
                </p>
                
                {/* Bottom accent line - always visible, expands on hover */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent 
                                group-hover:w-full transition-all duration-500" />
              </div>
            </div>

              {/* Image */}
              <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                <div className="relative group">
                  <div className={`glass-card overflow-hidden rounded-2xl transform group-hover:rotate-0 transition-transform duration-500`}>
                    <img
                      src={item.image}
                      srcSet={item.srcSet}
                      sizes={IMG_SIZES}
                      alt={item.alt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-5" />
                  </div>
                  <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};