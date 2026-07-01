import { useState, useEffect } from "react";
import { Modal } from "@/components/Modal";
import { Avatar } from "@/components/Avatar";
import { getMemberProfile, awardPoints, type MemberProfile, type CommitteeRoleType } from "@/lib/api";

const ROLE_LABEL: Record<CommitteeRoleType, string> = {
  member: "Member",
  officer: "Officer",
  director: "Director",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

interface MemberInfoModalProps {
  userId: string | null;
  onClose: () => void;
  isAdmin: boolean;
  currentUserId: string;
  onPointsAwarded?: () => void;
}

export function MemberInfoModal({ userId, onClose, isAdmin, currentUserId, onPointsAwarded }: MemberInfoModalProps) {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [awarding, setAwarding] = useState(false);
  const [awardErr, setAwardErr] = useState<string | null>(null);
  const [awardOk, setAwardOk] = useState(false);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setAmount("");
    setReason("");
    setAwardErr(null);
    setAwardOk(false);
    getMemberProfile(userId)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !profile) return;
    const amt = Number(amount);
    if (!amt || !reason.trim()) return;
    setAwardErr(null);
    setAwardOk(false);
    setAwarding(true);
    try {
      await awardPoints(userId, amt, reason.trim(), currentUserId);
      setProfile({ ...profile, total_points: profile.total_points + amt });
      setAmount("");
      setReason("");
      setAwardOk(true);
      onPointsAwarded?.();
    } catch {
      setAwardErr("Couldn't award points. Please try again.");
    } finally {
      setAwarding(false);
    }
  };

  if (!userId) return null;

  return (
    <Modal title="Member details" onClose={onClose}>
      {loading || !profile ? (
        <div className="ob-loading"><div className="auth-cb-spinner" /></div>
      ) : (
        <div className="adm-member-modal">
          <div className="adm-mm-top">
            <Avatar name={profile.name} size={56} accent />
            <div>
              <div className="pf-name" style={{ fontSize: "1.4rem" }}>{profile.name}</div>
              <div className="pf-email">{profile.email}</div>
            </div>
          </div>

          <div className="pf-info-list">
            <div className="pf-info-row">
              <span className="pf-info-k">Major</span>
              <span className="pf-info-v">{profile.major ?? "-"}</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-k">Classification</span>
              <span className="pf-info-v">{profile.classification ?? "-"}</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-k">Pronouns</span>
              <span className="pf-info-v">{profile.pronouns ?? "-"}</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-k">Graduation year</span>
              <span className="pf-info-v">{profile.grad_year ?? "-"}</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-k">Member since</span>
              <span className="pf-info-v">{fmtDate(profile.created_at)}</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-k">Total points</span>
              <span className="pf-info-v">{profile.total_points}</span>
            </div>
          </div>

          <section className="adm-section">
            <h2 className="adm-section-h">Committees</h2>
            {profile.committees.length === 0 ? (
              <p className="pf-empty">Not on any committees.</p>
            ) : (
              <div className="adm-member-list">
                {profile.committees.map((c) => (
                  <div key={c.committee_id} className="adm-member-row">
                    <div className="adm-app-info">
                      <span className="adm-app-name">{c.committee_name}</span>
                      <span className="adm-app-meta mono">Since {fmtDate(c.assigned_at)}</span>
                    </div>
                    <span className={`adm-role-pill adm-role-pill--${c.role}`}>{ROLE_LABEL[c.role]}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {isAdmin && (
            <section className="adm-section">
              <h2 className="adm-section-h">Award points</h2>
              {awardErr && <div className="auth-err">{awardErr}</div>}
              {awardOk && <p className="pf-empty">Points awarded.</p>}
              <form className="adm-form adm-form--inline" onSubmit={handleAward}>
                <div className="ob-row">
                  <div className="ob-field">
                    <label className="ob-label" htmlFor="award-amount">Amount</label>
                    <input
                      id="award-amount"
                      type="number"
                      className="ob-input"
                      placeholder="10"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="ob-field">
                    <label className="ob-label" htmlFor="award-reason">Reason</label>
                    <input
                      id="award-reason"
                      type="text"
                      className="ob-input"
                      placeholder="e.g. Hackathon volunteer"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-ghost" disabled={awarding || !amount || !reason.trim()}>
                  {awarding ? "Awarding…" : "Award points"}
                </button>
              </form>
            </section>
          )}
        </div>
      )}
    </Modal>
  );
}
