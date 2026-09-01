import { Ph } from "@/components/Placeholder";
import { Arrow } from "@/components/icons";
import type { Project } from "@/lib/api";

interface ProjectCardProps {
  p: Project;
  feat?: boolean;
}

export function ProjectCard({ p, feat }: ProjectCardProps) {
  return (
    <article className={`proj-card${feat ? " feat" : ""}`}>
      <div className="proj-img">
        <Ph label={p.title} src={p.image} alt={p.title} />
      </div>
      <div className="proj-meta mono">
        <span className="proj-cmt">{p.committee}</span>
        <span className="proj-year">{p.year}</span>
      </div>
      <h3 className="proj-title">{p.title}</h3>
      <p className="proj-sum">{p.summary}</p>
      <div className="proj-links">
        {p.websiteUrl && (
          <a href={p.websiteUrl} target="_blank" rel="noreferrer">
            Live site <Arrow s={13} />
          </a>
        )}
        {p.codeUrl && (
          <a href={p.codeUrl} target="_blank" rel="noreferrer">
            Code <Arrow s={13} />
          </a>
        )}
      </div>
    </article>
  );
}
