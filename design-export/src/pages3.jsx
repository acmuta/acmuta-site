/* ============================================================================
   pages3.jsx — About, Apply (round 2 content completion).
   ============================================================================ */

function AboutPage() {
  const [committees, setCommittees] = useState(null);
  const [stats, setStats] = useState([]);
  useEffect(() => {
    window.acmApi.getCommittees().then(setCommittees);
    window.acmApi.getStats().then(setStats);
  }, []);
  if (!committees) return <PageLoading />;

  return (
    <main>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow"><span className="node"></span>ABOUT · EST. ON CAMPUS</span>
            <h1 className="page-h1">We're ACM<br/>at <span className="amp">UTA.</span></h1>
            <p className="page-intro">The Association for Computing Machinery at the University of Texas at Arlington, and one of the largest tech communities on campus.</p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,3vw,40px)" }}>
        <div className="wrap">
          {/* who we are */}
          <Reveal className="ab-block">
            <div className="ab-text">
              <span className="tag mono ab-kicker"><span className="node"></span>WHO WE ARE</span>
              <h2 className="ab-h">Where the builders<br/>end <span className="amp">up.</span></h2>
              <p>We're where students who want to build things, learn fast, and meet people who care about the same stuff end up. One community, a lot of doors in.</p>
            </div>
            <Ph className="ab-photo" label="group / room shot" />
          </Reveal>

          {/* open to everyone */}
          <Reveal className="ab-block rev">
            <div className="ab-text">
              <span className="tag mono ab-kicker"><span className="node"></span>OPEN TO EVERYONE</span>
              <h2 className="ab-h">No major<br/>required.</h2>
              <p>You don't need to be a CS major, and you don't need to already know how to code. Some of our most active members started with zero experience. If you're curious about tech, you belong here.</p>
            </div>
            <Ph className="ab-photo" label="workshop / hands-on" />
          </Reveal>

          {/* what we do */}
          <Reveal className="ab-block">
            <div className="ab-text">
              <span className="tag mono ab-kicker"><span className="node"></span>WHAT WE ACTUALLY DO</span>
              <h2 className="ab-h">140+ events<br/>a <span className="amp">year.</span></h2>
              <p>Weekly workshops, semester-long projects you can put on a resume, research alongside faculty, socials, industry nights with companies that hire, and HackUTA, our flagship hackathon. Over a year it adds up.</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
                <Link to="/events" className="btn btn-ghost">See events <Arrow /></Link>
                <Link to="/hackuta" className="btn btn-ghost">HackUTA <Arrow /></Link>
              </div>
            </div>
            <Ph className="ab-photo" label="event / crowd" />
          </Reveal>

          {/* how we're organized */}
          <Reveal className="ab-block rev" style={{ borderBottom: "none" }}>
            <div className="ab-text">
              <span className="tag mono ab-kicker"><span className="node"></span>HOW WE'RE ORGANIZED</span>
              <h2 className="ab-h">Six committees,<br/>one org.</h2>
              <p style={{ marginBottom: 22 }}>Each has its own focus. Join one, jump between events, or just show up to whatever interests you.</p>
            </div>
            <ul className="ab-orglist">
              {committees.map((c) => (
                <li key={c.id}>
                  <Link to={"/" + c.slug}>
                    <CommitteeLogo committee={c} size={22} />
                    <span className="nm">{c.name}</span>
                    <span className="ar"><Arrow s={15} /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function ApplyCard({ item }) {
  const officer = item.kind === "officer";
  return (
    <div className={"trk-card" + (officer ? " officer" : " member")}>
      <div className="trk-card-top">
        <span className={"trk-badge " + (officer ? "b-officer" : "b-member")}>{officer ? "OFFICER" : "MEMBER"}</span>
        {item.meta && <span className="trk-meta mono">{item.meta}</span>}
      </div>
      <div className="trk-mark"><CommitteeMark id={item.markId} size={26} /></div>
      <h3 className="trk-name">{item.name}</h3>
      <p className="trk-desc">{item.desc}</p>
      <a className={"btn " + (officer ? "btn-ghost" : "btn-primary")} href={item.href} target="_blank" rel="noreferrer">
        {item.cta} <Arrow s={13} />
      </a>
    </div>
  );
}

function ApplyPage() {
  const members = [
    { name: "Create", markId: "create", kind: "member", meta: "DEV TEAMS", desc: "Apply to join a Create dev team and ship a real product over the semester, working in a shared repo with code review.", cta: "Apply to Create", href: "https://forms.google.com" },
    { name: "Research", markId: "research", kind: "member", meta: "RESEARCH TEAMS", desc: "Apply to join a Research team, read papers, reproduce results, and work toward something publishable.", cta: "Apply to Research", href: "https://forms.google.com" },
    { name: "Mentor / Mentee", markId: "educate", kind: "member", meta: "EDUCATE PROGRAM", desc: "Get paired through Educate's program. Apply as a mentee to be matched with someone who's been through it, or as a mentor to guide newer students.", cta: "Apply to the program", href: "https://forms.google.com" },
  ];
  const officerCommittees = [
    { name: "Create", markId: "create" },
    { name: "Research", markId: "research" },
    { name: "Educate", markId: "educate" },
    { name: "Marketing", markId: "marketing" },
    { name: "Outreach", markId: "outreach" },
    { name: "Community", markId: "community" },
  ];

  return (
    <main>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow"><span className="node"></span>GET INVOLVED</span>
            <h1 className="page-h1">Pick a <span className="amp">track.</span></h1>
            <p className="page-intro">There are two ways in: join a committee as a <b style={{color:"var(--text)"}}>member</b>, or apply for an <b style={{color:"var(--text)"}}>officer</b> role and help run one. Pick the track that fits.</p>
            <span className="apply-note">You sign in with your <code>@mavs.uta.edu</code> email before applying.</span>
          </Reveal>
        </div>
      </section>

      {/* TRACK 1 — MEMBERSHIP */}
      <section className="section" style={{ paddingTop: "clamp(32px,5vw,56px)", paddingBottom: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          <Reveal className="trk-head">
            <div className="trk-head-l">
              <span className="trk-tracknum mono">TRACK 01</span>
              <h2 className="trk-title">Join a committee</h2>
              <span className="trk-badge b-member trk-title-badge">MEMBER APPLICATIONS</span>
            </div>
            <p className="trk-head-copy">For students who want to be on a team, build, learn, and show up. Membership applications open each semester.</p>
          </Reveal>
          <Reveal className="trk-grid" stagger gap={55}>
            {members.map((m, i) => <ApplyCard key={i} item={m} />)}
          </Reveal>
        </div>
      </section>

      {/* TRACK 2 — OFFICER */}
      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          <Reveal className="trk-head trk-head-officer">
            <div className="trk-head-l">
              <span className="trk-tracknum mono">TRACK 02</span>
              <h2 className="trk-title">Become an officer</h2>
              <span className="trk-badge b-officer trk-title-badge">OFFICER APPLICATIONS</span>
            </div>
            <p className="trk-head-copy">For students ready to lead, plan events, run a team, and shape the org. Apply for an officer role on any committee with openings.</p>
          </Reveal>
          <Reveal className="trk-grid trk-grid-officer" stagger gap={45}>
            {officerCommittees.map((c, i) => (
              <ApplyCard key={i} item={{
                name: c.name, markId: c.markId, kind: "officer", meta: "OFFICER ROLE",
                desc: "Apply for an officer or director role on " + c.name + ". Help run events, projects, and the day-to-day.",
                cta: "Apply for " + c.name, href: "https://forms.google.com",
              }} />
            ))}
          </Reveal>
          <p style={{ color: "var(--text-faint)", fontSize: "0.85rem", marginTop: 26 }}>Application forms open each semester. Apply links are placeholders in this prototype.</p>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { AboutPage, ApplyPage });
