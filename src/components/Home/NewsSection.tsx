import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Calendar, ExternalLink } from "lucide-react";
import { news } from "@/data/news";

gsap.registerPlugin(ScrollTrigger);

export const NewsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const [page, setPage] = useState(0); 

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".news-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: ".news-header",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".news-carousel",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".news-carousel",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const start = page * itemsPerPage;
  const currentNews = news.slice(start, start + itemsPerPage);

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container mx-auto px-6">
        <div className="news-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Latest News
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Stay updated with the latest happenings, events, and achievements
            from the ACM UTA community.
          </p>
        </div>

        {totalPages > 1 && (
          <div className="hidden sm:flex justify-center items-center mb-8 gap-4">
            <button
              aria-label="Previous"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="glass-card p-3 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ChevronLeft className="h-6 w-6 text-white group-hover:text-accent" />
            </button>

            <span className="text-white/70 text-sm">
              Page {page + 1} / {totalPages}
            </span>

            <button
              aria-label="Next"
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 === totalPages}
              className="glass-card p-3 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <ChevronRight className="h-6 w-6 text-white group-hover:text-accent" />
            </button>
          </div>
        )}

        <div className="news-carousel grid grid-cols-1 sm:grid-cols-3 gap-8">
          {currentNews.map((item) => (
            <article key={item.id} className="glass-card overflow-hidden">
              <div
                className="aspect-[16/10] bg-gradient-to-br from-primary to-accent relative"
                style={{
                  backgroundImage: `url(${item.cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-center text-accent text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {item.title}
                </h3>

                {item.excerpt && (
                  <p className="text-white/70 text-sm line-clamp-3">
                    {item.excerpt}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {currentNews.length === 0 && (
          <div className="text-center py-16">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-white/70 text-lg">No news found.</p>
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <div className="glass-card inline-block p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-6">
              Join our mailing list to receive the latest news and event
              announcements.
            </p>
            <a
              href="https://forms.gle/vvu4T9SKP5LnZtgs6"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center"
            >
              Join Our Mailing List
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
