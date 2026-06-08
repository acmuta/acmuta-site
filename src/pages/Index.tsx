import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { NodeField } from "@/components/NodeField";
import { CommitteeLogo } from "@/components/CommitteeLogo";
import { Reveal } from "@/components/Reveal";
import { Ph } from "@/components/Placeholder";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import {
  getStats,
  getCommittees,
  getNews,
  getSponsors,
  type Stat,
  type Committee,
  type NewsItem,
  type Sponsor,
} from "@/lib/api";

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, run: boolean) {
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf: number;
    let start: number | undefined;
    const dur = 1300;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setN(target * ease);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return n;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ s, run }: { s: Stat; run: boolean }) {
  const raw = parseFloat(s.value.replace(/,/g, ""));
  const val = useCountUp(raw, run);
  const fmt = raw >= 1000 ? Math.round(val).toLocaleString() : Math.round(val);
  return (
    <div className="stat">
      <div className="stat-num tnum">
        {s.prefix && <span className="pre">{s.prefix}</span>}
        <span>{fmt}</span>
        {s.suffix && <span className="suf">{s.suffix}</span>}
      </div>
      <div className="stat-label">{s.label}</div>
      <div className="stat-note">{s.note}</div>
    </div>
  );
}

// ─── Stats strip ─────────────────────────────────────────────────────────────

function StatsStrip({ stats }: { stats: Stat[] }) {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { setRun(true); io.disconnect(); }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="stats" ref={ref}>
      <div className="wrap stats-in">
        {stats.map((s, i) => <StatCard key={i} s={s} run={run} />)}
      </div>
    </section>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────

interface HomeData {
  stats: Stat[];
  committees: Committee[];
  news: NewsItem[];
  sponsors: Sponsor[];
}

const Index = () => {
  const [data, setData] = useState<HomeData | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroInRef = useRef<HTMLDivElement>(null);

  // Fetch all home data through the api layer
  useEffect(() => {
    Promise.all([getStats(), getCommittees(), getNews(), getSponsors()]).then(
      ([stats, committees, news, sponsors]) =>
        setData({ stats, committees, news, sponsors })
    );
  }, []);

  // Line-by-line hero headline reveal on mount
  useEffect(() => {
    const t1 = setTimeout(() => heroRef.current?.classList.add("lift"), 60);
    const t2 = setTimeout(
      () => heroRef.current?.classList.add("revealed"),
      1400
    );
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Hero parallax: content drifts up + fades on scroll
  useEffect(() => {
    const el = heroInRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const p = Math.min(y / (window.innerHeight || 800), 1);
        el.style.transform = `translateY(${y * 0.18}px)`;
        el.style.opacity = String(1 - p * 0.9);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  if (!data) return <PageLoading />;
  const { stats, committees, news, sponsors } = data;

  return (
    <div>
      {/* ─────────────────────────── HERO ─────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-grid-lines" />
        <div className="hero-canvas">
          <NodeField density={1} />
        </div>
        <div className="wrap hero-in" ref={heroInRef}>
          <div className="hero-eyebrow">
            <span className="tag mono">
              <span className="node" />
              ACM · UT ARLINGTON
            </span>
            <span className="mono est">[ ASSOCIATION FOR COMPUTING MACHINERY ]</span>
          </div>
          <h1 className="display hero-h1">
            <span className="ln"><span>A home</span></span>
            <span className="ln"><span>for people</span></span>
            <span className="ln">
              <span>
                who <span className="amp">build.</span>
              </span>
            </span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-sub">
              One of the largest tech orgs at UTA.{" "}
              <b>1,700+ students</b>, every major, every skill level, building,
              shipping, and figuring it out together.
            </p>
            <div className="hero-actions">
              <Link to="/apply" className="btn btn-primary">
                Join ACM <Arrow />
              </Link>
              <Link to="/events" className="btn btn-ghost">
                See upcoming events <Arrow />
              </Link>
            </div>
          </div>
        </div>
        <div className="scroll-cue mono">
          <span className="line" />
          <span>SCROLL</span>
        </div>
        <div className="hero-right-meta mono">
          <div>140+ EVENTS / YR</div>
          <div style={{ color: "var(--accent)" }}>HACKUTA · FLAGSHIP</div>
        </div>
      </section>

      {/* ─────────────────────────── STATS ────────────────────────────── */}
      <StatsStrip stats={stats} />

      {/* ─────────────────────────── ABOUT ────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <Reveal className="about">
            <div>
              <span
                className="tag mono"
                style={{ marginBottom: 24, display: "inline-flex" }}
              >
                <span className="node" />
                WHO WE ARE
              </span>
              <p className="about-lead">
                We're a club for <b>building</b>, not just talking about it.{" "}
                <span className="hl">Across every major.</span>
              </p>
            </div>
            <div className="about-body">
              <p>
                ACM at UTA started small and grew into one of the biggest computing
                communities on campus. The point has stayed the same: give students a
                place to actually make things, with people who'll help them figure it
                out.
              </p>
              <p>
                Six committees run the whole thing: from shipping real products to
                reading research papers, running workshops, landing sponsors, and
                throwing the socials that make it stick. You don't need to be a CS
                major. You just need to want to build.
              </p>
              <Link to="/about" className="sec-link">
                Read the full story <Arrow />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────── COMMITTEES ──────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head row">
            <Reveal>
              <span
                className="tag mono"
                style={{ marginBottom: 16, display: "inline-flex" }}
              >
                <span className="node" />
                SIX COMMITTEES
              </span>
              <h2 className="sec-title">
                Pick where <span className="dim">you fit.</span>
              </h2>
            </Reveal>
            <Reveal>
              <Link to="/committees" className="sec-link">
                All committees <Arrow />
              </Link>
            </Reveal>
          </div>
          <Reveal className="cmt-list" stagger gap={55}>
            {committees.map((c, i) => (
              <Link key={c.id} to={`/${c.slug}`} className="cmt-row">
                <div
                  className="cmt-logo ph"
                  data-ph=""
                  title={`${c.name} logo`}
                  style={{ borderRadius: 3 }}
                >
                  <CommitteeLogo committee={c} size={26} />
                </div>
                <div>
                  <div className="cmt-idx mono">
                    {String(i + 1).padStart(2, "0")} / {c.tag}
                  </div>
                  <div className="cmt-name">
                    {c.name}
                    <span
                      className={`cmt-kind mono${c.kind === "application" ? " kind-active" : ""}`}
                    >
                      {c.kind === "application"
                        ? "APPLY"
                        : c.kind === "program"
                        ? "OPEN"
                        : "STAFF"}
                    </span>
                  </div>
                </div>
                <div className="cmt-sum">{c.summary}</div>
                <div className="cmt-go">
                  <Arrow s={22} />
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────── NEWS ────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head row">
            <Reveal>
              <span
                className="tag mono"
                style={{ marginBottom: 16, display: "inline-flex" }}
              >
                <span className="node" />
                LATEST
              </span>
              <h2 className="sec-title">
                What's <span className="dim">happening.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal className="news-grid" stagger gap={50}>
            {news.map((n) => (
              <a
                key={n.id}
                href={n.link}
                className="news-item"
                target={n.link.startsWith("http") ? "_blank" : undefined}
                rel={n.link.startsWith("http") ? "noreferrer" : undefined}
              >
                <div className="news-top mono">
                  <span className="news-tag">{n.tag}</span>
                  <span className="news-date">
                    {new Date(n.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="news-title">{n.title}</div>
                <div className="news-blurb">{n.blurb}</div>
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────── STRIP ────────────────────────────── */}
      <section className="strip">
        <div className="wrap" style={{ marginBottom: 28 }}>
          <span className="tag mono">
            <span className="node" />
            PROOF OF LIFE · 2025–26
          </span>
        </div>
        <div className="strip-track">
          {[
            "Fall Kickoff",
            "Demo Night",
            "HackUTA '25",
            "Workshop",
            "Game Night",
            "Industry Night",
            "Fall Kickoff",
            "Demo Night",
            "HackUTA '25",
            "Workshop",
            "Game Night",
            "Industry Night",
          ].map((label, i) => (
            <Ph key={i} className="strip-item" label={label} />
          ))}
        </div>
      </section>

      {/* ─────────────────────────── SPONSORS ─────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="spon">
            <div>
              <span
                className="tag mono"
                style={{ marginBottom: 18, display: "inline-flex" }}
              >
                <span className="node" />
                BACKED BY
              </span>
              <h2
                className="sec-title"
                style={{
                  fontSize: "clamp(1.9rem,4.5vw,3.2rem)",
                  marginBottom: 22,
                }}
              >
                Companies that
                <br />
                keep it free.
              </h2>
              <p
                style={{
                  color: "var(--text-dim)",
                  maxWidth: "34ch",
                  marginBottom: 26,
                }}
              >
                Sponsorship covers the food, the prizes, and HackUTA, so
                membership never costs a student a dime. $10k+ a year, and
                growing.
              </p>
              <Link to="/contact" className="btn btn-ghost">
                Become a sponsor <Arrow />
              </Link>
            </div>
            <div className="spon-wall">
              {sponsors.map((s, i) => (
                <a key={i} href={s.url} className="spon-cell" title={s.name}>
                  <span className="spon-tier mono">{s.tier}</span>
                  <span className="spon-name">{s.name}</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Index;
