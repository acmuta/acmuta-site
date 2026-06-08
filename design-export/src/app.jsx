/* ============================================================================
   App shell: hash router, scroll-progress bar, theme bootstrap, page transition.
   ============================================================================ */

// committee slugs route to a single CommitteePage
const COMMITTEE_SLUGS = ["create", "research", "educate", "marketing", "outreach", "community"];

function Stub({ title }) {
  return (
    <main>
      <section className="page-top"><div className="wrap">
        <span className="tag mono page-eyebrow"><span className="node"></span>IN PROGRESS</span>
        <h1 className="page-h1">{title}</h1>
        <p className="page-intro">This page is part of the build. Check back shortly.</p>
      </div></section>
    </main>
  );
}

function Router() {
  const route = useRoute();
  let view;
  const path = route.split("?")[0].replace(/\/$/, "") || "/";

  if (path === "/") view = <Home />;
  else if (path === "/about") view = window.AboutPage ? <window.AboutPage /> : <Stub title="About" />;
  else if (path === "/apply") view = window.ApplyPage ? <window.ApplyPage /> : <Stub title="Apply" />;
  else if (path === "/signin") view = window.SignInPage ? <window.SignInPage /> : <Stub title="Sign in" />;
  else if (path === "/signup") view = window.SignUpPage ? <window.SignUpPage /> : <Stub title="Sign up" />;
  else if (path === "/committees") view = window.CommitteesPage ? <window.CommitteesPage /> : <Stub title="Committees" />;
  else if (path === "/projects") view = window.ProjectsPage ? <window.ProjectsPage /> : <Stub title="Projects" />;
  else if (path === "/hackuta") view = window.HackutaPage ? <window.HackutaPage /> : <Stub title="HackUTA" />;
  else if (path === "/events") view = window.EventsPage ? <window.EventsPage /> : <Stub title="Events" />;
  else if (path === "/gallery") view = window.GalleryPage ? <window.GalleryPage /> : <Stub title="Gallery" />;
  else if (path.startsWith("/gallery/")) view = window.AlbumPage ? <window.AlbumPage id={path.split("/")[2]} /> : <Stub title="Album" />;
  else if (path === "/officers") view = window.OfficersPage ? <window.OfficersPage /> : <Stub title="Officers" />;
  else if (path === "/contact") view = window.ContactPage ? <window.ContactPage /> : <Stub title="Contact" />;
  else if (COMMITTEE_SLUGS.includes(path.slice(1))) view = window.CommitteePage ? <window.CommitteePage slug={path.slice(1)} /> : <Stub title="Committee" />;
  else view = window.NotFoundPage ? <window.NotFoundPage /> : <Stub title="404" />;

  return <div key={path} className="route-view">{view}</div>;
}

function App() {
  return (
    <React.Fragment>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); const m = document.querySelector("main"); if (m) { m.setAttribute("tabindex", "-1"); m.focus(); m.scrollIntoView ? null : null; } }}>Skip to content</a>
      <Header />
      <Router />
      <Footer />
    </React.Fragment>
  );
}

/* ---- theme bootstrap (before paint handled inline; here we sync state) ---- */
(function initTheme() {
  try {
    const saved = localStorage.getItem("acm-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}
})();

/* ---- scroll progress bar ---- */
(function scrollProgress() {
  const bar = document.getElementById("scrollbar");
  let ticking = false;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = p + "%";
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* ---- mount ---- */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
requestAnimationFrame(() => document.getElementById("root").classList.add("ready"));
