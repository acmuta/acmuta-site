import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { CommitteeLogo } from "@/components/CommitteeLogo";
import { ProjectCard } from "@/components/ProjectCard";
import { Ph } from "@/components/Placeholder";
import { PageLoading } from "@/components/Loading";
import { Arrow, IgIcon, LiIcon } from "@/components/icons";
import { getCommittee, getProjects, getOfficers, type Committee, type Project, type Officer } from "@/lib/api";

interface CommitteePageProps {
  slug: string;
}

function DirectorCard({ o }: { o: Officer }) {
  return (
    <div className="off-card">
      <div className="off-photo">
        <Ph label={o.name} src={o.photo} alt={o.name} />
      </div>
      <div className="off-info">
        <div className="off-name">{o.name}</div>
        <div className="off-role">{o.role}</div>
        {(o.instagram || o.linkedin) && (
          <div className="off-socials">
            {o.instagram && (
              <a
                href={`https://instagram.com/${o.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="off-social"
                aria-label={`${o.name} on Instagram`}
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
              >
                <LiIcon s={15} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommitteePage({ slug }: CommitteePageProps) {
  const [committee, setCommittee] = useState<Committee | null | undefined>(undefined);
  const [projects, setProjects] = useState<Project[]>([]);
  const [directors, setDirectors] = useState<Officer[]>([]);

  useEffect(() => {
    getCommittee(slug).then(setCommittee);
    getProjects().then(setProjects);
    getOfficers().then((all) => {
      const dirs = all.filter(
        (o) => o.committee.toLowerCase() === slug.toLowerCase() && o.tier === "director"
      );
      setDirectors(dirs);
    });
  }, [slug]);

  if (committee === undefined) return <PageLoading />;
  if (!committee) {
    return (
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <p style={{ color: "var(--text-dim)" }}>Committee not found.</p>
      </div>
    );
  }

  const related = projects.filter(
    (p) => p.committee.toLowerCase() === committee.name.toLowerCase()
  );
  const kindLabel =
    committee.kind === "application"
      ? "APPLICATION REQUIRED"
      : committee.kind === "program"
      ? "OPEN TO ALL"
      : "STAFF COMMITTEE";

  return (
    <div>
      {/* ── Committee hero ── */}
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <Link
              to="/committees"
              className="mono"
              style={{
                color: "var(--text-faint)",
                display: "inline-flex",
                gap: 8,
                marginBottom: 26,
              }}
            >
              ← ALL COMMITTEES
            </Link>
            <div className="cd-hero">
              <div>
                <div className="cd-logo">
                  <CommitteeLogo committee={committee} size={72} />
                </div>
                <span
                  className="tag mono"
                  style={{ marginBottom: 18, display: "inline-flex" }}
                >
                  <span className="node" />
                  {kindLabel} · {committee.tag}
                </span>
                <h1
                  className="page-h1"
                  style={{ fontSize: "clamp(3rem,12vw,8rem)" }}
                >
                  {committee.name}
                  <span className="amp">.</span>
                </h1>
              </div>
              <div>
                <p className="cd-desc">{committee.summary}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Description + doing ── */}
      <section className="section">
        <div className="wrap cd-grid">
          <Reveal>
            <span
              className="tag mono"
              style={{ marginBottom: 22, display: "inline-flex" }}
            >
              <span className="node" />
              THE WHOLE STORY
            </span>
            <p
              style={{
                fontSize: "1.15rem",
                color: "var(--text-dim)",
                lineHeight: 1.6,
                maxWidth: "46ch",
              }}
            >
              {committee.description}
            </p>
          </Reveal>
          <Reveal>
            <span
              className="tag mono"
              style={{ marginBottom: 22, display: "inline-flex" }}
            >
              <span className="node" />
              WHAT MEMBERS DO
            </span>
            <ul className="do-list">
              {committee.doing.map((d, i) => (
                <li key={i}>
                  <span className="di">{String(i + 1).padStart(2, "0")}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Directors ── */}
      {directors.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cmt-group-h" style={{ marginBottom: 30 }}>
              <h3>
                {directors.length === 1 ? "Director" : "Directors"}
              </h3>
              <Link
                to="/officers"
                className="mono gmeta"
                style={{ color: "var(--text-faint)" }}
              >
                ALL OFFICERS →
              </Link>
            </div>
            <Reveal className="off-grid-sm" stagger gap={40}>
              {directors.map((o) => (
                <DirectorCard key={o.id} o={o} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Related projects ── */}
      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head row">
              <Reveal>
                <h2
                  className="sec-title"
                  style={{ fontSize: "clamp(1.8rem,4.5vw,3rem)" }}
                >
                  From this <span className="amp">committee.</span>
                </h2>
              </Reveal>
              <Reveal>
                <Link to="/projects" className="sec-link">
                  All projects <Arrow />
                </Link>
              </Reveal>
            </div>
            <Reveal className="proj-grid" stagger gap={60}>
              {related.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Get involved ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="involve-card" style={{ maxWidth: 720 }}>
            <h4>How to get involved</h4>
            <p>{committee.involve}</p>
            <Link to="/contact" className="btn btn-primary">
              Get involved <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
