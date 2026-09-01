import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { XIcon } from "@/components/icons";
import {
  getCommitteeMembers,
  assignCommitteeRole,
  removeCommitteeRole,
  findProfileByEmail,
  type CommitteeMember,
  type CommitteeRoleType,
} from "@/lib/api";
import type { AdminContext } from "./AdminLayout";
import { useCommitteeOptions } from "./useCommitteeOptions";
import { MemberInfoModal } from "@/components/admin/MemberInfoModal";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const ROLE_OPTIONS: CommitteeRoleType[] = ["member", "officer", "director"];

const ROLE_LABEL: Record<CommitteeRoleType, string> = {
  member: "Member",
  officer: "Officer",
  director: "Director",
};

export default function AdminMembers() {
  const { user } = useAuth();
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();
  const { options: committees, loading: committeesLoading } = useCommitteeOptions(isAdmin, directedCommittees);

  const [committeeId, setCommitteeId] = useState("");
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<CommitteeRoleType>("member");
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState<string | null>(null);
  const [roleErr, setRoleErr] = useState<string | null>(null);

  useEffect(() => {
    if (!committeeId && committees.length > 0) setCommitteeId(committees[0].id);
  }, [committees, committeeId]);

  const load = (id: string) => getCommitteeMembers(id).then(setMembers);

  useEffect(() => {
    if (!committeeId) return;
    setLoading(true);
    load(committeeId).finally(() => setLoading(false));
  }, [committeeId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail.trim()) return;
    setAddErr(null);
    setAdding(true);
    try {
      const profile = await findProfileByEmail(addEmail.trim());
      if (!profile) {
        setAddErr("No account found with that email.");
        return;
      }
      await assignCommitteeRole(profile.id, committeeId, addRole, user!.id);
      setAddEmail("");
      await load(committeeId);
    } catch {
      setAddErr("Couldn't add member. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleRoleChange = async (userId: string, role: CommitteeRoleType) => {
    setRoleErr(null);
    try {
      await assignCommitteeRole(userId, committeeId, role, user!.id);
      await load(committeeId);
    } catch {
      setRoleErr("Couldn't update role. Please try again.");
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this member from the committee?")) return;
    await removeCommitteeRole(userId, committeeId);
    await load(committeeId);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, search]);

  if (committeesLoading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">Members</h1>
        <div className="adm-head-controls">
          <input
            type="text"
            className="ob-input adm-filter"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {committees.length > 1 && (
            <select
              className="ob-input ob-select adm-filter"
              value={committeeId}
              onChange={(e) => setCommitteeId(e.target.value)}
            >
              {committees.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {isAdmin && (
        <form className="adm-form adm-form--inline" onSubmit={handleAdd}>
          {addErr && <div className="auth-err">{addErr}</div>}
          <div className="ob-field">
            <label className="ob-label" htmlFor="add-email">Add member by email</label>
            <input
              id="add-email"
              type="email"
              className="ob-input"
              placeholder="name@mavs.uta.edu"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
            />
          </div>
          <div className="ob-field">
            <label className="ob-label" htmlFor="add-role">Role</label>
            <select
              id="add-role"
              className="ob-input ob-select"
              value={addRole}
              onChange={(e) => setAddRole(e.target.value as CommitteeRoleType)}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{ROLE_LABEL[r]}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-ghost" disabled={adding || !addEmail.trim()}>
            {adding ? "Adding…" : "Add member"}
          </button>
        </form>
      )}

      {roleErr && <div className="auth-err">{roleErr}</div>}

      {loading ? (
        <div className="ob-loading"><div className="auth-cb-spinner" /></div>
      ) : members.length === 0 ? (
        <p className="pf-empty">No members in this committee yet.</p>
      ) : filtered.length === 0 ? (
        <p className="pf-empty">No members match your search.</p>
      ) : (
        <div className="adm-member-list">
          {filtered.map((m) => (
            <div key={m.user_id} className="adm-member-row">
              <button type="button" className="adm-member-main" onClick={() => setSelectedUserId(m.user_id)}>
                <Avatar name={m.name} size={38} />
                <span className="adm-member-info">
                  <span className="adm-member-name">{m.name}</span>
                  <span className="adm-member-meta mono">{m.email} · Member since {fmtDate(m.assigned_at)}</span>
                </span>
              </button>
              {isAdmin ? (
                <div className="adm-member-actions">
                  <select
                    className="ob-input ob-select"
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.user_id, e.target.value as CommitteeRoleType)}
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                    ))}
                  </select>
                  <button className="adm-icon-btn" onClick={() => handleRemove(m.user_id)} aria-label="Remove member"><XIcon s={15} /></button>
                </div>
              ) : (
                <span className={`adm-role-pill adm-role-pill--${m.role}`}>{ROLE_LABEL[m.role]}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <MemberInfoModal
        userId={selectedUserId}
        onClose={() => setSelectedUserId(null)}
        isAdmin={isAdmin}
        currentUserId={user!.id}
      />
    </div>
  );
}
