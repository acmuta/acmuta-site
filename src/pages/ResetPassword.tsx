import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export default function ResetPassword() {
  const { user, loading, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [err, setErr]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);

  // If no recovery session materialises within 3 s, send to sign-in
  useEffect(() => {
    if (loading) return;
    if (!user) {
      const t = setTimeout(() => navigate("/signin", { replace: true }), 3000);
      return () => clearTimeout(t);
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setErr("Passwords don't match."); return; }
    if (password.length < 6)  { setErr("Password must be at least 6 characters."); return; }
    setErr(null);
    setSubmitting(true);
    const error = await updatePassword(password);
    setSubmitting(false);
    if (error) { setErr(error); return; }
    setDone(true);
    setTimeout(() => navigate("/"), 2500);
  };

  return (
    <div className="rp-wrap">
      <div className="rp-card">
        <div style={{ marginBottom: 32 }}>
          <span className="tag mono" style={{ display: "inline-flex", marginBottom: 20 }}>
            <span className="node" />
            RESET PASSWORD
          </span>
          <h1 className="rp-h">
            New <span className="amp">password.</span>
          </h1>
        </div>

        {done ? (
          <div className="auth-confirm">
            <p style={{ color: "var(--text-dim)" }}>
              Password updated. Signing you in…
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {err && <div className="auth-err">{err}</div>}

            <div className="auth-field">
              <label className="auth-label" htmlFor="rp-pw">New password</label>
              <input
                id="rp-pw"
                type="password"
                className="auth-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErr(null); }}
                required
                autoFocus
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="rp-confirm">Confirm new password</label>
              <input
                id="rp-confirm"
                type="password"
                className="auth-input"
                placeholder="Same password again"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErr(null); }}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={submitting}
            >
              {submitting ? "Updating…" : "Update password"}
            </button>
          </form>
        )}

        <p style={{ marginTop: 24, fontSize: "0.9rem" }}>
          <Link to="/signin" style={{ color: "var(--text-faint)" }}>← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
