import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Arrow } from "@/components/icons";

const ROUTES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/committees", label: "Committees" },
  { path: "/projects", label: "Projects" },
  { path: "/hackuta", label: "HackUTA" },
  { path: "/events", label: "Events" },
  { path: "/gallery", label: "Gallery" },
  { path: "/officers", label: "Officers" },
  { path: "/apply", label: "Apply" },
  { path: "/contact", label: "Contact" },
];

const COMMITTEE_SLUGS = ["create", "research", "educate", "marketing", "outreach", "community"];

function AcmMark({ size = 30 }: { size?: number }) {
  return (
    <Link to="/" className="acm-mark" aria-label="ACM at UTA home">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="6" cy="16" r="3" style={{ fill: "rgb(0, 100, 177)" }} />
        <circle cx="26" cy="7" r="2.4" fill="currentColor" />
        <circle cx="26" cy="25" r="2.4" fill="currentColor" />
        <path
          d="M6 16L26 7M6 16L26 25"
          stroke="currentColor"
          strokeWidth="1.3"
          opacity="0.6"
        />
      </svg>
      <span className="acm-word">
        ACM<span style={{ color: "var(--text-faint)" }}>·</span>UTA
      </span>
    </Link>
  );
}

interface HeaderProps {
  /** Stub — always false until real auth is wired up */
  isAuthed?: boolean;
}

export function Header({ isAuthed = false }: HeaderProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Close overlay on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.classList.toggle("noscroll", open);
    return () => { document.body.classList.remove("noscroll"); };
  }, [open]);

  // Scroll-progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setScrollProgress(max > 0 ? scrolled / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/committees") {
      return (
        location.pathname === "/committees" ||
        COMMITTEE_SLUGS.some((s) => location.pathname === `/${s}`)
      );
    }
    if (path === "/gallery") {
      return location.pathname.startsWith("/gallery");
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scrollbar"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      <header className="hdr">
        <div className="wrap hdr-in">
          <AcmMark />
          <div className="hdr-right">
            <ThemeToggle />
            {/* Auth-dependent: presentational stubs, driven by isAuthed later */}
            {!isAuthed && (
              <Link to="/signin" className="hdr-signin">
                Sign in
              </Link>
            )}
            <Link to="/apply" className="btn btn-primary hdr-join">
              Apply <Arrow s={13} />
            </Link>
            <button
              className={`menu-btn${open ? " open" : ""}`}
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="mono menu-label">{open ? "CLOSE" : "MENU"}</span>
              <span className="menu-ico">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav className={`overlay${open ? " open" : ""}`} aria-hidden={!open}>
        <div className="wrap overlay-in">
          <div className="overlay-meta mono">
            <span>[ navigation ]</span>
            <span>ASSOCIATION FOR COMPUTING MACHINERY · UT ARLINGTON</span>
          </div>
          <ul className="overlay-list">
            {ROUTES.map((r, i) => (
              <li
                key={r.path}
                style={{ transitionDelay: (open ? 0.06 + i * 0.04 : 0) + "s" }}
              >
                <Link
                  to={r.path}
                  className={`overlay-link${isActive(r.path) ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="ol-num mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ol-text">{r.label}</span>
                  <span className="ol-arrow">
                    <Arrow s={26} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="overlay-foot mono">
            <Link to="/signin" onClick={() => setOpen(false)}>Sign in</Link>
            <Link to="/signup" onClick={() => setOpen(false)}>Sign up</Link>
            <a href="https://discord.gg/acmuta" target="_blank" rel="noreferrer">Discord</a>
            <a href="https://instagram.com/acmuta" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://github.com/acmuta" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:acm.uta@gmail.com">acm@uta.edu</a>
          </div>
        </div>
      </nav>
    </>
  );
}
