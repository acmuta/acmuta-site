import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { NodeField } from "@/components/NodeField";
import { Ph } from "@/components/Placeholder";
import { Arrow } from "@/components/icons";
import { getHackUTAConfig, type HackUTAConfig } from "@/lib/api";
import { PageLoading } from "@/components/Loading";

const STATS = [
  { n: "500", s: "+", l: "hackers" },
  { n: "24", s: "hr", l: "of building" },
  { n: "40", s: "+", l: "mentors" },
  { n: "15", s: "k", l: "in prizes" },
];

const STRIP_LABELS = [
  "Opening", "Workshops", "Mentors", "Late night", "Demos", "Winners",
  "Opening", "Workshops", "Mentors", "Late night", "Demos", "Winners",
];

const STRIP_IMAGES = [
  "/assets/events/hackuta2025.jpg",
  "/assets/homepage/hackuta.jpeg",
  "/assets/homepage/hackathon.JPG",
];

function HackUTAEnabled({ cfg }: { cfg: HackUTAConfig }) {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="hk-hero">
        <div className="hk-canvas">
          <NodeField density={0.7} />
        </div>
        <div className="wrap hk-in">
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 22, display: "inline-flex" }}>
              <span className="node" />
              ACM'S FLAGSHIP HACKATHON
            </span>
            <h1 className="hk-title display">
              Hack<span className="yr">UTA</span>
            </h1>
            <div className="hk-row">
              <span className="hk-date">{cfg.dateDisplay}</span>
              <span className="mono" style={{ color: "var(--text-faint)" }}>
                {cfg.location}
              </span>
              {cfg.appsOpen && cfg.appsUrl ? (
                <a href={cfg.appsUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Apply now <Arrow />
                </a>
              ) : cfg.appsOpen ? (
                <Link to="/apply" className="btn btn-primary">
                  Apply now <Arrow />
                </Link>
              ) : (
                <Link to="/contact" className="btn btn-primary">
                  Register interest <Arrow />
                </Link>
              )}
            </div>
            {!cfg.appsOpen && (
              <p className="mono" style={{ color: "var(--text-faint)", fontSize: "0.8rem", marginTop: 14 }}>
                Applications not yet open for HackUTA {cfg.year}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── What it is ── */}
      <section className="section">
        <div className="wrap">
          <div className="about">
            <Reveal>
              <span className="tag mono" style={{ marginBottom: 18, display: "inline-flex" }}>
                <span className="node" />
                WHAT IT IS
              </span>
              <p className="about-lead">
                24 hours. <span className="hl">Zero sleep.</span> One idea you
                actually finish.
              </p>
            </Reveal>
            <Reveal className="about-body">
              <p>
                HackUTA is the biggest thing ACM throws all year, an open,
                beginner-friendly hackathon where 500+ students show up to build
                something in a weekend. Workshops, mentors, free food, and prizes.
              </p>
              <p>
                You don't need a team or an idea to start. Most people don't. Come
                with a laptop and curiosity, leave with a project, new friends, and
                a story.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 22, display: "inline-flex" }}>
              <span className="node" />
              HACKUTA {cfg.year - 1}, BY THE NUMBERS
            </span>
          </Reveal>
          <Reveal className="hk-stats" stagger gap={60}>
            {STATS.map((s, i) => (
              <div className="hk-stat" key={i}>
                <div className="n tnum">
                  {s.n}
                  <span className="suf">{s.s}</span>
                </div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Photo strip ── */}
      <section className="strip" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ marginBottom: 28 }}>
          <span className="tag mono">
            <span className="node" />
            FROM LAST YEAR
          </span>
        </div>
        <div className="strip-track">
          {STRIP_LABELS.map((label, i) => (
            <Ph
              key={i}
              className="strip-item"
              label={`HackUTA · ${label}`}
              src={STRIP_IMAGES[i % STRIP_IMAGES.length]}
              alt={`HackUTA ${label}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function HackUTADisabled() {
  return (
    <div>
      <section className="hk-hero">
        <div className="hk-canvas">
          <NodeField density={0.4} />
        </div>
        <div className="wrap hk-in">
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 22, display: "inline-flex" }}>
              <span className="node" />
              ACM'S FLAGSHIP HACKATHON
            </span>
            <h1 className="hk-title display">
              Hack<span className="yr">UTA</span>
            </h1>
            <div className="hk-row">
              <span className="hk-date" style={{ color: "var(--text-faint)" }}>COMING SOON</span>
            </div>
            <p className="mono" style={{ color: "var(--text-faint)", fontSize: "0.85rem", marginTop: 18 }}>
              Applications not yet open for the next HackUTA.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="about">
            <Reveal>
              <span className="tag mono" style={{ marginBottom: 18, display: "inline-flex" }}>
                <span className="node" />
                WHAT IS HACKUTA?
              </span>
              <p className="about-lead">
                ACM's annual <span className="hl">24-hour hackathon.</span>
              </p>
            </Reveal>
            <Reveal className="about-body">
              <p>
                HackUTA is the biggest event ACM throws all year, an open,
                beginner-friendly hackathon where hundreds of students build,
                ship, and compete in a single weekend. Workshops, mentors, free
                food, and prizes.
              </p>
              <p>
                Dates for the next HackUTA haven't been announced yet. Follow us
                on Instagram or join our Discord to be the first to know when
                applications open.
              </p>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: 8 }}>
                Stay in the loop <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

const HackUTA = () => {
  const [cfg, setCfg] = useState<HackUTAConfig | null>(null);

  useEffect(() => {
    getHackUTAConfig().then(setCfg);
  }, []);

  if (!cfg) return <PageLoading />;

  return cfg.enabled ? <HackUTAEnabled cfg={cfg} /> : <HackUTADisabled />;
};

export default HackUTA;
