import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Code, Lightbulb, Wrench, Users, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Create() {
  const heroRef = useRef<HTMLDivElement>(null);

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
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const faqs = [
    {
      question: "What does the Create committee do?",
      answer: "The Create committee focuses on building innovative projects and solutions that benefit both our organization and the broader tech community. We develop web applications, mobile apps, and other software solutions."
    },
    {
      question: "What technologies do you work with?",
      answer: "We work with a wide range of technologies including React, Node.js, Python, mobile development frameworks, cloud services, and emerging technologies based on project needs."
    },
    {
      question: "Do I need experience to join?",
      answer: "No prior experience required! We welcome members of all skill levels and provide mentorship to help you learn and grow your development skills."
    },
    {
      question: "How often does the committee meet?",
      answer: "We meet weekly to work on projects, discuss new ideas, and collaborate on ongoing initiatives. Meeting times are flexible based on member availability."
    },
    {
      question: "Can I propose my own project ideas?",
      answer: "Absolutely! We encourage members to bring their own project ideas and we'll work together to make them happen. Innovation comes from diverse perspectives."
    }
  ];

  const directors = [
    {
      name: "Tobi Akere",
      title: "Create Director",
      description: "Tobi leads our Create committee with expertise in full-stack development and project management. With experience in both startups and large tech companies, Tobi guides the team in building impactful software solutions."
    },
    {
      name: "Ghiya El Daouk El Kadi",
      title: "Create Co-Director", 
      description: "Ghiya brings strong frontend development skills and UI/UX design experience to the team. They focus on ensuring our projects have excellent user experiences and modern, accessible interfaces."
    },
    {
      name: "Prajit Viswanadha",
      title: "Create Co-Director", 
      description: "Prajit brings strong frontend development skills and UI/UX design experience to the team. They focus on ensuring our projects have excellent user experiences and modern, accessible interfaces."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding bg-gradient-to-b from-red-900/20 to-bg-dark">

        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <img 
              src="/assets/committees/Create.png" 
              alt="Create Committee" 
              className="w-full max-w-2xl max-h-2xl mx-auto mb-12 rounded-xl shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-red-500 mb-6">
              Create Committee
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Building innovative software solutions and bringing creative ideas to life. 
              Join us in developing projects that make a real impact.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <Code className="h-6 w-6 text-red-500" />
                <span className="text-white">Full-Stack Development</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-red-500" />
                <span className="text-white">Innovation Projects</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Wrench className="h-6 w-6 text-red-500" />
                <span className="text-white">Technical Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Committee Leadership Section */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Committee Leadership</h2>
              <div className="space-y-6">
                {directors.map((director, index) => (
                  <div key={index} className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{director.name}</h3>
                    <p className="text-red-500 mb-4">{director.title}</p>
                    <p className="text-white/70 leading-relaxed">
                      {director.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-6">What We Do</h3>
              <div className="grid gap-4">
                <div className="glass-card p-4 flex items-start gap-3">
                  <Code className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Project Development</h4>
                    <p className="text-white/70 text-sm">Develops beginner and advanced software projects under project managers through weekly townhalls, with projects ranging from one semester to a full school year</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Real-World Applications</h4>
                    <p className="text-white/70 text-sm">Builds real-world applications used by UTA students, providing hands-on experience with collaborative development and project management</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Award className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Showcase Night</h4>
                    <p className="text-white/70 text-sm">Showcases completed projects at end-of-semester events featuring awards, gifts, and recognition for team contributions</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-white/70 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="section-padding bg-dark">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-red-500 mb-6">
              Ready to Create?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join our Create committee and help build the next generation of innovative software solutions. 
              Let's turn your ideas into reality!
            </p>
            <a
              href="https://forms.gle/vvu4T9SKP5LnZtgs6"
              target="_blank"
              rel="noopener noreferrer"
              className=" text-lg px-8 py-4 inline-flex items-center group"
            >
              Join Create Committee (Applications Closed)
              <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}