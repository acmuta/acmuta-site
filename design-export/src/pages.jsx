/* ============================================================================
   pages.jsx — Committees overview, Committee detail, Projects, HackUTA.
   ============================================================================ */

function PageTop({ tag, title, intro, children }) {
  return (
    <section className="page-top">
      <div className="wrap">
        <Reveal>
          <span className="tag mono page-eyebrow"><span className="node"></span>{tag}</span>
          <h1 className="page-h1" dangerouslySetInnerHTML={{ __html: title }} />
          {intro && <p className="page-intro">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

function CmtLogo({ big }) {
  const sz = big ? 40 : 22;
  return (
    <svg width={sz} height={sz} viewBox="0 0 22 22" fill="none">
      <circle cx="5" cy="11" r="2.2" fill="var(--accent)"/>
      <circle cx="17" cy="5" r="1.8" fill="var(--text-dim)"/>
      <circle cx="17" cy="17" r="1.8" fill="var(--text-dim)"/>
      <path d="M5 11L17 5M5 11L17 17" stroke="var(--text-faint)" strokeWidth="1"/>
    </svg>
  );
}

function CommitteeListRow({ c, i }) {
  return (
    <Link to={"/" + c.slug} className="cmt-row">
      <div className="cmt-logo ph" data-ph="" style={{ borderRadius: 3 }}><CommitteeLogo committee={c} size={26} /></div>
      <div>
        <div className="cmt-idx mono">{String(i + 1).padStart(2, "0")} / {c.tag}</div>
        <div className="cmt-name">{c.name}
          <span className={"cmt-kind mono" + (c.kind === "application" ? " kind-active" : "")}>{c.kind === "application" ? "APPLY" : c.kind === "program" ? "OPEN" : "STAFF"}</span>
        </div>
      </div>
      <div className="cmt-sum">{c.summary}</div>
      <div className="cmt-go"><Arrow s={22} /></div>
    </Link>
  );
}

function CommitteesPage() {
  const [c, setC] = useState(null);
  useEffect(() => { window.acmApi.getCommittees().then(setC); }, []);
  if (!c) return <PageLoading />;
  const groups = [
    { key: "application", title: "Build teams", meta: "BY APPLICATION", note: "Small teams you apply to join. You ship real work over the semester." },
    { key: "program", title: "Open program", meta: "NO APPLICATION", note: "Open to everyone. Workshops, career prep, and mentorship." },
    { key: "staff", title: "Staff committees", meta: "OFFICER + DIRECTOR ROLES", note: "The teams that run the org. Jump in by showing up." },
  ];
  return (
    <main>
      <PageTop
        tag="SIX COMMITTEES · ONE ORG"
        title='Find your<br/><span class="amp">corner.</span>'
        intro="ACM runs on six committees. Some you apply to, some you just show up for. They all add up to one place to build, learn, and belong."
      />
      <section className="section" style={{ paddingTop: "clamp(20px,4vw,40px)" }}>
        <div className="wrap">
          {groups.map((g) => {
            const items = c.filter((x) => x.kind === g.key);
            return (
              <div className="cmt-group" key={g.key}>
                <div className="cmt-group-h">
                  <h3>{g.title}</h3>
                  <span className="mono gmeta">{g.meta}</span>
                </div>
                <p style={{ color: "var(--text-dim)", maxWidth: "60ch", margin: "16px 0 8px" }}>{g.note}</p>
                <Reveal className="cmt-list" stagger gap={55}>
                  {items.map((x) => <CommitteeListRow key={x.id} c={x} i={c.indexOf(x)} />)}
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function CommitteePage({ slug }) {
  const [c, setC] = useState(null);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    window.acmApi.getCommittee(slug).then(setC);
    window.acmApi.getProjects().then(setProjects);
  }, [slug]);
  if (!c) return <PageLoading />;
  const related = projects.filter((p) => p.committee.toLowerCase() === c.name.toLowerCase());
  const kindLabel = c.kind === "application" ? "BY APPLICATION" : c.kind === "program" ? "OPEN TO ALL" : "STAFF COMMITTEE";

  return (
    <main>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <Link to="/committees" className="mono" style={{ color: "var(--text-faint)", display: "inline-flex", gap: 8, marginBottom: 26 }}>← ALL COMMITTEES</Link>
            <div className="cd-hero">
              <div>
                <div className="cd-logo ph" data-ph=""><CommitteeLogo committee={c} size={48} /></div>
                <span className="tag mono" style={{ marginBottom: 18, display: "inline-flex" }}><span className="node"></span>{kindLabel} · {c.tag}</span>
                <h1 className="page-h1" style={{ fontSize: "clamp(3rem,12vw,8rem)" }}>{c.name}<span className="amp">.</span></h1>
              </div>
              <div>
                <p className="cd-desc">{c.summary}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap cd-grid">
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 22, display: "inline-flex" }}><span className="node"></span>THE WHOLE STORY</span>
            <p style={{ fontSize: "1.15rem", color: "var(--text-dim)", lineHeight: 1.6, maxWidth: "46ch" }}>{c.description}</p>
          </Reveal>
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 22, display: "inline-flex" }}><span className="node"></span>WHAT MEMBERS DO</span>
            <ul className="do-list">
              {c.doing.map((d, i) => (
                <li key={i}><span className="di">{String(i + 1).padStart(2, "0")}</span><span>{d}</span></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head row">
              <Reveal><h2 className="sec-title" style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}>From this <span className="dim">committee.</span></h2></Reveal>
              <Reveal><Link to="/projects" className="sec-link">All projects <Arrow /></Link></Reveal>
            </div>
            <Reveal className="proj-grid" stagger gap={60}>
              {related.map((p) => <ProjectCard key={p.id} p={p} />)}
            </Reveal>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="involve-card" style={{ maxWidth: 720 }}>
            <h4>How to get involved</h4>
            <p>{c.involve}</p>
            <Link to="/contact" className="btn btn-primary">Get involved <Arrow /></Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

/* shared project card (used on Projects + committee pages) */
function ProjectCard({ p, feat }) {
  return (
    <article className={"proj-card" + (feat ? " feat" : "")}>
      <div className="proj-img"><Ph label={p.title} /></div>
      <div className="proj-meta mono">
        <span className="proj-cmt">{p.committee}</span>
        <span className="proj-year">{p.year}</span>
      </div>
      <h3 className="proj-title">{p.title}</h3>
      <p className="proj-sum">{p.summary}</p>
      <div className="proj-links">
        {p.websiteUrl && <a href={p.websiteUrl} target="_blank" rel="noreferrer">Live site <Arrow s={13} /></a>}
        {p.codeUrl && <a href={p.codeUrl} target="_blank" rel="noreferrer">Code <Arrow s={13} /></a>}
      </div>
    </article>
  );
}

function ProjectsPage() {
  const [p, setP] = useState(null);
  useEffect(() => { window.acmApi.getProjects().then(setP); }, []);
  if (!p) return <PageLoading />;
  return (
    <main>
      <PageTop
        tag="WHAT WE'VE BUILT"
        title='Real things,<br/>real <span class="amp">users.</span>'
        intro="Members don't just learn to code, they ship. Tools thousands of UTA students actually use, open-source and built in our committees."
      />
      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <Reveal className="proj-grid" stagger gap={50}>
            {p.map((x) => <ProjectCard key={x.id} p={x} feat={x.featured} />)}
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function HackutaPage() {
  const stats = [
    { n: "500", s: "+", l: "hackers" },
    { n: "24", s: "hr", l: "of building" },
    { n: "40", s: "+", l: "mentors" },
    { n: "15", s: "k", l: "in prizes" },
  ];
  return (
    <main>
      <section className="hk-hero">
        <div className="hk-canvas"><NodeField density={0.7} /></div>
        <div className="wrap hk-in">
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 22, display: "inline-flex" }}><span className="node"></span>ACM'S FLAGSHIP HACKATHON</span>
            <h1 className="hk-title display">Hack<span className="yr">UTA</span></h1>
            <div className="hk-row">
              <span className="hk-date">OCT 18–19, 2026</span>
              <span className="mono" style={{ color: "var(--text-faint)" }}>UTA COLLEGE PARK CENTER</span>
              <Link to="/contact" className="btn btn-primary">Register interest <Arrow /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="about">
            <Reveal>
              <span className="tag mono" style={{ marginBottom: 18, display: "inline-flex" }}><span className="node"></span>WHAT IT IS</span>
              <p className="about-lead">24 hours. <span className="hl">Zero sleep.</span> One idea you actually finish.</p>
            </Reveal>
            <Reveal className="about-body">
              <p>HackUTA is the biggest thing ACM throws all year, an open, beginner-friendly hackathon where 500+ students show up to build something in a weekend. Workshops, mentors, free food, and prizes.</p>
              <p>You don't need a team or an idea to start. Most people don't. Come with a laptop and curiosity, leave with a project, new friends, and a story.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 22, display: "inline-flex" }}><span className="node"></span>HACKUTA 2025, BY THE NUMBERS</span>
          </Reveal>
          <Reveal className="hk-stats" stagger gap={60}>
            {stats.map((s, i) => (
              <div className="hk-stat" key={i}>
                <div className="n tnum">{s.n}<span className="suf">{s.s}</span></div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="strip" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ marginBottom: 28 }}>
          <span className="tag mono"><span className="node"></span>FROM LAST YEAR</span>
        </div>
        <div className="strip-track">
          {["Opening", "Workshops", "Mentors", "Late night", "Demos", "Winners",
            "Opening", "Workshops", "Mentors", "Late night", "Demos", "Winners"].map((p, i) => (
            <Ph key={i} className="strip-item" label={"HackUTA · " + p} />
          ))}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { PageTop, CmtLogo, CommitteesPage, CommitteePage, ProjectCard, ProjectsPage, HackutaPage });
