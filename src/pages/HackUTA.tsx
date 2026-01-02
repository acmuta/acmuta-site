import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Calendar, Trophy, Users, Zap, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HackUTA() {
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
      question: "What is HackUTA?",
      answer: "HackUTA is UTA's premier student hackathon, bringing together hundpinks of students for 24 hours of innovation, coding, and creativity with amazing prizes and industry sponsors."
    },
    {
      question: "Who can participate in HackUTA?",
      answer: "All university students are welcome! Whether you're a beginner or experienced developer, HackUTA is designed for all skill levels with mentors available to help."
    },
    {
      question: "What should I bring?",
      answer: "Bring your laptop, chargers, and any hardware you want to use. We'll provide meals, snacks, and swag throughout the event."
    },
    {
      question: "How do I register?",
      answer: "Registration opens several months before the event. Follow our social media and join our mailing list to be notified when applications go live."
    },
    {
      question: "Are there prizes?",
      answer: "Yes! We offer thousands of dollars in prizes across multiple categoriesand sponsor-specific challenges."
    }
  ];

  const directors = [
    {
      name: "Tanmayee Siddineni",
      title: "HackUTA Director",
      description: "Tanmayee leads our HackUTA committee by managing hackathon logistics, coordinating schedules, and ensuring smooth event operations from start to finish."
    },
    {
      name: "Dominic Lamanna",
      title: "HackUTA Director", 
      description: "Dominic assists with planning participant engagement, organizing event communications, and enhancing the overall hackathon experience for attendees."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding bg-gradient-to-b from-pink-900/20 to-bg-dark">
        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <img 
              src="/assets/committees/HackUTA.JPG"               
              alt="HackUTA Team" 
              className="w-full max-w-2xl mx-auto mb-12 rounded-xl shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-pink-400 mb-6">
              HackUTA
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Home of UTA's official student hackathon returning this October. 
              Join us for 24 hours of innovation, creativity, and amazing prizes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <Calendar className="h-6 w-6 text-pink-400" />
                <span className="text-white">October 2025</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Users className="h-6 w-6 text-pink-400" />
                <span className="text-white">500+ Participants</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Trophy className="h-6 w-6 text-pink-400" />
                <span className="text-white">$5,000+ in Prizes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Committee Director Section */}
      <section className="section-padding bg-gradient-to-b from-bg-dark to-pink-900/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Committee Leadership</h2>
              <div className="space-y-6">
                {directors.map((director, index) => (
                  <div key={index} className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{director.name}</h3>
                    <p className="text-pink-500 mb-4">{director.title}</p>
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
                  <Calendar className="h-6 w-6 text-pink-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Event Planning</h4>
                    <p className="text-white/70 text-sm">Organizes the entire hackathon from venue logistics to securing sponsors and coordinating all aspects of the event</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Heart className="h-6 w-6 text-pink-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Participant Experience</h4>
                    <p className="text-white/70 text-sm">Ensures an amazing experience for hackers of all skill levels through workshops, mentorship, and support</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Trophy className="h-6 w-6 text-pink-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Prizes & Challenges</h4>
                    <p className="text-white/70 text-sm">Coordinates with sponsors to offer exciting prizes and challenge tracks for participants to compete in</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-b from-pink-900/10 to-bg-dark">
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