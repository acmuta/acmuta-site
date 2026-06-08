/* ============================================================================
   Shared shell + primitives: router, Header (fullscreen menu), Footer,
   interactive node-graph canvas, scroll reveal, motif tag, placeholders.
   Exported to window at the bottom for cross-file use.
   ============================================================================ */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------------------------------- ROUTER --------------------------------- */
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
{ path: "/contact", label: "Contact" }];


/* committee active-route helper (committee detail pages live at /:slug) */
const COMMITTEE_SLUGS = ["create", "research", "educate", "marketing", "outreach", "community"];

function useRoute() {
  const get = () => window.location.hash.replace(/^#/, "") || "/";
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const on = () => {setRoute(get());window.scrollTo(0, 0);};
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
function navigate(to) {
  if ("#" + to === window.location.hash) {window.scrollTo({ top: 0, behavior: "smooth" });return;}
  window.location.hash = to;
}
function Link({ to, children, className, style, onClick }) {
  return (
    <a href={"#" + to} className={className} style={style}
    onClick={(e) => {e.preventDefault();onClick && onClick();navigate(to);}}>
      {children}
    </a>);

}

/* ------------------------------- SCROLL REVEAL ----------------------------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {el.classList.add("in");return;}
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {if (e.isIntersecting) {e.target.classList.add("in");io.unobserve(e.target);}});
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    // safety: never let content stay hidden if the observer never fires
    const fallback = setTimeout(() => el.classList.add("in"), 2600);
    return () => {io.disconnect();clearTimeout(fallback);};
  }, []);
  return ref;
}
// staggered children: sets transition-delay then reveals
function Reveal({ children, className = "", stagger = false, gap = 70, as = "div", style }) {
  const ref = useReveal();
  useEffect(() => {
    if (stagger && ref.current) {
      [...ref.current.children].forEach((c, i) => {c.style.transitionDelay = i * gap + "ms";});
    }
  }, [stagger, gap]);
  const Tag = as;
  return <Tag ref={ref} className={(stagger ? "" : "reveal ") + className} data-stagger={stagger ? "" : undefined} style={style}>{children}</Tag>;
}

/* ------------------------- COMMITTEE LOGO MARKS ---------------------------- */
/* Distinct on-brand placeholder mark per committee — node-graph motif, single
   accent only. Real SVGs drop in later via committees[].logo; swapping the file
   replaces this glyph. Each shape nods to what the committee does. */
function CommitteeMark({ id, size = 24 }) {
  const A = "var(--accent)",D = "var(--text-dim)",E = "var(--text-faint)";
  const shapes = {
    // build / ship — stacked triangle of nodes
    create: <g><path d="M12 5L6 18M12 5L18 18M6 18L18 18" stroke={E} strokeWidth="1" /><circle cx="6" cy="18" r="2" fill={D} /><circle cx="18" cy="18" r="2" fill={D} /><circle cx="12" cy="5" r="2.6" fill={A} /></g>,
    // inquiry / orbit
    research: <g><circle cx="12" cy="12" r="8" stroke={E} strokeWidth="1" /><circle cx="12" cy="12" r="1.7" fill={D} /><circle cx="12" cy="4" r="2.4" fill={A} /></g>,
    // mentor + mentee + group
    educate: <g><path d="M8 13L16 13M8 13L12 5M16 13L12 5" stroke={E} strokeWidth="1" /><circle cx="8" cy="13" r="2.6" fill={A} /><circle cx="16" cy="13" r="2.6" fill={D} /><circle cx="12" cy="5" r="1.7" fill={D} /></g>,
    // broadcast
    marketing: <g><path d="M7 12L16 6M7 12L18 12M7 12L16 18" stroke={E} strokeWidth="1" /><circle cx="16" cy="6" r="1.7" fill={D} /><circle cx="18" cy="12" r="1.7" fill={D} /><circle cx="16" cy="18" r="1.7" fill={D} /><circle cx="7" cy="12" r="2.8" fill={A} /></g>,
    // bridge between two clusters
    outreach: <g><path d="M6 8L18 16M6 16L18 8" stroke={E} strokeWidth="1" /><circle cx="6" cy="8" r="1.8" fill={D} /><circle cx="6" cy="16" r="1.8" fill={D} /><circle cx="18" cy="8" r="1.8" fill={D} /><circle cx="18" cy="16" r="1.8" fill={D} /><circle cx="12" cy="12" r="2.6" fill={A} /></g>,
    // ring / circle of people
    community: <g><path d="M12 5L19 10L16 18L8 18L5 10Z" stroke={E} strokeWidth="1" /><circle cx="19" cy="10" r="1.7" fill={D} /><circle cx="16" cy="18" r="1.7" fill={D} /><circle cx="8" cy="18" r="1.7" fill={D} /><circle cx="5" cy="10" r="1.7" fill={D} /><circle cx="12" cy="5" r="2.6" fill={A} /></g>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label={(id || "") + " committee logo"}>
      {shapes[id] || shapes.create}
    </svg>);

}

/* committee logo slot: real image when committees[].logo is set, else the mark.
   Dropping a real logo later = set the logo path in committees.ts. */
function CommitteeLogo({ committee, size = 26 }) {
  if (committee && committee.logo) {
    return <img src={committee.logo} alt={committee.name + " committee logo"} width={size} height={size} style={{ objectFit: "contain" }} loading="lazy" />;
  }
  return <CommitteeMark id={committee ? committee.id : ""} size={size} />;
}

/* small loading shimmer for async data */
function Loading({ label = "Loading" }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading-dot"></span>
      <span className="mono">{label}</span>
    </div>);

}
function PageLoading() {
  return <main style={{ minHeight: "78vh", display: "grid", placeItems: "center" }}><Loading /></main>;
}

/* --------------------------------- ICONS ----------------------------------- */
const Arrow = ({ s = 16 }) =>
<svg className="arrow" width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>;

const Plus = ({ s = 14 }) =>
<svg width={s} height={s} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.6" />
  </svg>;

const IgIcon = ({ s = 16 }) =>
<svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
  </svg>;

const LiIcon = ({ s = 16 }) =>
<svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
    <path d="M7 10.5V17M7 7.6V7.61" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M11 17v-3.4a2.1 2.1 0 0 1 4.2 0V17M11 10.8V17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

const GoogleIcon = ({ s = 18 }) =>
<svg width={s} height={s} viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z" />
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
  </svg>;


/* ----------------------------- NODE-GRAPH CANVAS --------------------------- */
/* The signature motif made motion: connected nodes that drift, link to their
   neighbors, and lean toward the cursor. Progressive enhancement — static on
   reduced-motion, lighter node count on small screens, paused off-screen. */
function NodeField({ density = 1, className, style }) {
  const cvs = useRef(null);
  useEffect(() => {
    const canvas = cvs.current;if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0,H = 0,dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [],raf = 0,running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    let cText = "27,26,23",cAccent = "194,100,15";
    const hexToRgb = (h) => {
      h = h.replace("#", "");
      const n = parseInt(h, 16);
      return `${n >> 16 & 255},${n >> 8 & 255},${n & 255}`;
    };
    const readColors = () => {try {cText = hexToRgb(css("--text"));cAccent = hexToRgb(css("--accent"));} catch (e) {}};

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width;H = r.height;
      canvas.width = W * dpr;canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = W < 640;
      const base = small ? 26 : 52;
      const count = Math.round(base * density * Math.min(1.4, Math.max(0.7, W / 1100)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.8,
        accent: Math.random() < 0.12
      }));
      readColors();
    }

    const LINK = () => W < 640 ? 110 : 150;
    function frame() {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const link = LINK();
      // edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x,dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < link) {
            const o = (1 - d / link) * 0.5;
            ctx.strokeStyle = `rgba(${cText},${o * 0.5})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();ctx.moveTo(a.x, a.y);ctx.lineTo(b.x, b.y);ctx.stroke();
          }
        }
      }
      // nodes + cursor interaction
      for (const n of nodes) {
        n.x += n.vx;n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        let near = false;
        if (mouse.active) {
          const dx = mouse.x - n.x,dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 170) {
            near = true;
            const f = (1 - d / 170) * 0.035;
            n.x += dx * f;n.y += dy * f;
            const o = 1 - d / 170;
            ctx.strokeStyle = `rgba(${cAccent},${o * 0.55})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();ctx.moveTo(mouse.x, mouse.y);ctx.lineTo(n.x, n.y);ctx.stroke();
          }
        }
        const acc = n.accent || near;
        ctx.fillStyle = acc ? `rgba(${cAccent},${near ? 0.95 : 0.75})` : `rgba(${cText},0.5)`;
        ctx.beginPath();ctx.arc(n.x, n.y, n.r + (near ? 1.2 : 0), 0, 7);ctx.fill();
      }
    }

    function still() {// single static frame for reduced-motion
      ctx.clearRect(0, 0, W, H);
      const link = LINK();
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],b = nodes[j],d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {ctx.strokeStyle = `rgba(${cText},${(1 - d / link) * 0.22})`;ctx.lineWidth = 0.7;ctx.beginPath();ctx.moveTo(a.x, a.y);ctx.lineTo(b.x, b.y);ctx.stroke();}
      }
      for (const n of nodes) {ctx.fillStyle = n.accent ? `rgba(${cAccent},0.75)` : `rgba(${cText},0.5)`;ctx.beginPath();ctx.arc(n.x, n.y, n.r, 0, 7);ctx.fill();}
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      mouse.x = p.clientX - r.left;mouse.y = p.clientY - r.top;mouse.active = true;
    };
    const onLeave = () => {mouse.active = false;mouse.x = mouse.y = -9999;};

    resize();
    const ro = new ResizeObserver(resize);ro.observe(canvas);
    const io = new IntersectionObserver((ents) => {running = ents[0].isIntersecting;}, { threshold: 0 });
    io.observe(canvas);
    const onTheme = () => readColors();
    window.addEventListener("themechange", onTheme);

    if (reduce) {still();} else
    {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);ro.disconnect();io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("themechange", onTheme);
    };
  }, [density]);
  return <canvas ref={cvs} className={className} style={{ width: "100%", height: "100%", display: "block", ...style }} aria-hidden="true" />;
}

/* --------------------------------- HEADER ---------------------------------- */
function Mark({ size = 30, withText = true }) {
  return (
    <Link to="/" className="acm-mark" aria-label="ACM at UTA home">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="6" cy="16" r="3" fill="var(--accent)" style={{ fill: "rgb(0, 100, 177)" }} />
        <circle cx="26" cy="7" r="2.4" fill="currentColor" />
        <circle cx="26" cy="25" r="2.4" fill="currentColor" />
        <path d="M6 16L26 7M6 16L26 25" stroke="currentColor" strokeWidth="1.3" opacity="0.6" />
      </svg>
      {withText && <span className="acm-word">ACM<span style={{ color: "var(--text-faint)" }}>·</span>UTA</span>}
    </Link>);

}

function ThemeToggle() {
  const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme") || "light");
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    try {localStorage.setItem("acm-theme", next);} catch (e) {}
    window.dispatchEvent(new Event("themechange"));
  };
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle color theme">
      <span className="mono" style={{ fontSize: "0.62rem" }}>{theme === "dark" ? "LGT" : "DRK"}</span>
      <span className="tt-dot" />
    </button>);

}

function Header() {
  const route = useRoute();
  const [open, setOpen] = useState(false);
  useEffect(() => {document.body.classList.toggle("noscroll", open);}, [open]);
  useEffect(() => {setOpen(false);}, [route]);
  return (
    <React.Fragment>
      <header className="hdr">
        <div className="wrap hdr-in">
          <Mark />
          <div className="hdr-right">
            <ThemeToggle />
            <Link to="/signin" className="hdr-signin">Sign in</Link>
            <Link to="/apply" className="btn btn-primary hdr-join">Apply <Arrow s={13} /></Link>
            <button className={"menu-btn" + (open ? " open" : "")} onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
              <span className="mono menu-label">{open ? "CLOSE" : "MENU"}</span>
              <span className="menu-ico"><i></i><i></i></span>
            </button>
          </div>
        </div>
      </header>

      <nav className={"overlay" + (open ? " open" : "")} aria-hidden={!open}>
        <div className="wrap overlay-in">
          <div className="overlay-meta mono">
            <span>[ navigation ]</span>
            <span>ASSOCIATION FOR COMPUTING MACHINERY · UT ARLINGTON</span>
          </div>
          <ul className="overlay-list">
            {ROUTES.map((r, i) => {
              const active = route === r.path ||
              r.path === "/committees" && COMMITTEE_SLUGS.includes(route.slice(1)) ||
              r.path === "/gallery" && route.startsWith("/gallery");
              return (
                <li key={r.path} style={{ transitionDelay: (open ? 0.06 + i * 0.04 : 0) + "s" }}>
                <Link to={r.path} className={"overlay-link" + (active ? " active" : "")} onClick={() => setOpen(false)}>
                  <span className="ol-num mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ol-text">{r.label}</span>
                  <span className="ol-arrow"><Arrow s={26} /></span>
                </Link>
              </li>);
            })}
          </ul>
          <div className="overlay-foot mono">
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
            <a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://github.com/acmuta" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:acm@uta.edu">acm@uta.edu</a>
          </div>
        </div>
      </nav>
    </React.Fragment>);

}

/* --------------------------------- FOOTER ---------------------------------- */
function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-cta reveal-skip">
          <span className="tag mono"><span className="node"></span>OPEN TO ALL MAJORS · ALL SKILL LEVELS</span>
          <h2 className="display ftr-head">Come build<br />something.</h2>
          <div className="ftr-actions">
            <Link to="/apply" className="btn btn-primary">Join ACM <Arrow /></Link>
            <Link to="/events" className="btn btn-ghost">See upcoming events <Arrow /></Link>
          </div>
        </div>
        <hr className="hr" style={{ margin: "0" }} />
        <div className="ftr-grid">
          <div className="ftr-brand">
            <Mark size={26} />
            <p className="ftr-blurb">A home for students across every major who want to build, learn, and grow in computing. Workshops, projects, research, hackathons, and the people who make it worth showing up.</p>
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
            <a href="https://discord.com" target="_blank" rel="noreferrer">Discord <Arrow s={12} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <Arrow s={12} /></a>
            <a href="https://github.com/acmuta" target="_blank" rel="noreferrer">GitHub <Arrow s={12} /></a>
            <a href="mailto:acm@uta.edu">Email <Arrow s={12} /></a>
          </div>
        </div>
        <div className="ftr-base mono">
          <span>© {new Date().getFullYear()} ACM AT UTA</span>
          <span>BUILT BY MEMBERS · OPEN SOURCE</span>
        </div>
      </div>
    </footer>);

}

/* placeholder helper */
function Ph({ label, className = "", style, ratio }) {
  const s = { ...style };
  if (ratio) s.aspectRatio = ratio;
  return <div className={"ph " + className} data-ph={label} style={s} />;
}

Object.assign(window, {
  ROUTES, COMMITTEE_SLUGS, useRoute, navigate, Link, useReveal, Reveal,
  Arrow, Plus, IgIcon, LiIcon, GoogleIcon, NodeField, Mark, ThemeToggle, Header, Footer, Ph,
  CommitteeMark, CommitteeLogo, Loading, PageLoading
});