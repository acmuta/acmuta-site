import { Ph } from "@/components/Placeholder";
import { Arrow } from "@/components/icons";
import type { Project } from "@/lib/api";

/** Matches .proj-grid columns inside the 1320px wrap; feat spans two columns */
const CARD_SIZES = "(min-width: 1040px) 30vw, (min-width: 640px) 50vw, 100vw";
const FEAT_SIZES = "(min-width: 1040px) 63vw, (min-width: 640px) 50vw, 100vw";

interface ProjectCardProps {
  p: Project;
  feat?: boolean;
}

export function ProjectCard({ p, feat }: ProjectCardProps) {
  const srcSet = p.image.endsWith("-1280.webp")
    ? `${p.image.replace("-1280.webp", "-640.webp")} 640w, ${p.image} 1280w`
    : undefined;
  return (
    <article className={`proj-card${feat ? " feat" : ""}`}>
      <div className="proj-img">
        <Ph label={p.title} src={p.image} srcSet={srcSet} sizes={srcSet ? (feat ? FEAT_SIZES : CARD_SIZES) : undefined} alt={p.title} />
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
