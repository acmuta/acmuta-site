/* ============================================================================
   pages2.jsx — Events, Gallery, Album, Officers, Contact, 404.
   ============================================================================ */

/* tiny toast helper */
function useToast() {
  const [msg, setMsg] = useState("");
  const ref = useRef(null);
  const fire = (m) => {
    setMsg(m);
    clearTimeout(ref.current);
    ref.current = setTimeout(() => setMsg(""), 2600);
  };
  const node = <div className={"toast" + (msg ? " show" : "")}>{msg || "\u00A0"}</div>;
  return [fire, node];
}

function committeeName(id, committees) {
  if (!id) return "All of ACM";
  const c = committees.find((x) => x.id === id);
  return c ? c.name : "ACM";
}
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const fmtDay = (iso) => new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

/* ------------------------------- EVENTS --------------------------------- */
function EventRow({ e, committees, onAdd }) {
  const [open, setOpen] = useState(false);
  const d = new Date(e.start_time);
  return (
    <div className={"ev-row" + (open ? " open" : "")} onClick={() => setOpen(!open)} role="button" tabIndex={0}
         onKeyDown={(ke) => { if (ke.key === "Enter" || ke.key === " ") { ke.preventDefault(); setOpen(!open); } }}
         aria-expanded={open}>
      <div className="ev-date">
        <div className="mo">{d.toLocaleDateString("en-US", { month: "short" })}</div>
        <div className="dy tnum">{d.getDate()}</div>
      </div>
      <div className="ev-main">
        <div className="ev-titlewrap">
          <div className="ev-title">{e.title}</div>
          <div className="ev-when mono">{fmtTime(e.start_time)} – {fmtTime(e.end_time)}</div>
        </div>
        <div className="ev-metarow">
          <span className="ev-loc">{e.location}</span>
          <span className="ev-badge mono">{committeeName(e.committee_id, committees)}</span>
        </div>
      </div>
      <div className="ev-detail">
        <div className="ev-detail-in">
          <p>{e.description}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={(ev) => { ev.stopPropagation(); onAdd(e.title); }}>Add to my calendar <Arrow s={13} /></button>
            {e.google_photos_url && <a className="btn btn-ghost" href={e.google_photos_url} target="_blank" rel="noreferrer" onClick={(ev) => ev.stopPropagation()}>Photos <Arrow s={13} /></a>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ events, committees, onAdd }) {
  // months that actually have events, sorted
  const months = [...new Set(events.map((e) => e.start_time.slice(0, 7)))].sort();
  const [mi, setMi] = useState(months.length ? months.findIndex((m) => m >= "2026-06") : 0);
  const idx = Math.max(0, Math.min(mi, months.length - 1));
  const ym = months[idx];
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const startPad = first.getDay();
  const days = new Date(y, m, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const evFor = (d) => events.filter((e) => { const dt = new Date(e.start_time); return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d; });
  const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="ev-toolbar" style={{ justifyContent: "space-between" }}>
        <div className="seg">
          <button onClick={() => setMi(Math.max(0, idx - 1))} disabled={idx === 0}>← Prev</button>
          <button onClick={() => setMi(Math.min(months.length - 1, idx + 1))} disabled={idx === months.length - 1}>Next →</button>
        </div>
        <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>{label}</span>
      </div>
      <div className="cal">
        <div className="cal-head">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}</div>
        <div className="cal-grid">
          {cells.map((d, i) => (
            <div className={"cal-cell" + (d ? "" : " muted")} key={i}>
              {d && <span className="tnum">{d}</span>}
              {d && evFor(d).map((e) => (
                <span className="cal-ev" key={e.id} title={e.title} onClick={() => onAdd(e.title)}>{e.title}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const [events, setEvents] = useState(null);
  const [committees, setCommittees] = useState([]);
  const [view, setView] = useState("list");
  const [when, setWhen] = useState("upcoming");
  const [fire, toast] = useToast();
  useEffect(() => {
    window.acmApi.getEvents().then(setEvents);
    window.acmApi.getCommittees().then(setCommittees);
  }, []);
  if (!events) return <PageLoading />;
  const now = new Date("2026-06-06");
  const sorted = [...events].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  const upcoming = sorted.filter((e) => new Date(e.start_time) >= now);
  const past = sorted.filter((e) => new Date(e.start_time) < now).reverse();
  const shown = when === "upcoming" ? upcoming : past;
  const add = (t) => fire("Added “" + t + "” to your calendar (demo)");

  return (
    <main>
      <PageTop
        tag="WHAT'S ON"
        title='Show <span class="amp">up.</span>'
        intro="Workshops, demos, socials, and the occasional all-nighter. Something on the calendar most weeks, open to every member."
      />
      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <div className="ev-toolbar" style={{ justifyContent: "space-between" }}>
            <div className="seg">
              <button className={when === "upcoming" ? "on" : ""} onClick={() => setWhen("upcoming")}>Upcoming</button>
              <button className={when === "past" ? "on" : ""} onClick={() => setWhen("past")}>Past</button>
            </div>
            <div className="seg">
              <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>List</button>
              <button className={view === "calendar" ? "on" : ""} onClick={() => setView("calendar")}>Calendar</button>
            </div>
          </div>

          {view === "list" ? (
            <div className="ev-list">
              {shown.map((e) => <EventRow key={e.id} e={e} committees={committees} onAdd={add} />)}
              {shown.length === 0 && <p style={{ color: "var(--text-dim)", padding: "30px 0" }}>Nothing here yet. Check back soon.</p>}
            </div>
          ) : (
            <MiniCalendar events={events} committees={committees} onAdd={add} />
          )}
        </div>
      </section>
      {toast}
    </main>
  );
}

/* ------------------------------- GALLERY -------------------------------- */
function GalleryPage() {
  const [albums, setAlbums] = useState(null);
  useEffect(() => { window.acmApi.getAlbums().then(setAlbums); }, []);
  if (!albums) return <PageLoading />;
  return (
    <main>
      <PageTop
        tag="THE GALLERY"
        title='Proof of <span class="amp">life.</span>'
        intro="Every event, photographed. Click an album to look through the night. Full sets live on Google Photos."
      />
      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <Reveal className="gal-grid" stagger gap={45}>
            {albums.map((a) => (
              <Link to={"/gallery/" + a.id} className="gal-card" key={a.id}>
                <div className="gal-cover">
                  <Ph label={a.title} />
                  <span className="cnt">{a.count} PHOTOS</span>
                </div>
                <div className="gal-meta">
                  <span className="gal-name">{a.title}</span>
                  <span className="gal-date mono">{new Date(a.album_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}

function AlbumPage({ id }) {
  const [album, setAlbum] = useState(undefined);
  useEffect(() => { window.acmApi.getAlbum(id).then(setAlbum); }, [id]);
  if (album === undefined) return <PageLoading />;
  if (!album) return <NotFoundPage />;
  return (
    <main>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <Link to="/gallery" className="mono" style={{ color: "var(--text-faint)", display: "inline-flex", gap: 8, marginBottom: 24 }}>← ALL ALBUMS</Link>
            <div className="sec-head row">
              <div>
                <span className="tag mono" style={{ marginBottom: 16, display: "inline-flex" }}><span className="node"></span>{new Date(album.album_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {album.count} PHOTOS</span>
                <h1 className="page-h1" style={{ fontSize: "clamp(2.6rem,9vw,6.5rem)" }}>{album.title}</h1>
              </div>
              <a href={album.google_photos_url} target="_blank" rel="noreferrer" className="btn btn-ghost">View on Google Photos <Arrow /></a>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <Reveal className="album-grid" stagger gap={28}>
            {Array.from({ length: 14 }, (_, i) => <Ph key={i} label="photo" />)}
          </Reveal>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------- OFFICERS ------------------------------- */
function OfficerSocials({ o }) {
  if (!o.instagram && !o.linkedin) return null;
  return (
    <div className="off-socials">
      {o.instagram && (
        <a href={"https://instagram.com/" + o.instagram} target="_blank" rel="noreferrer"
           className="off-social" aria-label={o.name + " on Instagram"} onClick={(e) => e.stopPropagation()}>
          <IgIcon s={15} />
        </a>
      )}
      {o.linkedin && (
        <a href={"https://linkedin.com/in/" + o.linkedin} target="_blank" rel="noreferrer"
           className="off-social" aria-label={o.name + " on LinkedIn"} onClick={(e) => e.stopPropagation()}>
          <LiIcon s={15} />
        </a>
      )}
    </div>
  );
}

function OfficerCard({ o }) {
  return (
    <div className="off-card">
      <div className="off-photo"><Ph label={o.name} /></div>
      <div className="off-info">
        <div className="off-name">{o.name}</div>
        <div className="off-role">{o.role}</div>
        <OfficerSocials o={o} />
      </div>
    </div>
  );
}

function OfficersPage() {
  const [officers, setOfficers] = useState(null);
  const [alumni, setAlumni] = useState([]);
  const [committees, setCommittees] = useState([]);
  useEffect(() => {
    window.acmApi.getOfficers().then(setOfficers);
    window.acmApi.getAlumni().then(setAlumni);
    window.acmApi.getCommittees().then(setCommittees);
  }, []);
  if (!officers) return <PageLoading />;
  const leadership = officers.filter((o) => o.tier === "exec");
  const order = ["Create", "Research", "Educate", "Marketing", "Outreach", "Community"];
  const byCmt = order.map((name) => ({ name, people: officers.filter((o) => o.committee === name) })).filter((g) => g.people.length);

  return (
    <main>
      <PageTop
        tag="THE TEAM"
        title='The people<br/>who <span class="amp">run it.</span>'
        intro="50+ officers across leadership and six committees keep ACM moving. Here are some of the people behind it."
      />
      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <div className="cmt-group-h" style={{ marginBottom: 30 }}>
            <h3>Leadership</h3><span className="mono gmeta">EXECUTIVE BOARD</span>
          </div>
          <Reveal className="off-grid" stagger gap={40}>
            {leadership.map((o, i) => <OfficerCard key={i} o={o} />)}
          </Reveal>

          {byCmt.map((g) => (
            <div key={g.name} style={{ marginTop: "clamp(48px,7vw,80px)" }}>
              <div className="cmt-group-h" style={{ marginBottom: 30 }}>
                <h3>{g.name}</h3>
                <Link to={"/" + g.name.toLowerCase()} className="mono gmeta" style={{ color: "var(--text-faint)" }}>VIEW COMMITTEE →</Link>
              </div>
              <Reveal className="off-grid" stagger gap={40}>
                {g.people.map((o, i) => <OfficerCard key={i} o={o} />)}
              </Reveal>
            </div>
          ))}

          <div style={{ marginTop: "clamp(56px,8vw,96px)" }}>
            <div className="cmt-group-h" style={{ marginBottom: 30 }}>
              <h3>Alumni</h3><span className="mono gmeta">WHERE THEY LANDED</span>
            </div>
            <Reveal className="off-grid" stagger gap={40}>
              {alumni.map((a, i) => (
                <div className="off-card" key={i}>
                  <div className="off-photo"><Ph label={a.name} /></div>
                  <div>
                    <div className="off-name">{a.name}</div>
                    <div className="off-role">{a.now}</div>
                    <div className="off-cmt">{a.role}</div>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------- CONTACT -------------------------------- */
function ContactPage() {
  const [fire, toast] = useToast();
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); setSent(true); fire("Message sent (demo). We'll be in touch"); };
  const applies = [
    { t: "Committee member", d: "Join a Create or Research dev/research team. Applications open each semester.", k: "CREATE · RESEARCH" },
    { t: "Mentor or mentee", d: "Get paired through Educate's mentor/mentee program, or sign up to mentor.", k: "EDUCATE" },
    { t: "Officer & director roles", d: "Help run Marketing, Outreach, or Community. Roles open between semesters.", k: "STAFF COMMITTEES" },
  ];
  return (
    <main>
      <PageTop
        tag="GET IN TOUCH"
        title='Come say <span class="amp">hi.</span>'
        intro="Questions, sponsorship, or you just want in? Reach out, or find us where we already are."
      />
      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap ct-grid">
          {/* left: ways to reach + apply */}
          <Reveal>
            <span className="tag mono" style={{ marginBottom: 8, display: "inline-flex" }}><span className="node"></span>WHERE TO FIND US</span>
            <div className="contact-line"><span className="cl-k">Discord</span><a className="cl-v" href="https://discord.com" target="_blank" rel="noreferrer">discord.gg/acmuta</a></div>
            <div className="contact-line"><span className="cl-k">Email</span><a className="cl-v" href="mailto:acm@uta.edu">acm@uta.edu</a></div>
            <div className="contact-line"><span className="cl-k">Instagram</span><a className="cl-v" href="https://instagram.com" target="_blank" rel="noreferrer">@acm.uta</a></div>
            <div className="contact-line"><span className="cl-k">We meet</span><span className="cl-v">ERB, UT Arlington · most weeks</span></div>

            <div style={{ marginTop: 44 }}>
              <span className="tag mono" style={{ marginBottom: 18, display: "inline-flex" }}><span className="node"></span>WAYS TO GET INVOLVED</span>
              {applies.map((a, i) => (
                <div className="apply-row" key={i}>
                  <span className="anum">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{a.t}</h4>
                    <p>{a.d}</p>
                    <span className="mono" style={{ color: "var(--text-faint)", fontSize: "0.62rem", marginTop: 6, display: "inline-block" }}>{a.k}</span>
                  </div>
                </div>
              ))}
              <p style={{ color: "var(--text-faint)", fontSize: "0.85rem", marginTop: 18 }}>Applications open in a Google Form each semester. You sign in with your Mavs email to apply.</p>
            </div>
          </Reveal>

          {/* right: form */}
          <Reveal>
            <div className="involve-card">
              <h4 style={{ marginBottom: 18 }}>Send a message</h4>
              <form onSubmit={submit}>
                <div className="field"><label>Name</label><input required placeholder="Your name" /></div>
                <div className="field"><label>Mavs email</label><input required type="email" placeholder="you@mavs.uta.edu" /></div>
                <div className="field"><label>What's up?</label><textarea required placeholder="Tell us what you're thinking…" /></div>
                <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
                  {sent ? "Sent ✓" : "Send message"} <Arrow s={13} />
                </button>
              </form>
              <p style={{ color: "var(--text-faint)", fontSize: "0.78rem", marginTop: 14, textAlign: "center" }}>Visual demo, not wired to a backend.</p>
            </div>
          </Reveal>
        </div>
      </section>
      {toast}
    </main>
  );
}

/* --------------------------------- 404 ---------------------------------- */
function NotFoundPage() {
  return (
    <main>
      <section className="nf">
        <div className="nf-canvas"><NodeField density={0.6} /></div>
        <div className="wrap nf-in">
          <span className="tag mono" style={{ justifyContent: "center", marginBottom: 18 }}><span className="node"></span>BROKEN LINK · LOST NODE</span>
          <h1 className="nf-code display">4<span className="amp">0</span>4</h1>
          <p style={{ color: "var(--text-dim)", fontSize: "1.2rem", margin: "20px auto 30px", maxWidth: "32ch" }}>This page isn't connected to anything. Even our graph has dead ends.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-primary">Back home <Arrow /></Link>
            <Link to="/events" className="btn btn-ghost">See events <Arrow /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { EventsPage, GalleryPage, AlbumPage, OfficersPage, ContactPage, NotFoundPage });
