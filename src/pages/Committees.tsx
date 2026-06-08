import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { CommitteeLogo } from "@/components/CommitteeLogo";
import { PageLoading } from "@/components/Loading";
import { Arrow } from "@/components/icons";
import { getCommittees, type Committee } from "@/lib/api";

const GROUPS = [
  {
    key: "application" as const,
    title: "Build teams",
    meta: "BY APPLICATION",
    note: "Small teams you apply to join. You ship real work over the semester.",
  },
  {
    key: "program" as const,
    title: "Open program",
    meta: "NO APPLICATION",
    note: "Open to everyone. Workshops, career prep, and mentorship.",
  },
  {
    key: "staff" as const,
    title: "Staff committees",
    meta: "OFFICER + DIRECTOR ROLES",
    note: "The teams that run the org. Jump in by showing up.",
  },
];

function CommitteeRow({ c, index }: { c: Committee; index: number }) {
  return (
    <Link to={`/${c.slug}`} className="cmt-row">
      <div className="cmt-logo ph" data-ph="" style={{ borderRadius: 3 }}>
        <CommitteeLogo committee={c} size={26} />
      </div>
      <div>
        <div className="cmt-idx mono">
          {String(index + 1).padStart(2, "0")} / {c.tag}
        </div>
        <div className="cmt-name">
          {c.name}
          <span className={`cmt-kind mono${c.kind === "application" ? " kind-active" : ""}`}>
            {c.kind === "application" ? "APPLY" : c.kind === "program" ? "OPEN" : "STAFF"}
          </span>
        </div>
      </div>
      <div className="cmt-sum">{c.summary}</div>
      <div className="cmt-go">
        <Arrow s={22} />
      </div>
    </Link>
  );
}

const Committees = () => {
  const [committees, setCommittees] = useState<Committee[] | null>(null);

  useEffect(() => {
    getCommittees().then(setCommittees);
  }, []);

  if (!committees) return <PageLoading />;

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              SIX COMMITTEES · ONE ORG
            </span>
            <h1 className="page-h1">
              Find your
              <br />
              <span className="amp">corner.</span>
            </h1>
            <p className="page-intro">
              ACM runs on six committees. Some you apply to, some you just show up
              for. They all add up to one place to build, learn, and belong.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "clamp(20px,4vw,40px)" }}>
        <div className="wrap">
          {GROUPS.map((g) => {
            const items = committees.filter((c) => c.kind === g.key);
            return (
              <div className="cmt-group" key={g.key}>
                <div className="cmt-group-h">
                  <h3>{g.title}</h3>
                  <span className="mono gmeta">{g.meta}</span>
                </div>
                <p style={{ color: "var(--text-dim)", maxWidth: "60ch", margin: "16px 0 8px" }}>
                  {g.note}
                </p>
                <Reveal className="cmt-list" stagger gap={55}>
                  {items.map((c) => (
                    <CommitteeRow key={c.id} c={c} index={committees.indexOf(c)} />
                  ))}
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Committees;
