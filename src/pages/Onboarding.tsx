import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { updateProfile } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import {
  MAJORS,
  MAJOR_OTHER,
  CLASSIFICATIONS,
  PRONOUNS,
  PRONOUNS_CUSTOM,
  splitMajor,
  splitPronouns,
} from "@/lib/onboardingOptions";

const THIS_YEAR = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => THIS_YEAR + i);

export default function Onboarding() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [name,      setName]      = useState("");
  const [majorChoice, setMajorChoice] = useState("");
  const [majorOther,  setMajorOther]  = useState("");
  const [classification, setClassification] = useState("");
  const [pronounsChoice, setPronounsChoice] = useState("");
  const [pronounsOther,  setPronounsOther]  = useState("");
  const [gradYear,  setGradYear]  = useState<number | "">("");
  const [discord,   setDiscord]   = useState(false);
  const [instagram, setInstagram] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Pre-fill once the profile loads (async after auth callback)
  useEffect(() => {
    if (profile) {
      if (!name) setName(profile.full_name || "");
      if (!majorChoice) {
        const { choice, other } = splitMajor(profile.major);
        setMajorChoice(choice);
        setMajorOther(other);
      }
      if (!classification) setClassification(profile.classification || "");
      if (!pronounsChoice) {
        const { choice, other } = splitPronouns(profile.pronouns);
        setPronounsChoice(choice);
        setPronounsOther(other);
      }
      if (!gradYear) setGradYear(profile.grad_year || "");
      setDiscord(profile.discord_joined);
      setInstagram(profile.instagram_joined);
    }
  }, [profile]);

  // If already onboarded, redirect home
  useEffect(() => {
    if (!loading && profile?.onboarded) navigate("/", { replace: true });
  }, [loading, profile, navigate]);

  // If not signed in, redirect to signup
  useEffect(() => {
    if (!loading && !user) navigate("/signup", { replace: true });
  }, [loading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) { setErr("Name is required."); return; }
    setErr(null);
    setSubmitting(true);
    try {
      const major = majorChoice === MAJOR_OTHER ? majorOther.trim() : majorChoice;
      const pronouns = pronounsChoice === PRONOUNS_CUSTOM ? pronounsOther.trim() : pronounsChoice;
      await updateProfile(user.id, {
        full_name:        name.trim(),
        major:            major || null,
        classification:   classification || null,
        pronouns:         pronouns || null,
        grad_year:        gradYear ? Number(gradYear) : null,
        discord_joined:   discord,
        instagram_joined: instagram,
        onboarded:        true,
      });
      await refreshProfile();
      navigate("/", { replace: true });
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        <Reveal>
          <div className="ob-head">
            <span className="tag mono">
              <span className="node" />
              WELCOME TO ACM
            </span>
            <h1 className="ob-h">
              Set up your <span className="amp">profile.</span>
            </h1>
            <p className="ob-sub">
              This only takes a minute. You can update everything later.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <form className="ob-form" onSubmit={handleSubmit}>
            {err && <div className="auth-err">{err}</div>}

            <div className="ob-field">
              <label className="ob-label" htmlFor="ob-name">Full name</label>
              <input
                id="ob-name"
                type="text"
                className="ob-input"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="ob-row">
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-major">Major</label>
                <select
                  id="ob-major"
                  className="ob-input ob-select"
                  value={majorChoice}
                  onChange={(e) => setMajorChoice(e.target.value)}
                >
                  <option value="">Select major</option>
                  {MAJORS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                  <option value={MAJOR_OTHER}>Other</option>
                </select>
                {majorChoice === MAJOR_OTHER && (
                  <input
                    type="text"
                    className="ob-input"
                    placeholder="Your major"
                    value={majorOther}
                    onChange={(e) => setMajorOther(e.target.value)}
                    style={{ marginTop: 8 }}
                    autoComplete="off"
                  />
                )}
              </div>
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-grad">Graduation year</label>
                <select
                  id="ob-grad"
                  className="ob-input ob-select"
                  value={gradYear}
                  onChange={(e) =>
                    setGradYear(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">Select year</option>
                  {GRAD_YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ob-row">
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-classification">Classification</label>
                <select
                  id="ob-classification"
                  className="ob-input ob-select"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                >
                  <option value="">Select year</option>
                  {CLASSIFICATIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="ob-field">
                <label className="ob-label" htmlFor="ob-pronouns">Pronouns</label>
                <select
                  id="ob-pronouns"
                  className="ob-input ob-select"
                  value={pronounsChoice}
                  onChange={(e) => setPronounsChoice(e.target.value)}
                >
                  <option value="">Select pronouns</option>
                  {PRONOUNS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value={PRONOUNS_CUSTOM}>Custom</option>
                </select>
                {pronounsChoice === PRONOUNS_CUSTOM && (
                  <input
                    type="text"
                    className="ob-input"
                    placeholder="Your pronouns"
                    value={pronounsOther}
                    onChange={(e) => setPronounsOther(e.target.value)}
                    style={{ marginTop: 8 }}
                    autoComplete="off"
                  />
                )}
              </div>
            </div>

            <div>
              <div className="ob-label" style={{ marginBottom: 10 }}>JOIN THE COMMUNITY</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label className="ob-check-row">
                  <input
                    type="checkbox"
                    checked={discord}
                    onChange={(e) => setDiscord(e.target.checked)}
                  />
                  <div className="ob-check-body">
                    <span className="ob-check-label">I've joined the Discord</span>
                    <span className="ob-check-sub">
                      <a href="https://discord.gg/eTEWWsccZy" target="_blank" rel="noreferrer">
                        Discord
                      </a>{" "}
                      - announcements, events, and the community
                    </span>
                  </div>
                </label>

                <label className="ob-check-row">
                  <input
                    type="checkbox"
                    checked={instagram}
                    onChange={(e) => setInstagram(e.target.checked)}
                  />
                  <div className="ob-check-body">
                    <span className="ob-check-label">I'm following @acmuta</span>
                    <span className="ob-check-sub">
                      <a href="https://instagram.com/acmuta" target="_blank" rel="noreferrer">
                        Instagram
                      </a>{" "}
                      - event photos and announcements
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary ob-submit"
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Finish setup →"}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
