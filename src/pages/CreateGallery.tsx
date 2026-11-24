import { useEffect, useRef, useState } from "react";
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

function ProjectLinks({ e }: { e: CreateGalleryEntry }) {
  if (!e.demoUrl && !e.repoUrl && !e.extraLinks?.length) return null;
  return (
    <div className="proj-links">
      {e.demoUrl && (
        <a href={e.demoUrl} target="_blank" rel="noreferrer">
          Live site <Arrow s={13} />
        </a>
      )}
      {e.repoUrl && (
        <a href={e.repoUrl} target="_blank" rel="noreferrer">
          Code <Arrow s={13} />
        </a>
      )}
      {e.extraLinks?.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noreferrer">
          {l.label} <Arrow s={13} />
        </a>
      ))}
    </div>
  );
}

function ProjectDialog({ e, term, onClose }: { e: CreateGalleryEntry; term: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `${e.id}-dlg-title`;

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    dlg.showModal();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      if (dlg.open) dlg.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="cg-dlg"
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the backdrop lands on the <dialog> element itself, not its content.
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) onClose();
      }}
    >
      <div className="cg-dlg-inner">
        <button type="button" className="cg-dlg-x" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <CreateGalleryMedia media={e.media} />
        <div className="proj-meta mono">
          <span className="proj-cmt">CREATE</span>
          <span className="proj-year">{term}</span>
        </div>
        <h2 id={titleId} className="cg-dlg-title">
          {e.title}
        </h2>
        <p className="cg-dlg-sum">{e.summary}</p>
        {e.semesterWork && <p className="cg-work">{e.semesterWork}</p>}
        {e.stack.length > 0 && (
          <ul className="cg-stack mono" aria-label="Built with">
            {e.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <ProjectLinks e={e} />

        <section className="cg-team" aria-labelledby={`${titleId}-team`}>
          <h3 id={`${titleId}-team`}>Team</h3>
          {e.credits.length > 0 ? (
            <ul>
              {e.credits.map((c) => (
                <li key={c.name}>
                  <div className="cg-team-head">
                    <span className="cg-team-name">{c.name}</span>
                    {c.role && <span className="mono cg-team-role">{c.role}</span>}
                  </div>
                  <p>{c.contribution}</p>
                  {(c.linkedin || c.github) && (
                    <div className="cg-team-links mono">
                      {c.linkedin && (
                        <a href={c.linkedin} target="_blank" rel="noreferrer" aria-label={`${c.name} on LinkedIn`}>
                          LinkedIn <Arrow s={11} />
                        </a>
                      )}
                      {c.github && (
                        <a href={c.github} target="_blank" rel="noreferrer" aria-label={`${c.name} on GitHub`}>
                          GitHub <Arrow s={11} />
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="cg-work">Individual credits go up once team members confirm them.</p>
          )}
        </section>
      </div>
    </dialog>
  );
}

function GalleryEntry({ e, term, onOpen }: { e: CreateGalleryEntry; term: string; onOpen: () => void }) {
  const titleId = `${e.id}-title`;
  return (
    <article className="proj-card cg-card" aria-labelledby={titleId}>
      <CreateGalleryMedia media={e.media} />
      <div className="proj-meta mono">
        <span className="proj-cmt">CREATE</span>
        <span className="proj-year">{term}</span>
      </div>
      <h3 id={titleId} className="proj-title">
        {/* Stretched over the whole card so any click opens the project window. */}
        <button type="button" className="cg-open" onClick={onOpen} aria-haspopup="dialog">
          {e.title}
        </button>
      </h3>
      <p className="proj-sum">{e.summary}</p>
      <p className="cg-team-count mono">
        {e.credits.length > 0 ? `${e.credits.length} team ${e.credits.length === 1 ? "member" : "members"}` : "Team pending"}
        {" · "}View project
      </p>
      <ProjectLinks e={e} />
    </article>
  );
}

const CreateGallery = () => {
  const [semesters, setSemesters] = useState<CreateGallerySemester[] | null>(null);
  const [open, setOpen] = useState<{ e: CreateGalleryEntry; term: string } | null>(null);

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
              <ul className="cg-list proj-grid">
                {s.entries.map((e) => (
                  <li key={e.id}>
                    <GalleryEntry e={e} term={s.label} onOpen={() => setOpen({ e, term: s.label })} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="cg-empty">{emptyMessage(s)}</p>
            )}
          </div>
        </section>
      ))}

      {open && <ProjectDialog e={open.e} term={open.term} onClose={() => setOpen(null)} />}

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
