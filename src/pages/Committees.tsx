import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Code,
  GraduationCap,
  Search,
  Zap,
  Megaphone,
  Heart,
  Users,
} from "lucide-react";
import { committees } from "@/data/committees";

gsap.registerPlugin(ScrollTrigger);

/* map slug → Lucide icon (kept) */
const iconMap: Record<string, any> = {
  create: Code,
  educate: GraduationCap,
  research: Search,
  hackuta: Zap,
  marketing: Megaphone,
  outreach: Heart,
  community: Users,
};

const Committees = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ───── animations & scroll bar ───── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* hero fade-in */
      gsap.fromTo(
        ".committees-hero",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      /* each committee section slides */
      gsap.utils.toArray(".committee-section").forEach((section, i) => {
        gsap.fromTo(
          section as Element,
          { opacity: 0, x: i % 2 ? 60 : -60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section as Element,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, pageRef);

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      setScrollProgress(Math.min(window.scrollY / max, 1));
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* helper returns inline gradient style */
  const gradStyle = (from: string, to: string) => ({
    backgroundImage: `linear-gradient(to right, ${from}, ${to})`,
  });

  return (
    <div ref={pageRef} className="min-h-screen pt-20 overflow-x-hidden">
      {/* progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-bg-dark/50 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* hero */}
      <section className="committees-hero section-padding">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gradient mb-8">
            Our Committees
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Seven specialized committees working together to create
            opportunities, foster learning, and build an inclusive tech
            community. Each committee brings unique expertise and passionate
            leadership to serve our members.
          </p>
        </div>
      </section>

      {/* committee sections */}
      <div className="">
        {committees.map((c, i) => {
          const Icon = iconMap[c.slug] ?? Code;
          const even = i % 2 === 0;

          return (
            <section
              key={c.id}
              id={c.slug}
              className="committee-section section-padding"
            >
              <div className="container mx-auto px-6">
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                    even ? "" : "lg:grid-flow-col-dense"
                  }`}
                >
                  {/* content */}
                  <div className={even ? "" : "lg:col-start-2"}>
                    <div className="glass-card p-8 lg:p-12">
                      {/* logo + name */}
                      <div className="flex items-center mb-8">
                        <div className="glass-card p-4 mr-6">
                          <Icon
                            className="h-12 w-12"
                            style={{ color: c.color }}
                          />
                        </div>

                        <h2
                          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
                          style={gradStyle(c.gradientFrom, c.gradientTo)}
                        >
                          {c.name}
                        </h2>
                      </div>

                      {/* summary */}
                      <p
                        className="text-xl font-semibold mb-6"
                        style={{ color: c.color }}
                      >
                        {c.summary}
                      </p>

                      {/* description */}
                      <p className="text-white/80 text-lg leading-relaxed mb-6">
                        {c.description}
                      </p>

                      {/* button */}
                      <Link
                        to={`/${c.slug}`}
                        className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white transition hover:scale-105 hover:shadow-xl"
                        style={gradStyle(c.gradientFrom, c.gradientTo)}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </div>
                  </div>

                  {/* banner image */}
                  <div className={even ? "" : "lg:col-start-1"}>
                    <div className="overflow-hidden rounded-2xl group">
                      <div
                        className="aspect-[4/3] bg-center bg-cover"
                        style={{ backgroundImage: `url(${c.banner})` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-6 text-center">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gradient mb-6">
              Ready to Get Involved?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join one of our committees and start making an impact in the tech
              community. Whether you're interested in coding, teaching,
              research, or community building, there's a place for you in ACM UTA.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="https://mavengage.uta.edu/submitter/form/start/623436"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 group"
              >
                Join ACM UTA
              </a>
              <Link to="/contact" className="btn-secondary text-lg px-8 py-4">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Committees;
