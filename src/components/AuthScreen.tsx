import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NodeField } from "@/components/NodeField";
import { useAuth } from "@/lib/auth";

type AuthMode = "signin" | "signup";
type CardView = "form" | "check-email" | "forgot-form" | "forgot-sent";

function AcmMark({ size = 30 }: { size?: number }) {
  return (
    <Link to="/" className="acm-mark" aria-label="ACM at UTA home">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="6" cy="16" r="3" style={{ fill: "rgb(0, 100, 177)" }} />
        <circle cx="26" cy="7" r="2.4" fill="currentColor" />
        <circle cx="26" cy="25" r="2.4" fill="currentColor" />
        <path
          d="M6 16L26 7M6 16L26 25"
          stroke="currentColor"
          strokeWidth="1.3"
          opacity="0.6"
        />
      </svg>
      <span className="acm-word">
        ACM<span style={{ color: "var(--text-faint)" }}>·</span>UTA
      </span>
    </Link>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

interface AuthScreenProps {
  mode: AuthMode;
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const isUp = mode === "signup";
  const { user, profile, loading: authLoading, signIn, signUp, resetPassword, resendConfirmation } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [err, setErr]           = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView]         = useState<CardView>("form");
  const [confirmedEmail, setConfirmedEmail] = useState("");

  // Redirect already-signed-in users
  useEffect(() => {
    if (!authLoading && user && profile !== null) {
      navigate(profile.onboarded ? "/" : "/onboarding", { replace: true });
    }
  }, [user, profile, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    const error = await signIn(email, password);
    setSubmitting(false);
    if (error) setErr(error);
    // Redirect is handled by the useEffect above when user+profile update
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (password !== confirm) { setErr("Passwords don't match."); return; }
    if (password.length < 6)  { setErr("Password must be at least 6 characters."); return; }
    setSubmitting(true);
    const error = await signUp(email, password);
    setSubmitting(false);
    if (error) { setErr(error); return; }
    setConfirmedEmail(email);
    setView("check-email");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    const error = await resetPassword(forgotEmail);
    setSubmitting(false);
    if (error) { setErr(error); return; }
    setView("forgot-sent");
  };

  const handleResend = async () => {
    await resendConfirmation(confirmedEmail);
  };

  // Warn (but don't block) if email doesn't look like a Mavs address
  const warnNotMavs =
    isUp &&
    email.length > 4 &&
    !email.toLowerCase().endsWith("@mavs.uta.edu");

  // ── Card content ──────────────────────────────────────────────────────────

  if (view === "check-email" || view === "forgot-sent") {
    const isForgot = view === "forgot-sent";
    return (
      <div>
        <section className="auth">
          <div className="auth-canvas"><NodeField density={0.6} /></div>
          <div className="auth-brand">
            <div className="auth-brand-in">
              <AcmMark size={30} />
              <h1 className="auth-head display">Check<br />your inbox.</h1>
              <p className="auth-brand-copy">
                {isForgot
                  ? "A password reset link is on its way."
                  : "One click and you're in. Check the email we just sent."}
              </p>
            </div>
          </div>
          <div className="auth-panel">
            <div className="auth-card">
              <div className="auth-confirm">
                <div className="auth-confirm-icon"><EnvelopeIcon /></div>
                <h3>{isForgot ? "Reset link sent" : "Confirm your email"}</h3>
                <p>
                  {isForgot
                    ? <>We emailed a reset link to <strong>{forgotEmail}</strong>. Click it to set a new password.</>
                    : <>We sent a confirmation link to <strong>{confirmedEmail}</strong>. Click it to activate your account.</>
                  }
                </p>
                {!isForgot && (
                  <button className="auth-resend" onClick={handleResend}>
                    Resend email
                  </button>
                )}
                <p className="auth-confirm-back">
                  <Link to="/signin">← Back to sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (view === "forgot-form") {
    return (
      <div>
        <section className="auth">
          <div className="auth-canvas"><NodeField density={0.6} /></div>
          <div className="auth-brand">
            <div className="auth-brand-in">
              <AcmMark size={30} />
              <h1 className="auth-head display">Reset<br />password.</h1>
              <p className="auth-brand-copy">
                Enter the Mavs email on your account and we'll send a reset link.
              </p>
            </div>
          </div>
          <div className="auth-panel">
            <div className="auth-card">
              <h2 className="auth-card-h">Forgot password?</h2>
              <p className="auth-card-sub">We'll email you a link to reset it.</p>
              <form className="auth-form" onSubmit={handleForgot}>
                {err && <div className="auth-err">{err}</div>}
                <div className="auth-field">
                  <label className="auth-label" htmlFor="forgot-email">Email address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="auth-input"
                    placeholder="you@mavs.uta.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send reset link"}
                </button>
              </form>
              <p className="auth-switch">
                <button
                  className="auth-text-btn"
                  onClick={() => { setView("form"); setErr(null); }}
                >
                  ← Back to sign in
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ── Default: sign in / sign up form ───────────────────────────────────────
  return (
    <div>
      <section className="auth">
        <div className="auth-canvas"><NodeField density={0.6} /></div>

        <div className="auth-brand">
          <div className="auth-brand-in">
            <AcmMark size={30} />
            <h1 className="auth-head display">
              {isUp ? <>Start<br />building.</> : <>Welcome<br />back.</>}
            </h1>
            <p className="auth-brand-copy">
              {isUp
                ? "One account gets you into everything ACM at UTA. Events, dev teams, workshops, the Discord, and HackUTA."
                : "Sign back in to pick up where you left off, applications, events, and your committee."}
            </p>
            <ul className="auth-perks">
              <li><span className="node" />140+ events a year, free to members</li>
              <li><span className="node" />Six committees to build and learn with</li>
              <li><span className="node" />1,700+ students across every major</li>
            </ul>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-toggle" role="tablist" aria-label="Sign in or sign up">
              <Link to="/signin" className={`auth-tab${!isUp ? " on" : ""}`} role="tab" aria-selected={!isUp}>
                Sign in
              </Link>
              <Link to="/signup" className={`auth-tab${isUp ? " on" : ""}`} role="tab" aria-selected={isUp}>
                Sign up
              </Link>
            </div>

            <h2 className="auth-card-h">
              {isUp ? "Create your account" : "Sign in to ACM"}
            </h2>
            <p className="auth-card-sub">
              {isUp
                ? "Use your UTA Mavs email to get started."
                : "Use the Mavs email you signed up with."}
            </p>

            <form className="auth-form" onSubmit={isUp ? handleSignUp : handleSignIn}>
              {err && <div className="auth-err">{err}</div>}

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-email">Email address</label>
                <input
                  id="auth-email"
                  type="email"
                  className="auth-input"
                  placeholder="you@mavs.uta.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErr(null); }}
                  required
                  autoFocus
                  autoComplete="email"
                />
              </div>

              {warnNotMavs && (
                <p className="auth-warn">
                  Use your <code>@mavs.uta.edu</code> address to sign up.
                </p>
              )}

              <div className="auth-field">
                <label className="auth-label" htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  className="auth-input"
                  placeholder={isUp ? "At least 6 characters" : "Your password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErr(null); }}
                  required
                  autoComplete={isUp ? "new-password" : "current-password"}
                />
              </div>

              {isUp && (
                <div className="auth-field">
                  <label className="auth-label" htmlFor="auth-confirm">Confirm password</label>
                  <input
                    id="auth-confirm"
                    type="password"
                    className="auth-input"
                    placeholder="Same password again"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setErr(null); }}
                    required
                    autoComplete="new-password"
                  />
                </div>
              )}

              {!isUp && (
                <div className="auth-forgot">
                  <button
                    type="button"
                    onClick={() => { setForgotEmail(email); setView("forgot-form"); setErr(null); }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={submitting}
              >
                {submitting
                  ? (isUp ? "Creating account…" : "Signing in…")
                  : (isUp ? "Create account" : "Sign in")}
              </button>
            </form>

            {isUp && (
              <div className="auth-note">
                <span className="mono auth-note-k">MAVS EMAIL REQUIRED</span>
                <p>
                  Accounts are restricted to <code>@mavs.uta.edu</code> addresses
                  so we can confirm you're a UTA student.
                </p>
              </div>
            )}

            {isUp && (
              <div className="auth-next">
                <span className="mono">NEXT, YOU'LL</span>
                <ul>
                  <li><span className="an">01</span>Confirm your email address</li>
                  <li><span className="an">02</span>Set up your profile - name, major, graduation year</li>
                  <li><span className="an">03</span>Browse committees and apply to the ones you want</li>
                </ul>
              </div>
            )}

            <p className="auth-switch">
              {isUp ? (
                <>Already a member? <Link to="/signin">Sign in</Link></>
              ) : (
                <>New to ACM? <Link to="/signup">Create an account</Link></>
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
