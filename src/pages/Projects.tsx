import { useState, useEffect } from "react";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { PageLoading } from "@/components/Loading";
import { getProjects, type Project } from "@/lib/api";

const Projects = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  if (!projects) return <PageLoading />;

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              WHAT WE'VE BUILT
            </span>
            <h1 className="page-h1">
              Real things,
              <br />
              real <span className="amp">users.</span>
            </h1>
            <p className="page-intro">
              Members don't just learn to code, they ship. Tools thousands of UTA
              students actually use, open-source and built in our committees.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(28px,4vw,48px)" }}>
        <div className="wrap">
          <Reveal className="proj-grid" stagger gap={50}>
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p} feat={p.featured} />
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Projects;
