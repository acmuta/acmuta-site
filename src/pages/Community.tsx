import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Coffee, Gamepad2, Heart, Calendar, Star, Building2, DollarSign, Handshake, PartyPopper, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Community() {
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
      question: "What types of social events do you organize?",
      answer: "We run game nights, study jams, socials, speaker mixers, hackathon socials, and cross-club collaborative events that bring members together in fun and meaningful ways."
    },
    {
      question: "How can I propose a collaboration with another club or sponsor?",
      answer: "Contact our Community leadership with your idea. We regularly partner with other student orgs and sponsors to co-host events, panels, and socials."
    },
    {
      question: "Are events open to all ACM members?",
      answer: "Absolutely! All our events are open to ACM members. Some events may have limited capacity, so we encourage early registration when required."
    },
    {
      question: "How do I stay informed about upcoming socials?",
      answer: "Follow ACM on social media, check the events calendar on the website, and join our Discord server for real-time announcements and RSVPs."
    },
    {
      question: "Can I help organize events?",
      answer: "Yes! We welcome volunteers for event planning and execution. Join our committee to help create memorable experiences for our ACM community."
    }
  ];

  const directors = [
    {
      name: "Yoselin Ventura",
      title: "Community Director",
      description: "Yoselin organizes social programming and partnerships — from game nights to cross-club mixers. She focuses on increasing member engagement and creating inclusive events where students can network, relax, and grow."
    },
    {
      name: "Kimiya Ceballos",
      title: "Community Director",
      description: "Kimiya organizes social programming and partnerships — from game nights to cross-club mixers. She focuses on increasing member engagement and creating inclusive events where students can network, relax, and grow."
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding bg-gradient-to-b from-blue-500/10 to-bg-dark">
        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <img 
              src="/assets/committees/Community.png"               
              alt="Community Team" 
              className="w-full max-w-2xl mx-auto mb-12 rounded-xl shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-blue-500 mb-6">
              Community
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Build a welcoming culture via socials, game nights, and peer mentoring. 
              We ensure every member feels valued and connected in our ACM family.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-400" />
                <span className="text-white">Monthly Events</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="text-white">200+ Event Attendees</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Star className="h-6 w-6 text-blue-400" />
                <span className="text-white">95% Satisfaction Rate</span>
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
                    <p className="text-blue-500 mb-4">{director.title}</p>
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
                  <PartyPopper className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Social Events</h4>
                    <p className="text-white/70 text-sm">Hosts large-scale events like Squid Games and Performative Male Contest for member engagement</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Users className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Organization Collaborations</h4>
                    <p className="text-white/70 text-sm">Partners with other student organizations to host collaborative events and expand community reach</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Globe className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Hybrid Gatherings</h4>
                    <p className="text-white/70 text-sm">Organizes both in-person and online events to ensure all members can socialize and connect</p>
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