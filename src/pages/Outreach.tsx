import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, School, Users, Globe, BookOpen, Handshake, DollarSign, Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Outreach() {
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
      question: "What types of companies do you partner with?",
      answer: "We work with startups, SMEs, and large enterprises across software, hardware, AI, cloud, and cybersecurity, both locally in DFW and nationally."
    },
    {
      question: "How can a company sponsor or partner with ACM?",
      answer: "Companies can contact our outreach leadership or use the contact form to inquire about sponsorship tiers, workshop partnerships, recruiting events, and mentorship programs."
    },
    {
      question: "What can companies gain from partnering with ACM?",
      answer: "Partners get direct access to student talent, branding at major events, opportunities to run technical sessions, and easier recruiting for internships and entry-level roles."
    },
    {
      question: "How do students engage with industry partners?",
      answer: "Students can join company-led workshops, participate in mentorship programs, apply for internships, and attend career panels and demo days organized with partners."
    },
    {
      question: "How often do you run partnership events?",
      answer: "We typically host multiple industry events each semester, including tech talks, employer panels, and collaborative workshops with partner organizations."
    }
  ];

  const directors = [
    {
      name: "Paul Santana",
      title: "Outreach Director",
      description: "Paul leads outreach efforts focused on securing sponsorships and building industry partnerships. He works with companies to create workshops, panels, and funding opportunities that benefit ACM members."
    },
    {
      name: "Vincent Dang",
      title: "Outreach Director", 
      description: "Vincent focuses on industry collaboration and event coordination, helping to design company-led workshops and recruiting events that showcase student talent and strengthen employer relationships."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding bg-gradient-to-b from-yellow-900/20 to-bg-dark">
        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <img 
              src="/assets/committees/Outreach.png" 
              alt="Outreach Committee"
              className="w-full max-w-2xl mx-auto mb-12 rounded-xl shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-6">
              Outreach
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Connect ACM with companies and industry partners to build sponsorships, collaborative events, and internship pathways. We help students gain real-world experience and create opportunities that connect industry with campus talent.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <School className="h-6 w-6 text-yellow-400" />
                <span className="text-white">10+ Companies Collaborated</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Users className="h-6 w-6 text-yellow-400" />
                <span className="text-white">$10,000+ Secured in Funding</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Committee Director Section */}
      <section className="section-padding">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Committee Leadership</h2>
              <div className="space-y-6">
                {directors.map((director, index) => (
                  <div key={index} className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{director.name}</h3>
                    <p className="text-yellow-500 mb-4">{director.title}</p>
                    <p className="text-white/70 leading-relaxed">
                      {director.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">What We Do</h3>
              <div className="grid gap-4">
                <div className="glass-card p-4 flex items-start gap-3">
                  <Building2 className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Company Relations</h4>
                    <p className="text-white/70 text-sm">Reaches out to companies to secure speaker talks and organize company tours for students</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <DollarSign className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Funding & Sponsorships</h4>
                    <p className="text-white/70 text-sm">Secures funding and sponsorships to support ACM events and initiatives throughout the year</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Handshake className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">External Affairs</h4>
                    <p className="text-white/70 text-sm">Manages all external partnerships and handles communication with industry professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
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
    </div>
  );
}