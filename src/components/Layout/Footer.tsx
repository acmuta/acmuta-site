import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Arrow } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );
  useEffect(() => {
    const handler = () =>
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);
  return theme;
}

function AcmMark({ size = 26 }: { size?: number }) {
  const theme = useTheme();
  const logo = theme === "dark"
    ? "/assets/logo/acmlogo-white.png"
    : "/assets/logo/acmlogo-black.png";
  return (
    <Link to="/" className="acm-mark" aria-label="ACM at UTA home">
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
        aria-hidden="true"
      />
      <span className="acm-word">
        ACM<span style={{ color: "var(--text-faint)" }}>·</span>UTA
      </span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <Reveal className="ftr-cta">
          <span className="tag mono">
            <span className="node" />
            OPEN TO ALL MAJORS · ALL SKILL LEVELS
          </span>
          <h2 className="display ftr-head">
            Come build<br />something.
          </h2>
          <div className="ftr-actions">
            <Link to="/apply" className="btn btn-primary">
              Join ACM <Arrow />
            </Link>
            <Link to="/events" className="btn btn-ghost">
              See upcoming events <Arrow />
            </Link>
          </div>
        </Reveal>

        <hr className="hr" style={{ margin: "0" }} />

        <div className="ftr-grid">
          <div className="ftr-brand">
            <AcmMark size={26} />
            <p className="ftr-blurb">
              A home for students across every major who want to build, learn, and grow in
              computing. Workshops, projects, research, hackathons, and the people who make it
              worth showing up.
            </p>
          </div>
          <div className="ftr-col">
            <span className="mono ftr-h">Explore</span>
            <Link to="/committees">Committees</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/hackuta">HackUTA</Link>
            <Link to="/events">Events</Link>
          </div>
          <div className="ftr-col">
            <span className="mono ftr-h">Org</span>
            <Link to="/about">About</Link>
            <Link to="/officers">Officers</Link>
            <Link to="/apply">Apply</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="ftr-col">
            <span className="mono ftr-h">Connect</span>
            <a href="https://discord.gg/yXggXURBVQ" target="_blank" rel="noreferrer">
              Discord <Arrow s={12} />
            </a>
            <a href="https://instagram.com/acmuta" target="_blank" rel="noreferrer">
              Instagram <Arrow s={12} />
            </a>
            <a href="https://github.com/acmuta" target="_blank" rel="noreferrer">
              GitHub <Arrow s={12} />
            </a>
            <a href="mailto:acm.uta@gmail.com">
              Email <Arrow s={12} />
            </a>
          </div>
        </div>

        <div className="ftr-base mono">
          <span>© {new Date().getFullYear()} ACM AT UTA</span>
          <span>BUILT BY MEMBERS, WITH LOVE · OPEN SOURCE</span>
        </div>
      </div>
    </footer>
  );
}
