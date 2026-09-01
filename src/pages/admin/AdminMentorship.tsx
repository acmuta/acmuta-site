import { useState, useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { CheckIcon, ChevronIcon, SearchIcon, XIcon } from "@/components/icons";
import {
  getMentorshipCandidates,
  getAdminPairings,
  createPairing,
  deletePairing,
  type MentorshipCandidate,
  type AdminPairing,
} from "@/lib/api";
import type { AdminContext } from "./AdminLayout";

function filterCandidates(candidates: MentorshipCandidate[], query: string): MentorshipCandidate[] {
  const q = query.trim().toLowerCase();
  if (!q) return candidates;
  return candidates.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
}

interface CandidatePickerProps {
  label: string;
  candidates: MentorshipCandidate[];
  search: string;
  onSearchChange: (v: string) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  emptyText: string;
}

function CandidatePicker({ label, candidates, search, onSearchChange, selectedId, onSelect, emptyText }: CandidatePickerProps) {
  const filtered = useMemo(() => filterCandidates(candidates, search), [candidates, search]);

  return (
    <div className="adm-picker">
      <div className="adm-picker-label mono">{label}</div>
      <div className="adm-search">
        <SearchIcon s={15} />
        <input
          type="text"
          className="adm-search-input"
          placeholder={`Search ${label.toLowerCase()}…`}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="adm-picker-list">
        {candidates.length === 0 ? (
          <p className="pf-empty">{emptyText}</p>
        ) : filtered.length === 0 ? (
          <p className="pf-empty">No matches.</p>
        ) : (
          filtered.map((c) => (
            <button
              key={c.user_id}
              type="button"
              className={`adm-picker-item${selectedId === c.user_id ? " adm-picker-item--selected" : ""}`}
              onClick={() => onSelect(c.user_id)}
            >
              <Avatar name={c.name} size={30} />
              <span className="adm-att-info">
                <b>{c.name}</b>
                <span className="mono">{c.email}</span>
              </span>
              {selectedId === c.user_id && (
                <span className="adm-picker-check"><CheckIcon s={15} /></span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminMentorship() {
  const { user } = useAuth();
  const { isAdmin, directedCommittees } = useOutletContext<AdminContext>();
  const canAccess = isAdmin || directedCommittees.some((c) => c.slug === "educate");

  const [mentors, setMentors] = useState<MentorshipCandidate[]>([]);
  const [mentees, setMentees] = useState<MentorshipCandidate[]>([]);
  const [pairings, setPairings] = useState<AdminPairing[]>([]);
  const [loading, setLoading] = useState(true);

  const [mentorId, setMentorId] = useState("");
  const [menteeId, setMenteeId] = useState("");
  const [mentorSearch, setMentorSearch] = useState("");
  const [menteeSearch, setMenteeSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = () =>
    Promise.all([getMentorshipCandidates("mentor"), getMentorshipCandidates("mentee"), getAdminPairings()]).then(
      ([m, e, p]) => {
        setMentors(m);
        setMentees(e);
        setPairings(p);
      }
    );

  useEffect(() => {
    if (!canAccess) {
      setLoading(false);
      return;
    }
    load().finally(() => setLoading(false));
  }, [canAccess]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorId || !menteeId) return;
    setErr(null);
    setCreating(true);
    try {
      await createPairing(mentorId, menteeId, user!.id);
      setMentorId("");
      setMenteeId("");
      setMentorSearch("");
      setMenteeSearch("");
      await load();
    } catch {
      setErr("Couldn't create that pairing - it may already exist.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this pairing?")) return;
    await deletePairing(id);
    await load();
  };

  if (!canAccess) {
    return <p className="pf-empty">This page is for the Educate director and admins.</p>;
  }

  if (loading) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">Mentorship</h1>
      </div>

      <div className="adm-card">
        <div className="adm-section-h"><h3>Create a pairing</h3></div>
        <form className="adm-form adm-form--inline" onSubmit={handleCreate}>
          {err && <div className="auth-err">{err}</div>}
          <div className="ob-row">
            <CandidatePicker
              label="Mentor"
              candidates={mentors}
              search={mentorSearch}
              onSearchChange={setMentorSearch}
              selectedId={mentorId}
              onSelect={setMentorId}
              emptyText="No accepted mentors yet."
            />
            <CandidatePicker
              label="Mentee"
              candidates={mentees}
              search={menteeSearch}
              onSearchChange={setMenteeSearch}
              selectedId={menteeId}
              onSelect={setMenteeId}
              emptyText="No accepted mentees yet."
            />
          </div>
          <button type="submit" className="btn btn-primary ob-submit" disabled={creating || !mentorId || !menteeId}>
            {creating ? "Pairing…" : "Create pairing"}
          </button>
        </form>
      </div>

      <section className="adm-section">
        <div className="adm-section-h"><h2>Pairings <span className="adm-count mono">{pairings.length}</span></h2></div>
        {pairings.length === 0 ? (
          <p className="pf-empty">No pairings yet.</p>
        ) : (
          <div className="adm-pairing-list">
            {pairings.map((p) => (
              <div key={p.id} className="adm-pairing-row">
                <div className="adm-pairing-side">
                  <Avatar name={p.mentor_name} size={34} />
                  <span className="adm-att-info">
                    <b>{p.mentor_name}</b>
                    <span className="mono">mentor</span>
                  </span>
                </div>
                <span className="adm-pairing-arrow"><ChevronIcon s={18} /></span>
                <div className="adm-pairing-side">
                  <Avatar name={p.mentee_name} size={34} />
                  <span className="adm-att-info">
                    <b>{p.mentee_name}</b>
                    <span className="mono">mentee</span>
                  </span>
                </div>
                {isAdmin && (
                  <button className="adm-icon-btn" onClick={() => handleDelete(p.id)} aria-label="Remove pairing"><XIcon s={15} /></button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
