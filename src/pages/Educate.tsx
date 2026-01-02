import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, GraduationCap, Users, Target, BookOpen, Award, Terminal, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Educate() {
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
      question: "What types of educational events does the committee organize?",
      answer: "We organize workshops, tech talks, coding bootcamps, career preparation sessions, interview prep, and skill-building seminars covering various programming languages and technologies."
    },
    {
      question: "Are the workshops suitable for beginners?",
      answer: "Yes! We design workshops for all skill levels, from complete beginners to advanced developers. Each event clearly indicates the target audience and prerequisites."
    },
    {
      question: "Can I suggest a workshop topic?",
      answer: "Absolutely! We welcome suggestions from members about topics they'd like to learn. You can also volunteer to lead a workshop if you have expertise in a particular area."
    },
    {
      question: "How often are educational events held?",
      answer: "We typically hold 1 educational workshop every Tuesday from 12 - 1 PM during the academic year."
    }
  ];

  const directors = [
    {
      name: "Will Maberry ",
      title: "Educate Director",
      description: "Will leads our Educate committee with a passion for hands-on workshops and educational events, by designing engaging learning experiences that help students master programming, tools, and technologies through interactive sessions."
    },
    {
      name: "Zaineel Mithani",
      title: "Educate Director",
      description: "Zaineel leads our Educate committee with a focus on career development and technical interview preparation. With experience in both academia and industry, Zaineel helps students build professional skills, prepare for interviews, and connect with industry mentors."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="section-padding bg-gradient-to-b from-green-900/20 to-bg-dark">
        <div className="container mx-auto px-6">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <img 
              src="/assets/committees/Educate.png" 
              alt="Educate Committee" 
              className="w-full max-w-2xl mx-auto mb-12 rounded-xl shadow-xl"
            />
            <h1 className="text-5xl md:text-6xl font-bold text-green-500 mb-6">
              Educate Committee
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Provides students with valuable skills and opportunities to develop themselves for the workforce. 
              Join us in bridging the gap between academic knowledge and industry requirements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <div className="glass-card p-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-green-500" />
                <span className="text-white">Technical Workshops</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Award className="h-6 w-6 text-green-500" />
                <span className="text-white">Career Development</span>
              </div>
              <div className="glass-card p-4 flex items-center gap-3">
                <Target className="h-6 w-6 text-green-500" />
                <span className="text-white">Interview Prep</span>
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
                    <p className="text-green-500 mb-4">{director.title}</p>
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
                  <Terminal className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Weekly LeetCode</h4>
                    <p className="text-white/70 text-sm">Weekly coding practice sessions to strengthen problem-solving skills and prepare for technical interviews</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Briefcase className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Career Preparation</h4>
                    <p className="text-white/70 text-sm">Provides interview practice and resume reviews to help students land internships and full-time positions</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <BookOpen className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Technical Workshops</h4>
                    <p className="text-white/70 text-sm">Hosts workshops teaching new technologies and skills to expand students' technical knowledge</p>
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <Users className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Mentorship Program</h4>
                    <p className="text-white/70 text-sm">Pairs upperclassmen with underclassmen to provide guidance on internships, classes, and navigating college</p>
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
            <h2 className="text-4xl font-bold text-green-500 mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join ACM Educate's Mentor/Mentee Program, and get paired with an ACM officer or upperclassman to help you navigate at UTA and beyond!
            </p>
            <a
              href="https://forms.gle/vvu4T9SKP5LnZtgs6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg px-8 py-4 inline-flex items-center group"
            >
              Apply to be a Mentee
              <ExternalLink className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}