import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { BackIcon, ChevronIcon } from "@/components/icons";
import { getAuditLog, type AuditLogEntry } from "@/lib/api";
import type { AdminContext } from "./AdminLayout";
import { ACTION_LABEL, ACTION_GROUPS, describeAuditEntry, formatAuditMetadata } from "./auditLabels";

const PAGE_SIZE = 25;

export default function AdminAuditLog() {
  const { isAdmin } = useOutletContext<AdminContext>();

  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getAuditLog({ limit: PAGE_SIZE, offset: page * PAGE_SIZE, action: actionFilter === "all" ? null : actionFilter })
      .then(({ entries, total }) => {
        setEntries(entries);
        setTotal(total);
      })
      .finally(() => setLoading(false));
  }, [isAdmin, page, actionFilter]);

  if (!isAdmin) {
    return <p className="pf-empty">This page is for admins only.</p>;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="adm-head">
        <h1 className="adm-h1">Audit log</h1>
        <select
          className="ob-input ob-select adm-filter"
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="all">All actions</option>
          {ACTION_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.actions.map((a) => (
                <option key={a} value={a}>{ACTION_LABEL[a] ?? a}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="ob-loading"><div className="auth-cb-spinner" /></div>
      ) : entries.length === 0 ? (
        <p className="pf-empty">No activity recorded yet.</p>
      ) : (
        <>
          <div className="adm-audit-list">
            {entries.map((e) => {
              const metadata = formatAuditMetadata(e.metadata);
              return (
                <div key={e.id} className="adm-audit-row">
                  <div className="adm-audit-main">
                    <Avatar name={e.actor_name ?? "?"} size={32} />
                    <div className="adm-audit-body">
                      <span className="adm-audit-desc">{describeAuditEntry(e)}</span>
                      <span className="adm-audit-time mono">{new Date(e.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  {metadata.length > 0 && (
                    <div className="adm-app-responses">
                      {metadata.map(({ label, value }) => (
                        <div key={label} className="adm-app-response-row">
                          <span className="adm-app-response-k">{label}</span>
                          <span className="adm-app-response-v">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="adm-pagination">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <BackIcon s={14} /> Previous
            </button>
            <span className="mono">Page {page + 1} of {totalPages}</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronIcon s={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
