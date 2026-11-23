import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { PageLoading } from "@/components/Loading";
import { CreateGalleryMedia } from "@/components/CreateGalleryMedia";
import { Arrow, BackIcon } from "@/components/icons";
import {
  getCreateGallery,
  type CreateGalleryEntry,
  type CreateGallerySemester,
  type CreateShowcase,
} from "@/lib/api";

// Parse YYYY-MM-DD as a local calendar date; `new Date("2025-12-01")` is UTC
// midnight and renders as the previous day in US time zones.
function localDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isUpcoming(showcase: CreateShowcase): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return localDate(showcase.date) >= today;
}

function formatShowcaseDate(iso: string): string {
  return localDate(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function indexStatus(s: CreateGallerySemester): string {
  if (s.entries.length > 0) return `${s.entries.length} ${s.entries.length === 1 ? "project" : "projects"}`;
  if (s.showcase && isUpcoming(s.showcase)) {
    return `Showcase ${localDate(s.showcase.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
  return "In review";
}

function emptyMessage(s: CreateGallerySemester): string {
  if (s.showcase && isUpcoming(s.showcase)) {
    return `Teams present at the ${s.showcase.name} on ${localDate(s.showcase.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })}. Their projects go up here once each team approves its screenshots and credits.`;
  }
  return "Projects from this semester go up here once each team approves its screenshots and credits.";
}

function GalleryEntry({ e }: { e: CreateGalleryEntry }) {
  const titleId = `${e.id}-title`;
  return (
    <article className="cg-proj" aria-labelledby={titleId}>
      <CreateGalleryMedia media={e.media} />
      <div className="cg-body">
        <h3 id={titleId} className="cg-title">
          {e.title}
        </h3>
        {e.stack.length > 0 && (
          <ul className="cg-stack mono" aria-label="Built with">
            {e.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <p className="cg-sum">{e.summary}</p>
        {e.semesterWork && <p className="cg-work">{e.semesterWork}</p>}

        {e.credits.length > 0 ? (
          <div className="cg-credits">
            <h4>Who built what</h4>
            <dl>
              {e.credits.map((c) => (
                <div key={c.name}>
                  <dt>{c.name}</dt>
                  <dd>{c.contribution}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="cg-work">Individual credits go up once team members confirm them.</p>
        )}

        {(e.demoUrl || e.repoUrl) && (
          <div className="proj-links">
            {e.demoUrl && (
              <a href={e.demoUrl} target="_blank" rel="noreferrer">
                Try it <Arrow s={13} />
              </a>
            )}
            {e.repoUrl && (
              <a href={e.repoUrl} target="_blank" rel="noreferrer">
                Code <Arrow s={13} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

const CreateGallery = () => {
  const [semesters, setSemesters] = useState<CreateGallerySemester[] | null>(null);

  useEffect(() => {
    getCreateGallery().then(setSemesters);
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = "Create project gallery · ACM at UTA";
    return () => {
      document.title = previous;
    };
  }, []);

  if (!semesters) return <PageLoading />;

  return (
    <div className="cg">
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <Link to="/create" className="mono cg-back">
              <BackIcon s={14} />
              Create committee
            </Link>
            <h1 className="page-h1">
              Built in <span className="amp">Create.</span>
            </h1>
            <p className="page-intro">
              What Create teams shipped each semester, and who built which part.
            </p>
            <nav className="cg-index" aria-label="Semesters">
              <ul>
                {semesters.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>
                      <span className="cg-index-term">{s.label}</span>
                      <span className="mono cg-index-n">{indexStatus(s)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </section>

      {semesters.map((s) => (
        <section key={s.id} id={s.id} className="cg-sem" aria-labelledby={`${s.id}-h`}>
          <div className="wrap">
            <Reveal className="cg-sem-h">
              <h2 id={`${s.id}-h`} className="cg-sem-title">
                {s.label}
              </h2>
              {s.showcase && (
                <p className="cg-sem-meta mono">
                  <a href={s.showcase.sourceUrl} target="_blank" rel="noreferrer">
                    {s.showcase.name} <Arrow s={11} />
                  </a>
                  <span className="tnum">{formatShowcaseDate(s.showcase.date)}</span>
                  {s.showcase.location && <span>{s.showcase.location}</span>}
                </p>
              )}
            </Reveal>
            {s.entries.length > 0 ? (
              <ul className="cg-list">
                {s.entries.map((e) => (
                  <li key={e.id}>
                    <GalleryEntry e={e} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cg-empty">{emptyMessage(s)}</p>
            )}
          </div>
        </section>
      ))}

      <section className="section cg-foot">
        <div className="wrap">
          <p>
            Credits name specific work that a team member shared publicly or approved for this page.
            Built something here, or spotted a mistake?{" "}
            <Link to="/contact">Tell the Create directors</Link>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default CreateGallery;
