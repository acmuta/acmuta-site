import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getLeaderboard, getOfficerLeaderboard } from "@/lib/api";
import type { LeaderboardEntry, LeaderboardScope } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import { Avatar } from "@/components/Avatar";

const SCOPES: { value: LeaderboardScope; label: string }[] = [
  { value: "term", label: "This semester" },
  { value: "all_time", label: "All-time" },
];

type Board = "all" | "officers";

const BOARDS: { value: Board; label: string }[] = [
  { value: "all", label: "Org" },
  { value: "officers", label: "Officers" },
];

export default function Leaderboard() {
  const { user, loading, isOfficer } = useAuth();
  const navigate = useNavigate();

  const [scope, setScope] = useState<LeaderboardScope>("term");
  const [board, setBoard] = useState<Board>("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/signin", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    const fetcher = board === "officers" ? getOfficerLeaderboard : getLeaderboard;
    fetcher(scope).then(setEntries).finally(() => setDataLoading(false));
  }, [user, scope, board]);

  if (loading || !user) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  const onBoard = entries.some((e) => e.user_id === user.id);
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const podiumOrder = [top3[1], top3[0], top3[2]].filter((e): e is LeaderboardEntry => !!e);

  return (
    <div className="lb-wrap">
      <Reveal>
        <div className="lb-head">
          <h1 className="pf-name">Leaderboard</h1>
          <div className="lb-head-tabs">
            {isOfficer && (
              <div className="lb-tabs">
                {BOARDS.map((b) => (
                  <button
                    key={b.value}
                    className={`lb-tab${board === b.value ? " active" : ""}`}
                    onClick={() => setBoard(b.value)}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
            <div className="lb-tabs">
              {SCOPES.map((s) => (
                <button
                  key={s.value}
                  className={`lb-tab${scope === s.value ? " active" : ""}`}
                  onClick={() => setScope(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        {dataLoading ? (
          <p className="pf-empty">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="pf-empty">
            No bits earned {scope === "term" ? "this semester" : ""} yet - check in at an event to get on the board.
          </p>
        ) : (
          <>
            <div className="lb-podium">
              {podiumOrder.map((e) => (
                <div key={e.user_id} className={`lb-pod lb-pod--${e.rank}`}>
                  <Avatar name={e.name} size={e.rank === 1 ? 62 : 50} accent={e.rank === 1} />
                  <span className="lb-pod-rank mono">#{e.rank}</span>
                  <span className="lb-pod-name">{e.name}</span>
                  <span className="lb-pod-points tnum">
                    {e.total_points}
                    <span className="lb-pod-bits"> bits</span>
                  </span>
                  <span className="lb-pod-bar"></span>
                </div>
              ))}
            </div>
            <div className="lb-list">
              {rest.map((e) => (
                <div key={e.user_id} className={`lb-row${e.user_id === user.id ? " me" : ""}`}>
                  <span className={`lb-rank${e.rank <= 3 ? ` lb-rank--${e.rank}` : ""}`}>{e.rank}</span>
                  <Avatar name={e.name} size={34} accent={e.user_id === user.id} />
                  <span className="lb-name">
                    {e.name}
                    {e.user_id === user.id && <span className="lb-you mono">YOU</span>}
                  </span>
                  <span className="lb-points mono">{e.total_points}</span>
                </div>
              ))}
            </div>
            {!onBoard && (
              <p className="pf-empty lb-not-ranked">
                You haven't earned any bits {scope === "term" ? "this semester" : ""} yet - check in at an event to get on the board.
              </p>
            )}
          </>
        )}
      </Reveal>
    </div>
  );
}
