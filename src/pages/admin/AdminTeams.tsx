import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { Plus, XIcon } from "@/components/icons";
import {
  getAdminTeams,
  getCommitteeMembers,
  createTeam,
  deleteTeam,
  setTeamLead,
  addTeamMember,
  removeTeamMember,
  type AdminTeam,
  type CommitteeMember,
} from "@/lib/api";
import type { AdminContext } from "./AdminLayout";
import { useCommitteeOptions } from "./useCommitteeOptions";

export default function AdminTeams() {
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();
  const { options: committees, loading: committeesLoading } = useCommitteeOptions(isAdmin, directedCommittees);

  const [committeeId, setCommitteeId] = useState("");
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!committeeId && committees.length > 0) setCommitteeId(committees[0].id);
  }, [committees, committeeId]);

  const load = (id: string) =>
    Promise.all([getAdminTeams(id), getCommitteeMembers(id)]).then(([t, m]) => {
      setTeams(t);
      setMembers(m);
    });

  useEffect(() => {
    if (!committeeId) return;
    setLoading(true);
    load(committeeId).finally(() => setLoading(false));
  }, [committeeId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setErr(null);
    setCreating(true);
    try {
      await createTeam(committeeId, newTeamName.trim(), null);
      setNewTeamName("");
      setShowForm(false);
      await load(committeeId);
    } catch {
      setErr("Couldn't create team. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (teamId: string) => {
    if (!confirm("Delete this team? This cannot be undone.")) return;
    await deleteTeam(teamId);
    await load(committeeId);
  };

  const handleSetLead = async (teamId: string, leadUserId: string | null) => {
    await setTeamLead(teamId, leadUserId);
    await load(committeeId);
  };

  const handleAddMember = async (teamId: string, userId: string) => {
    if (!userId) return;
    await addTeamMember(teamId, userId);
    await load(committeeId);
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    await removeTeamMember(teamId, userId);
    await load(committeeId);
  };

  if (committeesLoading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">Teams</h1>
        <div className="adm-head-controls">
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
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Cancel" : <><Plus s={15} /> New team</>}
          </button>
        </div>
      </div>

      {showForm && (
        <Reveal>
          <form className="adm-form adm-form--inline" onSubmit={handleCreate}>
            {err && <div className="auth-err">{err}</div>}
            <div className="ob-field">
              <label className="ob-label" htmlFor="team-name">Team name</label>
              <input
                id="team-name"
                type="text"
                className="ob-input"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary ob-submit" disabled={creating}>
              {creating ? "Creating…" : "Create team"}
            </button>
          </form>
        </Reveal>
      )}

      {loading ? (
        <div className="ob-loading"><div className="auth-cb-spinner" /></div>
      ) : teams.length === 0 ? (
        <p className="pf-empty">No teams in this committee yet.</p>
      ) : (
        <div className="adm-team-grid">
          {teams.map((t) => (
            <TeamCard
              key={t.id}
              team={t}
              members={members}
              isAdmin={isAdmin}
              onDelete={() => handleDelete(t.id)}
              onSetLead={(userId) => handleSetLead(t.id, userId)}
              onAddMember={(userId) => handleAddMember(t.id, userId)}
              onRemoveMember={(userId) => handleRemoveMember(t.id, userId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({
  team,
  members,
  isAdmin,
  onDelete,
  onSetLead,
  onAddMember,
  onRemoveMember,
}: {
  team: AdminTeam;
  members: CommitteeMember[];
  isAdmin: boolean;
  onDelete: () => void;
  onSetLead: (userId: string | null) => void;
  onAddMember: (userId: string) => void;
  onRemoveMember: (userId: string) => void;
}) {
  const [addUserId, setAddUserId] = useState("");
  const memberIds = new Set(team.members.map((m) => m.user_id));
  const candidates = members.filter((m) => !memberIds.has(m.user_id));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUserId) return;
    onAddMember(addUserId);
    setAddUserId("");
  };

  return (
    <div className="adm-team-card">
      <div className="adm-team-head">
        <h3 className="adm-team-name">{team.name}</h3>
        <button className="adm-icon-btn" onClick={onDelete} aria-label="Delete team"><XIcon s={15} /></button>
      </div>

      <div className="ob-field">
        <label className="ob-label">Lead</label>
        <select
          className="ob-input ob-select"
          value={team.lead_user_id ?? ""}
          onChange={(e) => onSetLead(e.target.value || null)}
        >
          <option value="">No lead</option>
          {members.map((m) => (
            <option key={m.user_id} value={m.user_id}>{m.name}</option>
          ))}
        </select>
      </div>

      <div className="adm-team-label mono">Members</div>
      <div className="adm-team-members">
        {team.members.length === 0 ? (
          <p className="pf-empty">No members yet.</p>
        ) : (
          team.members.map((m) => (
            <span key={m.user_id} className="adm-chip">
              {m.name}
              {isAdmin && (
                <button
                  className="adm-chip-x"
                  onClick={() => onRemoveMember(m.user_id)}
                  aria-label={`Remove ${m.name}`}
                >
                  <XIcon s={12} />
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {candidates.length > 0 && (
        <form className="adm-team-add" onSubmit={handleAdd}>
          <select
            className="ob-input ob-select"
            value={addUserId}
            onChange={(e) => setAddUserId(e.target.value)}
          >
            <option value="">Add member…</option>
            {candidates.map((m) => (
              <option key={m.user_id} value={m.user_id}>{m.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-ghost btn-sm" disabled={!addUserId}>Add</button>
        </form>
      )}
    </div>
  );
}
