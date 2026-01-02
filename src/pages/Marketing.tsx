import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Camera, Megaphone, TrendingUp, Instagram, Users, Video } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Marketing() {
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
      question: "What does the Marketing committee do?",
      answer: "We handle all visual design, social media presence, promotional materials, and brand strategy. We create engaging content that showcases ACM's activities and attracts new members."
    },
    {
      question: "Do I need design experience to join?",
      answer: "Not at all! We welcome members with all skill levels. We provide training and mentorship to help you develop design and marketing skills."
    },
    {
      question: "What tools do you use?",
      answer: "We use Adobe Creative Suite (Photoshop, Illustrator, InDesign), Canva, Figma, and various social media management tools. We'll help you learn these tools!"
    },
    {
      question: "How often does the team meet?",
      answer: "We meet weekly to plan campaigns, review designs, and coordinate social media content. Additional meetings are scheduled around major events and campaigns."
    },
    {
      question: "Can I focus on social media instead of design?",
      answer: "Absolutely! Our committee has roles for content creators, social media managers, photographers, graphic designers, and brand strategists."
    }
  ];

  const directors = [
    {
      name: "Salima Salman",
      title: "Marketing Director",
      description: "Salima leads our marketing committee, driving brand strategy and creative content. She has a passion for design and storytelling, helping ACM connect with the community through engaging visuals and campaigns."
    },
        {
      name: "Felix Cherian",
      title: "Marketing Director",
      description: "Felix leads our marketing committee, driving brand strategy and creative content. He has a passion for design and storytelling, helping ACM connect with the community through engaging visuals and campaigns."
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding bg-gradient-to-b from-orange-900/20 to-bg-dark">
        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <img 
              src="/assets/committees/Marketing.png" 
              alt="Marketing Committee" 
              className="w-full max-w-2xl mx-auto mb-12 rounded-xl shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-orange-400 mb-6">
              Marketing
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Drive ACM's brand through design, content, and social strategy. 
              We create engaging content that showcases our activities and builds our community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <Instagram className="h-6 w-6 text-orange-400" />
                <span className="text-white">1,800+ Followers</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Camera className="h-6 w-6 text-orange-400" />
                <span className="text-white">100+ Events Covered</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Palette className="h-6 w-6 text-orange-400" />
                <span className="text-white">50+ Designs Created</span>
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
                    <p className="text-orange-400 mb-4">{director.title}</p>
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
                  <Palette className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Creative Design</h4>
                    <p className="text-white/70 text-sm">Creates graphics and visual content for all ACM events and announcements</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Video className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Social Media Content</h4>
                    <p className="text-white/70 text-sm">Produces reels and trending content to maximize engagement and reach across social platforms</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Event Promotion</h4>
                    <p className="text-white/70 text-sm">Ensures every ACM event receives attention through strategic promotion and trend-following</p>
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