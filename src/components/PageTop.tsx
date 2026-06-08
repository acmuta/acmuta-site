import { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface PageTopProps {
  tag?: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}

export function PageTop({ tag, title, intro, children }: PageTopProps) {
  return (
    <section className="page-top">
      <div className="wrap">
        <Reveal>
          {tag && (
            <span className="tag mono">
              <span className="node" />
              {tag}
            </span>
          )}
          <h1 className="page-h1 display">{title}</h1>
          {intro && <p className="page-intro">{intro}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
