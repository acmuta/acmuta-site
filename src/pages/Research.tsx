import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Search, Users, Target, BookOpen, Lightbulb, FlaskConical, FileText, GraduationCap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Research() {
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
      question: "What kind of research opportunities are available?",
      answer: "We offer research opportunities in AI/ML, cybersecurity, data science, software engineering, human-computer interaction, and emerging technologies. Projects are often collaborative."
    },
    {
      question: "Can undergraduates participate in research?",
      answer: "Absolutely! We welcome undergraduate students at all levels. We provide mentorship and resources to help you get started with research, even if you have no prior experience."
    },
    {
      question: "How do I find a research mentor?",
      answer: "Our committee helps connect students with research officers based on research interests. We also facilitate introductions during our regular meetings."
    },
    {
      question: "Are there opportunities to publish research?",
      answer: "Yes! We encourage students to present their work at conferences and submit to journals. We provide guidance on writing papers and presenting research findings."
    },
    {
      question: "What if I'm not sure what I want to research?",
      answer: "No problem! Come talk to an officer and we'll help you explore different areas and find what interests you most."
    }
  ];

  const directors = [
    {
      name: "Mariah Gardner",
      title: "Research Director",
      description: "Mariah leads our research committee, advancing open-source research and cross-disciplinary collaboration. She's completed several NSF-funded projects, reflecting her commitment to fostering cross-disciplinary collaboration."
    },
    {
      name: "Rohita Konjeti",
      title: "Research Co-Director",
      description: "Rohita is dedicated to making research opportunities accessible for women in STEM. She advocates for inclusive research environments and supports students in finding mentorship and resources to succeed in computer science."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding bg-gradient-to-b from-purple-900/20 to-bg-dark">
        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <img 
              src="/assets/committees/Research.png" 
              alt="Research Committee" 
              className="w-full max-w-2xl mx-auto mb-12 rounded-xl shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-purple-500 mb-6">
              Research Committee
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Fosters research skills and offers opportunities for innovative projects and future challenges. 
              Join us in advancing the frontiers of computer science through collaborative research.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-purple-400" />
                <span className="text-white">Academic Research</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-purple-400" />
                <span className="text-white">Innovation Projects</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Target className="h-6 w-6 text-purple-400" />
                <span className="text-white">Research Mentorship</span>
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
                    <p className="text-purple-400 mb-4">{director.title}</p>
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
                  <FlaskConical className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Research Process</h4>
                    <p className="text-white/70 text-sm">Follows the complete research process from topic selection to final presentation, covering topics from AI to HCI</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <FileText className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Paper & Poster Presentations</h4>
                    <p className="text-white/70 text-sm">Students present their research through academic papers or visual posters on diverse CS topics</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <GraduationCap className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">STEMposium</h4>
                    <p className="text-white/70 text-sm">Annual research symposium where students showcase their completed research projects to the community</p>
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

      {/* Join CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-purple-500 mb-6">
              Ready to Start Researching?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join our Research committee and contribute to the advancement of computer science. 
              Collaborate with faculty and peers on cutting-edge research projects.
            </p>
            <a
              href="https://forms.gle/vvu4T9SKP5LnZtgs6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg px-8 py-4 inline-flex items-center group"
            >
              Join Research Committee (Applications Currently Closed)
              <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}