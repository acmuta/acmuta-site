import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { CommitteeMark } from "@/components/CommitteeLogo";
import { Arrow } from "@/components/icons";
import { PageLoading } from "@/components/Loading";
import { getApplicationFormSummaries, TERM_LABEL } from "@/lib/api";
import type { ApplicationFormSummary, ApplicationType } from "@/lib/api";

const MEMBERSHIP_TYPES: ApplicationType[] = ["member", "mentor", "mentee"];

export default function ApplyDetail() {
  const { committeeSlug, track } = useParams<{ committeeSlug: string; track: string }>();
  const [forms, setForms] = useState<ApplicationFormSummary[] | null>(null);

  useEffect(() => {
    getApplicationFormSummaries().then(setForms);
  }, []);

  if (track !== "membership" && track !== "officer") {
    return <Navigate to="/apply" replace />;
  }

  if (forms === null) return <PageLoading />;

  const matching = forms.filter(
    (f) =>
      f.committee_slug === committeeSlug &&
      (track === "officer" ? f.application_type === "officer" : MEMBERSHIP_TYPES.includes(f.application_type))
  );

  if (matching.length === 0) return <Navigate to="/apply" replace />;

  const isOfficer = track === "officer";
  const committeeName = matching[0].committee_name;

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <Link
              to="/apply"
              className="mono"
              style={{ color: "var(--text-faint)", display: "inline-flex", gap: 8, marginBottom: 26 }}
            >
              ← ALL TRACKS
            </Link>
            <div className="trk-mark" style={{ marginBottom: 18 }}>
              <CommitteeMark id={committeeSlug ?? ""} size={26} />
            </div>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              {isOfficer ? "OFFICER APPLICATIONS" : "MEMBER APPLICATIONS"}
            </span>
            <h1 className="page-h1">
              {committeeName} <span className="amp">{isOfficer ? "officer" : "membership"}.</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Reveal className="apd-list" stagger gap={40}>
            {matching.map((f) => (
              <div key={f.id} className="apd-card">
                <div className="apd-card-info">
                  <span className="apd-card-meta mono">
                    {TERM_LABEL[f.term].toUpperCase()} {f.year}
                  </span>
                  <h3 className="apd-card-title">{f.title}</h3>
                  {f.description && <p className="apd-card-desc">{f.description}</p>}
                </div>
                {f.effective_open ? (
                  <Link className="btn btn-primary apd-card-btn" to={`/apply/${committeeSlug}/${track}/${f.id}`}>
                    Apply <Arrow s={13} />
                  </Link>
                ) : (
                  <span className="trk-closed">Applications closed</span>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
