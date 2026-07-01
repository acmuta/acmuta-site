import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Arrow } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { NotificationBell } from "./NotificationBell";

const ROUTES = [
  { path: "/",           label: "Home" },
  { path: "/about",      label: "About" },
  { path: "/committees", label: "Committees" },
  { path: "/projects",   label: "Projects" },
  { path: "/hackuta",    label: "HackUTA" },
  { path: "/events",     label: "Events" },
  { path: "/gallery",    label: "Gallery" },
  { path: "/officers",   label: "Officers" },
  { path: "/apply",      label: "Apply" },
  { path: "/contact",    label: "Contact" },
];

const COMMITTEE_SLUGS = ["create", "research", "educate", "marketing", "outreach", "community"];

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

function AcmMark({ size = 30 }: { size?: number }) {
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

export function Header() {
  const location = useLocation();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("noscroll", open);
    return () => { document.body.classList.remove("noscroll"); };
  }, [open]);

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
    if (path === "/gallery") return location.pathname.startsWith("/gallery");
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setOpen(false);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "?";

  return (
    <>
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

            {/* Show sign-in link when logged out; avatar badge when logged in */}
            {!loading && !user && (
              <Link to="/signin" className="hdr-signin">Sign in</Link>
            )}
            {!loading && user && <NotificationBell />}
            {!loading && user && (
              <button
                className="hdr-user"
                aria-label={`Signed in as ${profile?.full_name ?? user.email}`}
                title={profile?.full_name ?? user.email}
                onClick={() => navigate("/profile")}
              >
                <span className="hdr-avatar">{initials}</span>
              </button>
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
              <span className="menu-ico"><i /><i /></span>
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
                  <span className="ol-arrow"><Arrow s={26} /></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="overlay-foot mono">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  {profile?.full_name ?? user.email}
                </Link>
                <button className="overlay-signout" onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setOpen(false)}>Sign in</Link>
                <Link to="/signup" onClick={() => setOpen(false)}>Sign up</Link>
              </>
            )}
            <a href="https://discord.gg/yXggXURBVQ" target="_blank" rel="noreferrer">Discord</a>
            <a href="https://instagram.com/acmuta" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://github.com/acmuta" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:acm.uta@gmail.com">acm@uta.edu</a>
          </div>
        </div>
      </nav>
    </>
  );
}
