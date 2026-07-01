import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { callCheckIn } from "@/lib/api";
import type { CheckInResult } from "@/lib/api";

type PageState = "idle" | "loading" | "done";

const ERROR_COPY: Record<string, { heading: string; body: string; isOk?: boolean }> = {
  already_checked_in: {
    isOk: true,
    heading: "Already checked in",
    body: "You've already been recorded at this event. Your bits are safe.",
  },
  qr_expired: {
    heading: "QR code expired",
    body: "The event window has ended and this code is no longer valid.",
  },
  invalid_token: {
    heading: "Invalid QR code",
    body: "This code doesn't match any event. Try scanning again.",
  },
  not_authenticated: {
    heading: "Not signed in",
    body: "Sign in first, then scan the QR code again.",
  },
};

export default function CheckIn() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { user, loading } = useAuth();

  const [pageState, setPageState] = useState<PageState>("idle");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [rpcErr, setRpcErr] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (loading || !user || !token || called.current) return;
    called.current = true;
    setPageState("loading");
    callCheckIn(token)
      .then((r) => { setResult(r); setPageState("done"); })
      .catch(() => { setRpcErr("Something went wrong. Try scanning again."); setPageState("done"); });
  }, [loading, user, token]);

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="ci-wrap">
        <div className="ci-card">
          <div className="auth-cb-spinner" />
        </div>
      </div>
    );
  }

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="ci-wrap">
        <div className="ci-card">
          <div className="ci-icon ci-icon--warn">!</div>
          <h1 className="ci-h">Sign in to check in</h1>
          <p className="ci-sub">You need to be signed in to record attendance and earn bits.</p>
          <Link to="/signin" className="btn btn-primary ci-btn">Sign in →</Link>
        </div>
      </div>
    );
  }

  // ── No token in URL ───────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="ci-wrap">
        <div className="ci-card">
          <div className="ci-icon ci-icon--err">✕</div>
          <h1 className="ci-h">Invalid link</h1>
          <p className="ci-sub">No QR token found in the URL. Scan the event QR code again.</p>
          <Link to="/" className="btn btn-ghost ci-btn">Back to home</Link>
        </div>
      </div>
    );
  }

  // ── Calling RPC ───────────────────────────────────────────────────────────
  if (pageState === "idle" || pageState === "loading") {
    return (
      <div className="ci-wrap">
        <div className="ci-card">
          <div className="auth-cb-spinner" />
          <p className="ci-sub" style={{ marginTop: 20 }}>Checking you in…</p>
        </div>
      </div>
    );
  }

  // ── Network / unexpected error ────────────────────────────────────────────
  if (rpcErr) {
    return (
      <div className="ci-wrap">
        <div className="ci-card">
          <div className="ci-icon ci-icon--err">✕</div>
          <h1 className="ci-h">Something went wrong</h1>
          <p className="ci-sub">{rpcErr}</p>
          <Link to="/" className="btn btn-ghost ci-btn">Back to home</Link>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (result?.ok) {
    return (
      <div className="ci-wrap">
        <div className="ci-card ci-card--success">
          <div className="ci-icon ci-icon--ok">✓</div>
          <h1 className="ci-h">Checked in!</h1>
          {result.event_title && (
            <p className="ci-event-title">{result.event_title}</p>
          )}
          {(result.bits_awarded ?? 0) > 0 && (
            <div className="ci-bits">
              <span className="ci-bits-num">+{result.bits_awarded}</span>
              <span className="ci-bits-label">bits earned</span>
            </div>
          )}
          <Link to="/profile" className="btn btn-ghost ci-btn">View profile →</Link>
        </div>
      </div>
    );
  }

  // ── RPC returned ok:false ─────────────────────────────────────────────────
  const errKey = result?.error ?? "";
  const copy = ERROR_COPY[errKey] ?? {
    heading: "Check-in failed",
    body: "An unexpected error occurred. Try scanning again.",
  };

  return (
    <div className="ci-wrap">
      <div className="ci-card">
        <div className={`ci-icon ${copy.isOk ? "ci-icon--ok" : "ci-icon--err"}`}>
          {copy.isOk ? "✓" : "✕"}
        </div>
        <h1 className="ci-h">{copy.heading}</h1>
        <p className="ci-sub">{copy.body}</p>
        <Link to="/profile" className="btn btn-ghost ci-btn">View profile →</Link>
      </div>
    </div>
  );
}
