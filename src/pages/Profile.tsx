import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  getUserCommittees, getUserActivity, getUserApplications, getUserTeams, getUserMentorship, updateProfile,
  APPLICANT_STATUS_LABEL, TERM_LABEL,
} from "@/lib/api";
import type { UserCommittee, UserActivity, ApplicationSubmission, UserTeam, MentorshipPairing, SubmissionStatus } from "@/lib/api";
import { validateStudentId, validateUrl } from "@/lib/validation";
import { CommitteeMark } from "@/components/CommitteeLogo";
import { Reveal } from "@/components/Reveal";
import { Avatar } from "@/components/Avatar";
import { Modal } from "@/components/Modal";
import { SubmissionView } from "@/components/applications/SubmissionView";
import {
  MAJORS,
  MAJOR_OTHER,
  CLASSIFICATIONS,
  PRONOUNS,
  PRONOUNS_CUSTOM,
  splitMajor,
  splitPronouns,
} from "@/lib/onboardingOptions";

function AppStatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span className={`sub-status sub-status--${status}`}>
      {APPLICANT_STATUS_LABEL[status]}
    </span>
  );
}

const THIS_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => THIS_YEAR + i);

export default function Profile() {
  const { user, profile, loading, directedCommittees, refreshProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [committees, setCommittees] = useState<UserCommittee[]>([]);
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [mentorship, setMentorship] = useState<MentorshipPairing[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [viewingApplication, setViewingApplication] = useState<ApplicationSubmission | null>(null);

  const [editName, setEditName] = useState("");
  const [editMajorChoice, setEditMajorChoice] = useState("");
  const [editMajorOther, setEditMajorOther] = useState("");
  const [editClassification, setEditClassification] = useState("");
  const [editPronounsChoice, setEditPronounsChoice] = useState("");
  const [editPronounsOther, setEditPronounsOther] = useState("");
  const [editGradYear, setEditGradYear] = useState<number | "">("");
  const [editDiscord, setEditDiscord] = useState(false);
  const [editInstagram, setEditInstagram] = useState(false);
  const [editPhone, setEditPhone] = useState("");
  const [editStudentId, setEditStudentId] = useState("");
  const [editDiscordUsername, setEditDiscordUsername] = useState("");
  const [editLinkedin, setEditLinkedin] = useState("");
  const [editGithub, setEditGithub] = useState("");
  const [editInstagramHandle, setEditInstagramHandle] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/signin", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    Promise.all([
      getUserCommittees(user.id),
      getUserActivity(user.id),
      getUserApplications(user.id),
      getUserTeams(user.id),
      getUserMentorship(user.id),
    ])
      .then(([c, a, apps, t, m]) => {
        setCommittees(c); setActivity(a); setApplications(apps); setTeams(t); setMentorship(m);
      })
      .finally(() => setDataLoading(false));
  }, [user]);

  const startEdit = () => {
    if (!profile) return;
    setEditName(profile.full_name || "");
    const major = splitMajor(profile.major);
    setEditMajorChoice(major.choice);
    setEditMajorOther(major.other);
    setEditClassification(profile.classification || "");
    const pronouns = splitPronouns(profile.pronouns);
    setEditPronounsChoice(pronouns.choice);
    setEditPronounsOther(pronouns.other);
    setEditGradYear(profile.grad_year || "");
    setEditDiscord(profile.discord_joined);
    setEditInstagram(profile.instagram_joined);
    setEditPhone(profile.phone || "");
    setEditStudentId(profile.student_id || "");
    setEditDiscordUsername(profile.discord_username || "");
    setEditLinkedin(profile.linkedin || "");
    setEditGithub(profile.github || "");
    setEditInstagramHandle(profile.instagram_handle || "");
    setSaveErr(null);
    setEditing(true);
  };

  const cancelEdit = () => { setEditing(false); setSaveErr(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (!editName.trim()) { setSaveErr("Name is required."); return; }
    if (editStudentId.trim()) {
      const err = validateStudentId(editStudentId);
      if (err) { setSaveErr(err); return; }
    }
    if (editLinkedin.trim()) {
      const err = validateUrl(editLinkedin, "linkedin");
      if (err) { setSaveErr(err); return; }
    }
    if (editGithub.trim()) {
      const err = validateUrl(editGithub, "github");
      if (err) { setSaveErr(err); return; }
    }
    setSaveErr(null);
    setSaving(true);
    try {
      const major = editMajorChoice === MAJOR_OTHER ? editMajorOther.trim() : editMajorChoice;
      const pronouns = editPronounsChoice === PRONOUNS_CUSTOM ? editPronounsOther.trim() : editPronounsChoice;
      await updateProfile(user.id, {
        full_name: editName.trim(),
        major: major || null,
        classification: editClassification || null,
        pronouns: pronouns || null,
        grad_year: editGradYear ? Number(editGradYear) : null,
        discord_joined: editDiscord,
        instagram_joined: editInstagram,
        phone: editPhone.trim() || null,
        student_id: editStudentId.trim() || null,
        discord_username: editDiscordUsername.trim() || null,
        linkedin: editLinkedin.trim() || null,
        github: editGithub.trim() || null,
        instagram_handle: editInstagramHandle.trim() || null,
      });
      await refreshProfile();
      setEditing(false);
    } catch {
      setSaveErr("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user || !profile) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div className="pf-wrap">
      <Reveal>
        <div className="pf-top">
          <Avatar name={profile.full_name} size={68} accent />
          <div className="pf-top-info">
            <h1 className="pf-name">{profile.full_name}</h1>
            <p className="pf-email">{profile.email}</p>
            <p className="pf-top-meta mono">
              {profile.classification || "-"} · {profile.major || "-"} · '{profile.grad_year ? String(profile.grad_year).slice(2) : "-"}
            </p>
          </div>
          <div className="pf-top-actions">
            {(profile.is_admin || directedCommittees.length > 0) && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admin")}>
                Switch to admin view
              </button>
            )}
            {!editing && (
              <button className="btn btn-ghost btn-sm pf-edit-btn" onClick={startEdit}>
                Edit profile
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </Reveal>

      <div className="pf-grid">
        <div className="pf-col-main">
          <Reveal>
            <section className="pf-section">
              <h2 className="pf-section-h">Profile</h2>

              {editing ? (
                <form onSubmit={handleSave} className="ob-form" style={{ margin: 0 }}>
                  {saveErr && <div className="auth-err">{saveErr}</div>}
                  <div className="ob-field">
                    <label className="ob-label" htmlFor="pf-name">Full name</label>
                    <input id="pf-name" type="text" className="ob-input"
                      value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  <div className="ob-row">
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-major">Major</label>
                      <select id="pf-major" className="ob-input ob-select"
                        value={editMajorChoice}
                        onChange={(e) => setEditMajorChoice(e.target.value)}>
                        <option value="">Select major</option>
                        {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
                        <option value={MAJOR_OTHER}>Other</option>
                      </select>
                      {editMajorChoice === MAJOR_OTHER && (
                        <input type="text" className="ob-input" style={{ marginTop: 8 }}
                          placeholder="Your major" value={editMajorOther}
                          onChange={(e) => setEditMajorOther(e.target.value)} />
                      )}
                    </div>
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-grad">Grad year</label>
                      <select id="pf-grad" className="ob-input ob-select"
                        value={editGradYear}
                        onChange={(e) => setEditGradYear(e.target.value ? Number(e.target.value) : "")}>
                        <option value="">-</option>
                        {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="ob-row">
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-classification">Classification</label>
                      <select id="pf-classification" className="ob-input ob-select"
                        value={editClassification}
                        onChange={(e) => setEditClassification(e.target.value)}>
                        <option value="">Select year</option>
                        {CLASSIFICATIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-pronouns">Pronouns</label>
                      <select id="pf-pronouns" className="ob-input ob-select"
                        value={editPronounsChoice}
                        onChange={(e) => setEditPronounsChoice(e.target.value)}>
                        <option value="">Select pronouns</option>
                        {PRONOUNS.map((p) => <option key={p} value={p}>{p}</option>)}
                        <option value={PRONOUNS_CUSTOM}>Custom</option>
                      </select>
                      {editPronounsChoice === PRONOUNS_CUSTOM && (
                        <input type="text" className="ob-input" style={{ marginTop: 8 }}
                          placeholder="Your pronouns" value={editPronounsOther}
                          onChange={(e) => setEditPronounsOther(e.target.value)} />
                      )}
                    </div>
                  </div>
                  <div className="ob-row">
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-phone">Phone number</label>
                      <input id="pf-phone" type="tel" className="ob-input"
                        value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                    </div>
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-student-id">Student ID</label>
                      <input id="pf-student-id" type="text" className="ob-input" pattern="[0-9]{10}"
                        placeholder="1000000000"
                        value={editStudentId} onChange={(e) => setEditStudentId(e.target.value)} />
                    </div>
                  </div>
                  <div className="ob-row">
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-discord-username">Discord username</label>
                      <input id="pf-discord-username" type="text" className="ob-input"
                        value={editDiscordUsername} onChange={(e) => setEditDiscordUsername(e.target.value)} />
                    </div>
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-instagram-handle">Instagram handle</label>
                      <input id="pf-instagram-handle" type="text" className="ob-input"
                        value={editInstagramHandle} onChange={(e) => setEditInstagramHandle(e.target.value)} />
                    </div>
                  </div>
                  <div className="ob-row">
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-linkedin">LinkedIn</label>
                      <input id="pf-linkedin" type="url" className="ob-input"
                        placeholder="https://linkedin.com/in/username"
                        value={editLinkedin} onChange={(e) => setEditLinkedin(e.target.value)} />
                    </div>
                    <div className="ob-field">
                      <label className="ob-label" htmlFor="pf-github">GitHub</label>
                      <input id="pf-github" type="url" className="ob-input"
                        placeholder="https://github.com/username"
                        value={editGithub} onChange={(e) => setEditGithub(e.target.value)} />
                    </div>
                  </div>
                  <label className="ob-check-row">
                    <input type="checkbox" checked={editDiscord}
                      onChange={(e) => setEditDiscord(e.target.checked)} />
                    <div className="ob-check-body">
                      <span className="ob-check-label">Joined the Discord</span>
                    </div>
                  </label>
                  <label className="ob-check-row">
                    <input type="checkbox" checked={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.checked)} />
                    <div className="ob-check-body">
                      <span className="ob-check-label">Following @acmuta on Instagram</span>
                    </div>
                  </label>
                  <div className="pf-edit-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={cancelEdit} disabled={saving}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="pf-info-list">
                  <div className="pf-info-row">
                    <span className="pf-info-k">Major</span>
                    <span className="pf-info-v">{profile.major || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Classification</span>
                    <span className="pf-info-v">{profile.classification || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Pronouns</span>
                    <span className="pf-info-v">{profile.pronouns || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Graduation year</span>
                    <span className="pf-info-v">{profile.grad_year || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Phone</span>
                    <span className="pf-info-v">{profile.phone || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Student ID</span>
                    <span className="pf-info-v">{profile.student_id || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Discord username</span>
                    <span className="pf-info-v">{profile.discord_username || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">LinkedIn</span>
                    <span className="pf-info-v">
                      {profile.linkedin
                        ? <a href={profile.linkedin} target="_blank" rel="noreferrer" className="pf-link">View →</a>
                        : "-"}
                    </span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">GitHub</span>
                    <span className="pf-info-v">
                      {profile.github
                        ? <a href={profile.github} target="_blank" rel="noreferrer" className="pf-link">View →</a>
                        : "-"}
                    </span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Instagram handle</span>
                    <span className="pf-info-v">{profile.instagram_handle || "-"}</span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Discord</span>
                    <span className="pf-info-v">
                      {profile.discord_joined
                        ? <span className="pf-joined"><span className="pf-dot" />Joined</span>
                        : <a href="https://discord.gg/eTEWWsccZy" target="_blank" rel="noreferrer" className="pf-link">Join →</a>
                      }
                    </span>
                  </div>
                  <div className="pf-info-row">
                    <span className="pf-info-k">Instagram</span>
                    <span className="pf-info-v">
                      {profile.instagram_joined
                        ? <span className="pf-joined"><span className="pf-dot" />Following</span>
                        : <a href="https://instagram.com/acmuta" target="_blank" rel="noreferrer" className="pf-link">Follow →</a>
                      }
                    </span>
                  </div>
                </div>
              )}
            </section>
          </Reveal>

          <Reveal>
            <section className="pf-section">
              <h2 className="pf-section-h">Applications</h2>
              {dataLoading ? (
                <p className="pf-empty">Loading…</p>
              ) : applications.length === 0 ? (
                <p className="pf-empty">
                  No applications yet.{" "}
                  <Link to="/apply" className="pf-link">Apply now →</Link>
                </p>
              ) : (
                <div className="pf-app-list">
                  {applications.map((a) => (
                    <button key={a.id} className="pf-app-row" onClick={() => setViewingApplication(a)}>
                      <div className="pf-app-info">
                        <span className="pf-app-committee">{a.committee_name}</span>
                        <span className="pf-app-type">
                          {a.form_title} · {TERM_LABEL[a.term]} {a.year}
                        </span>
                      </div>
                      <AppStatusBadge status={a.status} />
                    </button>
                  ))}
                </div>
              )}
            </section>
          </Reveal>

          <Reveal>
            <section className="pf-section">
              <h2 className="pf-section-h">Committees</h2>
              {dataLoading ? (
                <p className="pf-empty">Loading…</p>
              ) : committees.length === 0 ? (
                <p className="pf-empty">
                  No committee memberships yet.{" "}
                  <Link to="/apply" className="pf-link">Apply to one →</Link>
                </p>
              ) : (
                <div className="pf-committee-list">
                  {committees.map((c) => (
                    <Link key={c.committee_id} to={`/${c.committee_slug}`} className="pf-committee-row">
                      <span className="pf-committee-mark"><CommitteeMark id={c.committee_slug} size={22} /></span>
                      <span className="pf-committee-name">{c.committee_name}</span>
                      <span className={`pf-role-badge pf-role-badge--${c.role}`}>{c.role}</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </Reveal>

          {teams.length > 0 && (
            <Reveal>
              <section className="pf-section">
                <h2 className="pf-section-h">Teams</h2>
                <div className="pf-team-list">
                  {teams.map((t) => (
                    <div key={t.team_id} className="pf-team-card">
                      <div className="pf-team-head">
                        <div>
                          <span className="pf-team-name">{t.team_name}</span>
                          <span className="pf-team-committee">{t.committee_name}</span>
                        </div>
                        {t.is_lead && <span className="pf-role-badge pf-role-badge--director">Lead</span>}
                      </div>
                      {t.members.length > 0 && (
                        <div className="pf-team-members">
                          {t.members.map((m) => (
                            <span key={m.id} className="pf-team-member">{m.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          )}
        </div>

        <div className="pf-col-side">
          {mentorship.length > 0 && (
            <Reveal>
              <section className="pf-section">
                <h2 className="pf-section-h">Mentorship</h2>
                <div className="pf-mentor-list">
                  {mentorship.map((m) => (
                    <div key={m.id} className="pf-mentor-row">
                      <span className={`pf-role-badge pf-role-badge--${m.role === "mentor" ? "officer" : "member"}`}>
                        {m.role === "mentor" ? "Your mentee" : "Your mentor"}
                      </span>
                      <span className="pf-mentor-name">{m.partner_name}</span>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          )}

          <Reveal>
            <section className="pf-section pf-activity">
              <h2 className="pf-section-h">Activity this semester</h2>
              {dataLoading ? (
                <p className="pf-empty">Loading…</p>
              ) : (
                <>
                  <div className="pf-stats-row">
                    <div className="pf-stat">
                      <span className="pf-stat-num">{activity?.total_points ?? 0}</span>
                      <span className="pf-stat-label">bits earned</span>
                    </div>
                    <div className="pf-stat">
                      <span className="pf-stat-num">{activity?.events_attended ?? 0}</span>
                      <span className="pf-stat-label">events attended</span>
                    </div>
                  </div>
                  {(activity?.recent ?? []).length > 0 ? (
                    <div className="pf-att-list">
                      {activity!.recent.map((r, i) => (
                        <div key={i} className="pf-att-row">
                          <span className="pf-att-title">{r.event_title}</span>
                          <span className="pf-att-bits">+{r.bits_awarded}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pf-att-empty">
                      No events yet - check in at the next one to earn bits.
                    </p>
                  )}
                </>
              )}
              <Link to="/leaderboard" className="btn btn-ghost btn-sm pf-leaderboard-link">
                View leaderboard
              </Link>
            </section>
          </Reveal>
        </div>
      </div>

      {viewingApplication && (
        <Modal
          title={`${viewingApplication.committee_name} · ${viewingApplication.form_title} · ${TERM_LABEL[viewingApplication.term]} ${viewingApplication.year}`}
          onClose={() => setViewingApplication(null)}
          wide
        >
          <SubmissionView
            questions={viewingApplication.questions}
            answers={viewingApplication.answers}
            resumePath={viewingApplication.resume_path}
            showDirectorToggle={viewingApplication.show_director_toggle}
            status={viewingApplication.status}
            context="applicant"
          />
        </Modal>
      )}
    </div>
  );
}
