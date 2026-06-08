/* ============================================================================
   HOME — the centerpiece. Hero, stats, about, committees, news, strip, sponsors.
   ============================================================================ */

/* count-up for stats — resting value IS the real number, so it always shows
   even if the observer never fires; the animation runs 0 -> target on reveal. */
function useCountUp(target, run) {
  const [n, setN] = useState(target);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {setN(target);return;}
    let raf, start;
    const dur = 1300;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);else
      setN(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return n;
}

function Stat({ s, run }) {
  const raw = parseFloat(s.value.replace(/,/g, ""));
  const val = useCountUp(raw, run);
  const fmt = raw >= 1000 ? Math.round(val).toLocaleString() : val < 100 ? Math.round(val) : Math.round(val);
  return (
    <div className="stat">
      <div className="stat-num tnum">
        {s.prefix && <span className="pre">{s.prefix}</span>}
        <span>{fmt}</span>
        {s.suffix && <span className="suf">{s.suffix}</span>}
      </div>
      <div className="stat-label">{s.label}</div>
      <div className="stat-note">{s.note}</div>
    </div>);

}

function StatsStrip({ stats }) {
  const [run, setRun] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;if (!el) return;
    const io = new IntersectionObserver((e) => {if (e[0].isIntersecting) {setRun(true);io.disconnect();}}, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section className="stats" ref={ref}>
      <div className="wrap stats-in">
        {stats.map((s, i) => <Stat key={i} s={s} run={run} />)}
      </div>
    </section>);

}

function CommitteeLogoSlot({ committee }) {
  return (
    <div className="cmt-logo ph" data-ph="" title={committee.name + " logo"} style={{ borderRadius: 3 }}>
      <CommitteeLogo committee={committee} size={26} />
    </div>);

}

function Home() {
  const [data, setData] = useState(null);
  const heroRef = useRef(null);
  const heroInRef = useRef(null);
  useEffect(() => {
    Promise.all([
    window.acmApi.getStats(), window.acmApi.getCommittees(),
    window.acmApi.getNews(), window.acmApi.getSponsors()]
    ).then(([stats, committees, news, sponsors]) => setData({ stats, committees, news, sponsors }));
  }, []);
  useEffect(() => {
    const t = setTimeout(() => heroRef.current && heroRef.current.classList.add("lift"), 60);
    // safety net: guarantee the headline ends visible even if the animation
    // timeline never advances (e.g. some capture/embedded contexts)
    const t2 = setTimeout(() => heroRef.current && heroRef.current.classList.add("revealed"), 1400);
    return () => {clearTimeout(t);clearTimeout(t2);};
  }, []);
  // hero scroll-response: oversized type drifts up + fades as you scroll past
  useEffect(() => {
    const el = heroInRef.current;if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const p = Math.min(y / (window.innerHeight || 800), 1);
        el.style.transform = "translateY(" + y * 0.18 + "px)";
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
    <main>
      {/* ============================ HERO ============================ */}
      <section className="hero" ref={heroRef}>
        <div className="hero-grid-lines" />
        <div className="hero-canvas"><NodeField density={1} /></div>
        <div className="wrap hero-in" ref={heroInRef}>
          <div className="hero-eyebrow">
            <span className="tag mono"><span className="node"></span>ACM · UT ARLINGTON</span>
            <span className="mono est">[ ASSOCIATION FOR COMPUTING MACHINERY ]</span>
          </div>
          <h1 className="display hero-h1">
            <span className="ln"><span>A home</span></span>
            <span className="ln"><span>for people</span></span>
            <span className="ln"><span>who <span className="amp">build.</span></span></span>
          </h1>
          <div className="hero-bottom">
            <p className="hero-sub">
              One of the largest tech orgs at UTA. <b>1,700+ students</b>, every major, every skill level, building, shipping, and figuring it out together.
            </p>
            <div className="hero-actions">
              <Link to="/apply" className="btn btn-primary">Join ACM <Arrow /></Link>
              <Link to="/events" className="btn btn-ghost">See upcoming events <Arrow /></Link>
            </div>
          </div>
        </div>
        <div className="scroll-cue mono"><span className="line" /><span>SCROLL</span></div>
        <div className="hero-right-meta mono">
          <div>140+ EVENTS / YR</div>
          <div style={{ color: "var(--accent)" }}>HACKUTA · FLAGSHIP</div>
        </div>
      </section>

      {/* =========================== STATS =========================== */}
      <StatsStrip stats={stats} />

      {/* =========================== ABOUT =========================== */}
      <section className="section">
        <div className="wrap">
          <Reveal className="about">
            <div>
              <span className="tag mono" style={{ marginBottom: 24, display: "inline-flex" }}><span className="node"></span>WHO WE ARE</span>
              <p className="about-lead">
                We're a club for <b>building</b>, not just talking about it. <span className="hl">Across every major.</span>
              </p>
            </div>
            <div className="about-body">
              <p>ACM at UTA started small and grew into one of the biggest computing communities on campus. The point has stayed the same: give students a place to actually make things, with people who'll help them figure it out.</p>
              <p>Six committees run the whole thing: from shipping real products to reading research papers, running workshops, landing sponsors, and throwing the socials that make it stick. You don't need to be a CS major. You just need to want to build.</p>
              <Link to="/about" className="sec-link">Read the full story <Arrow /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================= COMMITTEES ========================= */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head row">
            <Reveal>
              <span className="tag mono" style={{ marginBottom: 16, display: "inline-flex" }}><span className="node"></span>SIX COMMITTEES</span>
              <h2 className="sec-title">Pick where <span className="dim">you fit.</span></h2>
            </Reveal>
            <Reveal><Link to="/committees" className="sec-link">All committees <Arrow /></Link></Reveal>
          </div>
          <Reveal className="cmt-list" stagger gap={55}>
            {committees.map((c, i) =>
            <Link key={c.id} to={"/" + c.slug} className="cmt-row">
                <CommitteeLogoSlot committee={c} />
                <div>
                  <div className="cmt-idx mono">{String(i + 1).padStart(2, "0")} / {c.tag}</div>
                  <div className="cmt-name">{c.name}
                    <span className={"cmt-kind mono" + (c.kind === "application" ? " kind-active" : "")}>{c.kind === "application" ? "APPLY" : c.kind === "program" ? "OPEN" : "STAFF"}</span>
                  </div>
                </div>
                <div className="cmt-sum">{c.summary}</div>
                <div className="cmt-go"><Arrow s={22} /></div>
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      {/* ============================ NEWS ============================ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head row">
            <Reveal>
              <span className="tag mono" style={{ marginBottom: 16, display: "inline-flex" }}><span className="node"></span>LATEST</span>
              <h2 className="sec-title">What's <span className="dim">happening.</span></h2>
            </Reveal>
          </div>
          <Reveal className="news-grid" stagger gap={50}>
            {news.map((n) =>
            <a key={n.id} href={n.link} className="news-item" onClick={(e) => {if (n.link.startsWith("#")) {e.preventDefault();navigate(n.link.replace("#", ""));}}}>
                <div className="news-top mono">
                  <span className="news-tag">{n.tag}</span>
                  <span className="news-date">{new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <div className="news-title">{n.title}</div>
                <div className="news-blurb">{n.blurb}</div>
              </a>
            )}
          </Reveal>
        </div>
      </section>

      {/* ========================= IMAGE STRIP ======================== */}
      <section className="strip">
        <div className="wrap" style={{ marginBottom: 28 }}>
          <span className="tag mono"><span className="node"></span>PROOF OF LIFE · 2025–26</span>
        </div>
        <div className="strip-track">
          {["Fall Kickoff", "Demo Night", "HackUTA '25", "Workshop", "Game Night", "Industry Night",
          "Fall Kickoff", "Demo Night", "HackUTA '25", "Workshop", "Game Night", "Industry Night"].map((p, i) =>
          <Ph key={i} className="strip-item" label={p} />
          )}
        </div>
      </section>

      {/* ========================== SPONSORS ========================== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="spon">
            <div>
              <span className="tag mono" style={{ marginBottom: 18, display: "inline-flex" }}><span className="node"></span>BACKED BY</span>
              <h2 className="sec-title" style={{ fontSize: "clamp(1.9rem,4.5vw,3.2rem)", marginBottom: 22 }}>Companies that<br />keep it free.</h2>
              <p style={{ color: "var(--text-dim)", maxWidth: "34ch", marginBottom: 26 }}>Sponsorship covers the food, the prizes, and HackUTA, so membership never costs a student a dime. $10k+ a year, and growing.</p>
              <Link to="/contact" className="btn btn-ghost">Become a sponsor <Arrow /></Link>
            </div>
            <div className="spon-wall">
              {sponsors.map((s, i) =>
              <a key={i} href={s.url} className="spon-cell" title={s.name}>
                  <span className="spon-tier mono">{s.tier}</span>
                  <span className="spon-name">{s.name}</span>
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>);

}

Object.assign(window, { Home });