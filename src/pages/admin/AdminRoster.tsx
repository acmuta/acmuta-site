import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getRoster, type RosterMember } from "@/lib/api";
import type { AdminContext } from "./AdminLayout";
import { MemberInfoModal } from "@/components/admin/MemberInfoModal";

export default function AdminRoster() {
  const { isAdmin } = useOutletContext<AdminContext>();
  const { user } = useAuth();

  const [roster, setRoster] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    getRoster()
      .then(setRoster)
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [roster, search]);

  if (!isAdmin) {
    return <p className="pf-empty">This page is for admins only.</p>;
  }

  if (loading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">Roster</h1>
        <input
          type="text"
          className="ob-input adm-filter"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="adm-roster-count mono">{filtered.length} of {roster.length} accounts</p>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Major</th>
              <th>Grad year</th>
              <th className="adm-num">Points</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td>
                  <button type="button" className="adm-table-name" onClick={() => setSelectedUserId(m.id)}>
                    {m.name}
                  </button>
                </td>
                <td className="mono">{m.email}</td>
                <td>{m.major ?? "-"}</td>
                <td>{m.grad_year ?? "-"}</td>
                <td className="adm-num tnum">{m.total_points}</td>
                <td>
                  <div className="adm-roster-flags">
                    {m.is_admin && <span className="adm-flag adm-flag--admin">Admin</span>}
                    {m.is_alumni && <span className="adm-flag adm-flag--alumni">Alumni</span>}
                    {!m.onboarded && <span className="adm-flag adm-flag--pending">Pending onboarding</span>}
                    {!m.is_admin && !m.is_alumni && m.onboarded && <span className="adm-table-dim">-</span>}
                  </div>
                </td>
                <td className="mono">
                  {new Date(m.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="pf-empty">No accounts match your search.</p>}
      </div>

      <MemberInfoModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        isAdmin={isAdmin}
        currentUserId={user!.id}
      />
    </div>
  );
}
