import { Link } from "react-router-dom";
import { NodeField } from "@/components/NodeField";
import { GoogleIcon } from "@/components/icons";

type AuthMode = "signin" | "signup";

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

interface AuthScreenProps {
  mode: AuthMode;
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const isUp = mode === "signup";

  return (
    <div>
      <section className="auth">
        <div className="auth-canvas">
          <NodeField density={0.6} />
        </div>

        {/* Brand panel */}
        <div className="auth-brand">
          <div className="auth-brand-in">
            <AcmMark size={30} />
            <h1 className="auth-head display">
              {isUp ? (
                <>
                  Start
                  <br />
                  building.
                </>
              ) : (
                <>
                  Welcome
                  <br />
                  back.
                </>
              )}
            </h1>
            <p className="auth-brand-copy">
              {isUp
                ? "One account gets you into everything ACM at UTA. Events, dev teams, workshops, the Discord, and HackUTA."
                : "Sign back in to pick up where you left off, applications, events, and your committee."}
            </p>
            <ul className="auth-perks">
              <li>
                <span className="node" />
                140+ events a year, free to members
              </li>
              <li>
                <span className="node" />
                Six committees to build and learn with
              </li>
              <li>
                <span className="node" />
                1,700+ students across every major
              </li>
            </ul>
          </div>
        </div>

        {/* Card panel */}
        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-toggle" role="tablist" aria-label="Sign in or sign up">
              <Link
                to="/signin"
                className={`auth-tab${!isUp ? " on" : ""}`}
                role="tab"
                aria-selected={!isUp}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className={`auth-tab${isUp ? " on" : ""}`}
                role="tab"
                aria-selected={isUp}
              >
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

            {/* === SUPABASE SWAP POINT ===
                Replace this button's onClick with:
                supabase.auth.signInWithOAuth({ provider: 'google',
                  options: { hd: 'mavs.uta.edu' } })
            */}
            <button
              className="google-btn"
              onClick={(e) => e.preventDefault()}
              aria-label="Continue with Google"
            >
              <GoogleIcon s={18} />
              <span>Continue with Google</span>
            </button>

            <div className="auth-note">
              <span className="mono auth-note-k">MAVS EMAIL</span>
              <p>
                Sign {isUp ? "up" : "in"} with your{" "}
                <code>@mavs.uta.edu</code> Google account. We use it to confirm
                you're a UTA student.
              </p>
            </div>

            {isUp && (
              <div className="auth-next">
                <span className="mono">NEXT, YOU'LL</span>
                <ul>
                  <li>
                    <span className="an">01</span>
                    Set up your profile, name, major, and graduation year
                  </li>
                  <li>
                    <span className="an">02</span>
                    Join the Discord and follow us on Instagram
                  </li>
                  <li>
                    <span className="an">03</span>
                    Browse committees and apply to the ones you want
                  </li>
                </ul>
              </div>
            )}

            <p className="auth-switch">
              {isUp ? (
                <>
                  Already a member? <Link to="/signin">Sign in</Link>
                </>
              ) : (
                <>
                  New to ACM? <Link to="/signup">Create an account</Link>
                </>
              )}
            </p>

            <p className="auth-legal mono">VISUAL DEMO · NOT WIRED TO AUTH YET</p>
          </div>
        </div>
      </section>
    </div>
  );
}
