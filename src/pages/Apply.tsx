import { Reveal } from "@/components/Reveal";
import { CommitteeMark } from "@/components/CommitteeLogo";
import { Arrow } from "@/components/icons";

interface ApplyItem {
  name: string;
  markId: string;
  kind: "member" | "officer";
  meta: string;
  desc: string;
  cta: string;
  href: string;
}

function ApplyCard({ item }: { item: ApplyItem }) {
  const isOfficer = item.kind === "officer";
  return (
    <div className={`trk-card${isOfficer ? " officer" : " member"}`}>
      <div className="trk-card-top">
        <span className={`trk-badge ${isOfficer ? "b-officer" : "b-member"}`}>
          {isOfficer ? "OFFICER" : "MEMBER"}
        </span>
        {item.meta && <span className="trk-meta mono">{item.meta}</span>}
      </div>
      <div className="trk-mark">
        <CommitteeMark id={item.markId} size={26} />
      </div>
      <h3 className="trk-name">{item.name}</h3>
      <p className="trk-desc">{item.desc}</p>
      <a
        className={`btn ${isOfficer ? "btn-ghost" : "btn-primary"}`}
        href={item.href}
        target="_blank"
        rel="noreferrer"
      >
        {item.cta} <Arrow s={13} />
      </a>
    </div>
  );
}

const MEMBERS: ApplyItem[] = [
  {
    name: "Create",
    markId: "create",
    kind: "member",
    meta: "DEV TEAMS",
    desc: "Apply to join a Create dev team and ship a real product over the semester, working in a shared repo with code review.",
    cta: "Apply to Create",
    href: "https://forms.google.com",
  },
  {
    name: "Research",
    markId: "research",
    kind: "member",
    meta: "RESEARCH TEAMS",
    desc: "Apply to join a Research team, read papers, reproduce results, and work toward something publishable.",
    cta: "Apply to Research",
    href: "https://forms.google.com",
  },
  {
    name: "Mentor / Mentee",
    markId: "educate",
    kind: "member",
    meta: "EDUCATE PROGRAM",
    desc: "Get paired through Educate's program. Apply as a mentee to be matched with someone who's been through it, or as a mentor to guide newer students.",
    cta: "Apply to the program",
    href: "https://forms.google.com",
  },
];

const OFFICER_COMMITTEES = [
  { name: "Create", markId: "create" },
  { name: "Research", markId: "research" },
  { name: "Educate", markId: "educate" },
  { name: "Marketing", markId: "marketing" },
  { name: "Outreach", markId: "outreach" },
  { name: "Community", markId: "community" },
];

const Apply = () => (
  <div>
    <section className="page-top">
      <div className="wrap">
        <Reveal>
          <span className="tag mono page-eyebrow">
            <span className="node" />
            GET INVOLVED
          </span>
          <h1 className="page-h1">
            Pick a <span className="amp">track.</span>
          </h1>
          <p className="page-intro">
            There are two ways in: join a committee as a{" "}
            <b style={{ color: "var(--text)" }}>member</b>, or apply for an{" "}
            <b style={{ color: "var(--text)" }}>officer</b> role and help run one.
            Pick the track that fits.
          </p>
          <span className="apply-note">
            You sign in with your <code>@mavs.uta.edu</code> email before applying.
          </span>
        </Reveal>
      </div>
    </section>

    {/* Track 1 — Membership */}
    <section
      className="section"
      style={{
        paddingTop: "clamp(32px,5vw,56px)",
        paddingBottom: "clamp(20px,3vw,36px)",
      }}
    >
      <div className="wrap">
        <Reveal className="trk-head">
          <div className="trk-head-l">
            <span className="trk-tracknum mono">TRACK 01</span>
            <h2 className="trk-title">Join a committee</h2>
            <span className="trk-badge b-member trk-title-badge">
              MEMBER APPLICATIONS
            </span>
          </div>
          <p className="trk-head-copy">
            For students who want to be on a team, build, learn, and show up.
            Membership applications open each semester.
          </p>
        </Reveal>
        <Reveal className="trk-grid" stagger gap={55}>
          {MEMBERS.map((m, i) => (
            <ApplyCard key={i} item={m} />
          ))}
        </Reveal>
      </div>
    </section>

    {/* Track 2 — Officer */}
    <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
      <div className="wrap">
        <Reveal className="trk-head trk-head-officer">
          <div className="trk-head-l">
            <span className="trk-tracknum mono">TRACK 02</span>
            <h2 className="trk-title">Become an officer</h2>
            <span className="trk-badge b-officer trk-title-badge">
              OFFICER APPLICATIONS
            </span>
          </div>
          <p className="trk-head-copy">
            For students ready to lead, plan events, run a team, and shape the org.
            Apply for an officer role on any committee with openings.
          </p>
        </Reveal>
        <Reveal className="trk-grid trk-grid-officer" stagger gap={45}>
          {OFFICER_COMMITTEES.map((c, i) => (
            <ApplyCard
              key={i}
              item={{
                name: c.name,
                markId: c.markId,
                kind: "officer",
                meta: "OFFICER ROLE",
                desc: `Apply for an officer or director role on ${c.name}. Help run events, projects, and the day-to-day.`,
                cta: `Apply for ${c.name}`,
                href: "https://forms.google.com",
              }}
            />
          ))}
        </Reveal>
        <p style={{ color: "var(--text-faint)", fontSize: "0.85rem", marginTop: 26 }}>
          Application forms open each semester. Apply links are placeholders — Supabase
          auth coming soon.
        </p>
      </div>
    </section>
  </div>
);

export default Apply;
