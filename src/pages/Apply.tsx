import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { CommitteeMark } from "@/components/CommitteeLogo";
import { Arrow } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { getApplicationFormSummaries, TERM_LABEL } from "@/lib/api";
import type { ApplicationFormSummary, ApplicationTerm, ApplicationType } from "@/lib/api";

// ── Grouping helpers ─────────────────────────────────────────────────────────

interface CommitteeGroup {
  committee_id: string;
  committee_slug: string;
  committee_name: string;
  forms: ApplicationFormSummary[];
}

function groupByCommittee(forms: ApplicationFormSummary[]): CommitteeGroup[] {
  const map = new Map<string, CommitteeGroup>();
  for (const f of forms) {
    const existing = map.get(f.committee_id);
    if (existing) {
      existing.forms.push(f);
    } else {
      map.set(f.committee_id, {
        committee_id: f.committee_id,
        committee_slug: f.committee_slug,
        committee_name: f.committee_name,
        forms: [f],
      });
    }
  }
  return [...map.values()];
}

interface PairingGroup {
  key: string;
  committee_id: string;
  committee_slug: string;
  committee_name: string;
  application_type: ApplicationType;
  forms: ApplicationFormSummary[];
}

function groupPairingForms(forms: ApplicationFormSummary[]): PairingGroup[] {
  const map = new Map<string, PairingGroup>();
  for (const f of forms) {
    const key = `${f.committee_id}:${f.application_type}`;
    const existing = map.get(key);
    if (existing) {
      existing.forms.push(f);
    } else {
      map.set(key, {
        key,
        committee_id: f.committee_id,
        committee_slug: f.committee_slug,
        committee_name: f.committee_name,
        application_type: f.application_type,
        forms: [f],
      });
    }
  }
  return [...map.values()];
}

const TERM_ORDER: Record<ApplicationTerm, number> = { spring: 0, summer: 1, fall: 2 };

// Picks the form whose term/year should be shown on the card: the
// soonest-closing open form, or (if nothing is open) the most recent form.
function pickMetaForm(forms: ApplicationFormSummary[]): ApplicationFormSummary {
  const open = forms.filter((f) => f.effective_open);
  if (open.length > 0) {
    return [...open].sort((a, b) => {
      const aTime = a.closes_at ? new Date(a.closes_at).getTime() : Infinity;
      const bTime = b.closes_at ? new Date(b.closes_at).getTime() : Infinity;
      return aTime - bTime;
    })[0];
  }
  return [...forms].sort(
    (a, b) => b.year * 10 + TERM_ORDER[b.term] - (a.year * 10 + TERM_ORDER[a.term])
  )[0];
}

function membershipLabel(slug: string, name: string): string {
  if (slug === "create") return "Create Member";
  if (slug === "research") return "Research Member";
  return name;
}

function membershipDesc(slug: string, name: string): string {
  if (slug === "create")
    return "Apply to join a Create dev team and ship a real product over the semester, working in a shared repo with code review.";
  if (slug === "research")
    return "Apply to join a Research team, read papers, reproduce results, and work toward something publishable.";
  return `Apply to join ${name} as a member.`;
}

function pairingDesc(type: ApplicationType, committeeName: string, formDesc: string | null): string {
  if (formDesc && formDesc.trim()) return formDesc;
  return type === "mentor"
    ? `Apply to mentor newer students through ${committeeName}'s pairing program.`
    : `Apply to get matched with a mentor through ${committeeName}'s pairing program.`;
}

// ── Apply card ────────────────────────────────────────────────────────────────

interface ApplyCardData {
  key: string;
  committeeSlug: string;
  badge: "OFFICER" | "MEMBER";
  meta: string;
  label: string;
  desc: string;
  applyHref: string | null;
}

function ApplyCard({ data }: { data: ApplyCardData }) {
  const isOfficer = data.badge === "OFFICER";
  return (
    <div className={`trk-card${isOfficer ? " officer" : " member"}`}>
      <div className="trk-card-top">
        <span className={`trk-badge ${isOfficer ? "b-officer" : "b-member"}`}>{data.badge}</span>
        <span className="trk-meta mono">{data.meta}</span>
      </div>
      <div className="trk-mark">
        <CommitteeMark id={data.committeeSlug} size={26} />
      </div>
      <h3 className="trk-name">{data.label}</h3>
      <p className="trk-desc">{data.desc}</p>

      {data.applyHref ? (
        <Link className={`btn ${isOfficer ? "btn-ghost" : "btn-primary"}`} to={data.applyHref}>
          Apply <Arrow s={13} />
        </Link>
      ) : (
        <span className="trk-closed">Applications closed</span>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Apply() {
  const { user, profile } = useAuth();
  const [forms, setForms] = useState<ApplicationFormSummary[]>([]);

  useEffect(() => {
    getApplicationFormSummaries().then(setForms);
  }, []);

  const memberFormGroups = groupByCommittee(forms.filter((f) => f.application_type === "member"));
  const pairingGroups = groupPairingForms(
    forms.filter((f) => f.application_type === "mentor" || f.application_type === "mentee")
  );
  const officerGroups = groupByCommittee(forms.filter((f) => f.application_type === "officer"));

  const membershipCards: ApplyCardData[] = [
    ...memberFormGroups.map((g) => {
      const metaForm = pickMetaForm(g.forms);
      const anyOpen = g.forms.some((f) => f.effective_open);
      return {
        key: g.committee_id,
        committeeSlug: g.committee_slug,
        badge: "MEMBER" as const,
        meta: `${TERM_LABEL[metaForm.term].toUpperCase()} ${metaForm.year}`,
        label: membershipLabel(g.committee_slug, g.committee_name),
        desc: membershipDesc(g.committee_slug, g.committee_name),
        applyHref: anyOpen ? `/apply/${g.committee_slug}/membership` : null,
      };
    }),
    ...pairingGroups.map((g) => {
      const metaForm = pickMetaForm(g.forms);
      const anyOpen = g.forms.some((f) => f.effective_open);
      return {
        key: g.key,
        committeeSlug: g.committee_slug,
        badge: "MEMBER" as const,
        meta: `${TERM_LABEL[metaForm.term].toUpperCase()} ${metaForm.year}`,
        label: metaForm.title,
        desc: pairingDesc(g.application_type, g.committee_name, metaForm.description),
        applyHref: anyOpen ? `/apply/${g.committee_slug}/membership/${metaForm.id}` : null,
      };
    }),
  ];

  const officerCards: ApplyCardData[] = officerGroups.map((g) => {
    const metaForm = pickMetaForm(g.forms);
    const anyOpen = g.forms.some((f) => f.effective_open);
    return {
      key: g.committee_id,
      committeeSlug: g.committee_slug,
      badge: "OFFICER" as const,
      meta: `${TERM_LABEL[metaForm.term].toUpperCase()} ${metaForm.year}`,
      label: g.committee_name,
      desc: `Apply for an officer or director role on ${g.committee_name}. Help run events, projects, and the day-to-day.`,
      applyHref: anyOpen ? `/apply/${g.committee_slug}/officer` : null,
    };
  });

  const email = profile?.email ?? user?.email ?? null;

  return (
    <div>
      <section className="page-top">
        <div className="wrap">
          <Reveal>
            <span className="tag mono page-eyebrow">
              <span className="node" />
              GET INVOLVED
            </span>
            <h1 className="page-h1">
              Pick a <span className="amp">track.</span>
            </h1>
            <p className="page-intro">
              Two ways in: join a committee as a{" "}
              <b style={{ color: "var(--text)" }}>member</b>, or apply for an{" "}
              <b style={{ color: "var(--text)" }}>officer</b> role and help run one.
            </p>

            {user ? (
              <span className="apply-note apply-note--authed">
                Signed in as <strong>{email}</strong> - your profile info will be
                used to pre-fill applications automatically.
              </span>
            ) : (
              <span className="apply-note">
                <Link to="/signin" className="apply-signin-link">Sign in</Link>{" "}
                with your <code>@mavs.uta.edu</code> email before applying so your
                submission links to your profile.
              </span>
            )}
          </Reveal>
        </div>
      </section>

      {/* Track 1 - Membership */}
      <section
        className="section"
        style={{ paddingTop: "clamp(32px,5vw,56px)", paddingBottom: "clamp(20px,3vw,36px)" }}
      >
        <div className="wrap">
          <Reveal className="trk-head">
            <div className="trk-head-l">
              <span className="trk-tracknum mono">TRACK 01</span>
              <h2 className="trk-title">Join a committee</h2>
              <span className="trk-badge b-member trk-title-badge">MEMBER APPLICATIONS</span>
            </div>
            <p className="trk-head-copy">
              For students who want to be on a team, build, learn, and show up.
              Membership applications open each semester.
            </p>
          </Reveal>
          <Reveal className="trk-grid" stagger gap={55}>
            {membershipCards.map((c) => (
              <ApplyCard key={c.key} data={c} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* Track 2 - Officer */}
      <section className="section" style={{ paddingTop: "clamp(20px,3vw,36px)" }}>
        <div className="wrap">
          <Reveal className="trk-head trk-head-officer">
            <div className="trk-head-l">
              <span className="trk-tracknum mono">TRACK 02</span>
              <h2 className="trk-title">Become an officer</h2>
              <span className="trk-badge b-officer trk-title-badge">OFFICER APPLICATIONS</span>
            </div>
            <p className="trk-head-copy">
              For students ready to lead, plan events, run a team, and shape the org.
              Apply for an officer role on any committee with openings.
            </p>
          </Reveal>
          <Reveal className="trk-grid trk-grid-officer" stagger gap={45}>
            {officerCards.map((c) => (
              <ApplyCard key={c.key} data={c} />
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
