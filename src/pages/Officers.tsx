import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { Ph } from "@/components/Placeholder";
import { PageLoading } from "@/components/Loading";
import { IgIcon, LiIcon, Arrow } from "@/components/icons";
import {
  getOfficers,
  getAlumni,
  getHallOfFame,
  type Officer,
  type Alumni,
  type HallOfFameMember,
} from "@/lib/api";

const COMMITTEE_ORDER = [
  "Create", "Research", "Educate", "Marketing", "Outreach", "Community",
];

function OfficerSocials({ o }: { o: Officer }) {
  if (!o.instagram && !o.linkedin) return null;
  return (
    <div className="off-socials">
      {o.instagram && (
        <a
          href={`https://instagram.com/${o.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="off-social"
          aria-label={`${o.name} on Instagram`}
          onClick={(e) => e.stopPropagation()}
        >
          <IgIcon s={15} />
        </a>
      )}
      {o.linkedin && (
        <a
          href={o.linkedin.startsWith("http") ? o.linkedin : `https://linkedin.com/in/${o.linkedin}`}
          target="_blank"
          rel="noreferrer"
          className="off-social"
          aria-label={`${o.name} on LinkedIn`}
          onClick={(e) => e.stopPropagation()}
        >
          <LiIcon s={15} />
        </a>
      )}
    </div>
  );
}

function OfficerCard({ o }: { o: Officer }) {
  return (
    <div className="off-card">
      <div className="off-photo">
        <Ph label={o.name} src={o.photo} alt={o.name} />
      </div>
      <div className="off-info">
        <div className="off-name">{o.name}</div>
        <div className="off-role">{o.role}</div>
        <OfficerSocials o={o} />
      </div>
    </div>
  );
}

function HofCard({ m }: { m: HallOfFameMember }) {
  return (
    <div className="hof-card">
      <div className="hof-photo">
        <Ph label={m.name} src={m.photo} alt={m.name} />
      </div>
      <div className="hof-body">
        <div>
          <div className="hof-name">{m.name}</div>
          <div className="hof-role">{m.role}</div>
          <div className="hof-years mono">{m.years}</div>
        </div>
        <p className="hof-impact">{m.impact}</p>
        {m.linkedin && (
          <a
            href={m.linkedin.startsWith("http") ? m.linkedin : `https://linkedin.com/in/${m.linkedin}`}
            target="_blank"
            rel="noreferrer"
            className="hof-linkedin"
          >
            <LiIcon s={14} /> LinkedIn <Arrow s={11} />
          </a>
        )}
      </div>
    </div>
  );
}

const Officers = () => {
  const [officers, setOfficers] = useState<Officer[] | null>(null);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [hallOfFame, setHallOfFame] = useState<HallOfFameMember[]>([]);

  useEffect(() => {
    getOfficers().then(setOfficers);
    getAlumni().then(setAlumni);
    getHallOfFame().then(setHallOfFame);
  }, []);

  if (!officers) return <PageLoading />;

  const leadership = officers.filter((o) => o.tier === "exec");
  const byCmt = COMMITTEE_ORDER.map((name) => ({
    name,
    people: officers.filter((o) => o.committee === name),
  })).filter((g) => g.people.length > 0);

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              THE TEAM
            </span>
            <h1 className="page-h1">
              The people
              <br />
              who <span className="amp">run it.</span>
            </h1>
            <p className="page-intro">
              50+ officers across leadership and six committees keep ACM moving.
              Here are some of the people behind it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(40px,6vw,64px)" }}>
        <div className="wrap">
          {/* Leadership */}
          <div className="cmt-group-h" style={{ marginBottom: 36 }}>
            <h3>Leadership</h3>
            <span className="mono gmeta">EXECUTIVE BOARD</span>
          </div>
          <Reveal className="off-grid" stagger gap={40}>
            {leadership.map((o) => (
              <OfficerCard key={o.id} o={o} />
            ))}
          </Reveal>

          {/* Per-committee */}
          {byCmt.map((g) => (
            <div key={g.name} style={{ marginTop: "clamp(56px,8vw,88px)" }}>
              <div className="cmt-group-h" style={{ marginBottom: 36 }}>
                <h3>{g.name}</h3>
                <Link
                  to={`/${g.name.toLowerCase()}`}
                  className="mono gmeta"
                  style={{ color: "var(--text-faint)" }}
                >
                  VIEW COMMITTEE →
                </Link>
              </div>
              <Reveal className="off-grid" stagger gap={40}>
                {g.people.map((o) => (
                  <OfficerCard key={o.id} o={o} />
                ))}
              </Reveal>
            </div>
          ))}

          {/* Alumni */}
          {alumni.length > 0 && (
            <div style={{ marginTop: "clamp(56px,8vw,96px)" }}>
              <div className="cmt-group-h" style={{ marginBottom: 36 }}>
                <h3>Alumni</h3>
                <span className="mono gmeta">WHERE THEY LANDED</span>
              </div>
              <Reveal className="off-grid" stagger gap={40}>
                {alumni.map((a) => (
                  <div className="off-card" key={a.id}>
                    <div className="off-photo">
                      <Ph label={a.name} src={a.photo} alt={a.name} />
                    </div>
                    <div>
                      <div className="off-name">{a.name}</div>
                      <div className="off-role">{a.now}</div>
                      <div className="off-cmt">{a.role}</div>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          )}

          {/* Hall of Fame */}
          {hallOfFame.length > 0 && (
            <div className="hof-section">
              <Reveal>
                <div className="hof-eyebrow">
                  <span className="hof-star">★</span>
                  <span className="tag mono" style={{ display: "inline-flex" }}>
                    <span className="node" />
                    ACM HALL OF FAME
                  </span>
                </div>
                <h2
                  className="sec-title"
                  style={{ fontSize: "clamp(2rem,5vw,3.5rem)", marginBottom: 8 }}
                >
                  Those who shaped <span className="amp">the org.</span>
                </h2>
                <p style={{ color: "var(--text-dim)", maxWidth: "52ch", fontSize: "1rem" }}>
                  A curated recognition of exceptional officers whose contributions left
                  a lasting mark on ACM at UTA - past and present.
                </p>
              </Reveal>
              <Reveal className="hof-grid" stagger gap={60}>
                {hallOfFame.map((m) => (
                  <HofCard key={m.id} m={m} />
                ))}
              </Reveal>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Officers;
