import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { getOrgStats, getAuditLog, type OrgStats, type AuditLogEntry } from "@/lib/api";
import type { AdminContext } from "./AdminLayout";
import { describeAuditEntry } from "./auditLabels";
import { Reveal } from "@/components/Reveal";
import { CommitteeMark } from "@/components/CommitteeLogo";

export default function AdminDashboard() {
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();

  const [stats, setStats] = useState<OrgStats | null>(null);
  const [activity, setActivity] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const committeeIds = isAdmin ? null : directedCommittees.map((c) => c.committee_id);
    Promise.all([getOrgStats(committeeIds), isAdmin ? getAuditLog({ limit: 8 }) : Promise.resolve({ entries: [], total: 0 })])
      .then(([s, a]) => {
        setStats(s);
        setActivity(a.entries);
      })
      .finally(() => setLoading(false));
  }, [isAdmin, directedCommittees]);

  if (loading || !stats) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">{isAdmin ? "Org dashboard" : "Dashboard"}</h1>
      </div>

      <Reveal className="adm-stat-grid" stagger>
        <div className="adm-stat-card">
          <span className="adm-stat-value tnum">{stats.total_members}</span>
          <span className="adm-stat-label">{isAdmin ? "Active members" : "Committee members"}</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-value tnum">{stats.pending_applications}</span>
          <span className="adm-stat-label">Pending applications</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-value tnum">{stats.upcoming_events}</span>
          <span className="adm-stat-label">Upcoming events</span>
        </div>
        <div className="adm-stat-card">
          <span className="adm-stat-value tnum">{stats.points_this_term}</span>
          <span className="adm-stat-label">Points awarded this term</span>
        </div>
      </Reveal>

      <div className="adm-two-col">
        {stats.committee_breakdown.length > 0 && (
          <Reveal className="adm-section">
            <div className="adm-section-h">
              <h2>{isAdmin ? "Members by committee" : "Your committees"}</h2>
            </div>
            <div className="adm-breakdown-list">
              {stats.committee_breakdown.map((c) => {
                const max = Math.max(...stats.committee_breakdown.map((x) => x.member_count));
                return (
                  <div key={c.committee_id} className="adm-breakdown-row">
                    <span className="adm-breakdown-name">
                      <CommitteeMark id={c.name.toLowerCase()} size={18} /> {c.name}
                    </span>
                    <span className="adm-breakdown-bar">
                      <span style={{ width: `${(c.member_count / max) * 100}%` }} />
                    </span>
                    <span className="adm-breakdown-count mono tnum">{c.member_count}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}

        {isAdmin && (
          <Reveal className="adm-section">
            <div className="adm-section-h">
              <h2>Recent activity</h2>
              <Link to="/admin/audit-log" className="adm-section-link">View audit log →</Link>
            </div>
            {activity.length === 0 ? (
              <p className="pf-empty">No recent admin activity.</p>
            ) : (
              <div className="adm-activity-list">
                {activity.map((a) => (
                  <div key={a.id} className="adm-activity-row">
                    <span className="adm-activity-dot" />
                    <span className="adm-activity-desc">{describeAuditEntry(a)}</span>
                    <span className="adm-activity-time mono">
                      {new Date(a.created_at).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Reveal>
        )}
      </div>
    </div>
  );
}
