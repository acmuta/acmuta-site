import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getHackUTAConfig, updateHackUTAConfig, type HackUTAConfig } from "@/lib/api";
import type { AdminContext } from "./AdminLayout";
import { useAuth } from "@/lib/auth";

export default function AdminHackUTA() {
  const { isAdmin } = useOutletContext<AdminContext>();
  const { user } = useAuth();

  const [cfg, setCfg] = useState<HackUTAConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHackUTAConfig().then(setCfg);
  }, []);

  if (!isAdmin) {
    return (
      <div className="adm-head">
        <p style={{ color: "var(--text-dim)" }}>Only admins can manage HackUTA settings.</p>
      </div>
    );
  }

  if (!cfg) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  const update = (patch: Partial<HackUTAConfig>) => {
    setCfg((prev) => prev ? { ...prev, ...patch } : prev);
    setSaved(false);
  };

  const save = async () => {
    if (!cfg || !user) return;
    setSaving(true);
    setError(null);
    try {
      await updateHackUTAConfig(cfg, user.id);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">HackUTA Settings</h1>
        <p className="adm-sub">
          Controls what visitors see on the <strong>/hackuta</strong> public page.
        </p>
      </div>

      <div className="adm-card" style={{ maxWidth: 560 }}>
        {/* Enable / disable toggle */}
        <div className="adm-field-row" style={{ marginBottom: 28 }}>
          <div>
            <div className="adm-field-label" style={{ fontWeight: 700, fontSize: "1rem" }}>
              HackUTA info enabled
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginTop: 4 }}>
              When off, the page shows a generic "coming soon" message with no dates or details.
            </p>
          </div>
          <label className="adm-toggle">
            <input
              type="checkbox"
              checked={cfg.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
            />
            <span className="adm-toggle-slider" />
          </label>
        </div>

        <hr className="hr" style={{ margin: "0 0 24px" }} />

        <fieldset disabled={!cfg.enabled} style={{ border: "none", padding: 0, opacity: cfg.enabled ? 1 : 0.4, transition: "opacity 0.2s" }}>
          <div className="field">
            <label>Year</label>
            <input
              type="number"
              value={cfg.year}
              min={2020}
              max={2100}
              onChange={(e) => update({ year: parseInt(e.target.value) || cfg.year })}
            />
          </div>

          <div className="field">
            <label>Date display (shown on the page)</label>
            <input
              type="text"
              value={cfg.dateDisplay}
              placeholder="e.g. OCT 18–19, 2026"
              onChange={(e) => update({ dateDisplay: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Location</label>
            <input
              type="text"
              value={cfg.location}
              placeholder="e.g. UTA COLLEGE PARK CENTER"
              onChange={(e) => update({ location: e.target.value })}
            />
          </div>

          <div className="adm-field-row" style={{ marginBottom: 20 }}>
            <div>
              <div className="adm-field-label">Applications open</div>
              <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginTop: 3 }}>
                Shows an "Apply now" button when enabled.
              </p>
            </div>
            <label className="adm-toggle">
              <input
                type="checkbox"
                checked={cfg.appsOpen}
                onChange={(e) => update({ appsOpen: e.target.checked })}
              />
              <span className="adm-toggle-slider" />
            </label>
          </div>

          {cfg.appsOpen && (
            <div className="field">
              <label>Application URL (optional)</label>
              <input
                type="url"
                value={cfg.appsUrl ?? ""}
                placeholder="https://hackuta.org/apply"
                onChange={(e) => update({ appsUrl: e.target.value || null })}
              />
              <span style={{ color: "var(--text-faint)", fontSize: "0.78rem" }}>
                Leave blank to use the site's /apply page instead.
              </span>
            </div>
          )}
        </fieldset>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
          <button
            className="btn btn-primary"
            onClick={save}
            disabled={saving}
            style={{ minWidth: 110 }}
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
          </button>
          {error && <span style={{ color: "var(--ok-reject)", fontSize: "0.88rem" }}>{error}</span>}
        </div>
      </div>
    </div>
  );
}
