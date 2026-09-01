import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/api";
import type { AppNotification } from "@/lib/api";
import { Reveal } from "@/components/Reveal";

export default function Notifications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<AppNotification[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/signin", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    getNotifications(user.id).then(setItems).finally(() => setDataLoading(false));
  }, [user]);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const openNotification = (n: AppNotification) => {
    if (!n.is_read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
      markNotificationRead(n.id);
    }
    if (n.link) navigate(n.link);
  };

  const markAllRead = () => {
    if (!user) return;
    setItems((prev) => prev.map((x) => ({ ...x, is_read: true })));
    markAllNotificationsRead(user.id);
  };

  if (loading || !user) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  return (
    <div className="lb-wrap">
      <Reveal>
        <div className="lb-head">
          <h1 className="pf-name">Notifications</h1>
          {unreadCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
          )}
        </div>
      </Reveal>

      <Reveal>
        {dataLoading ? (
          <p className="pf-empty">Loading…</p>
        ) : items.length === 0 ? (
          <p className="pf-empty">No notifications yet.</p>
        ) : (
          <div className="ntf-list">
            {items.map((n) => (
              <button
                key={n.id}
                className={`ntf-row${n.is_read ? "" : " unread"}`}
                onClick={() => openNotification(n)}
              >
                <span className="ntf-dot"></span>
                <div className="ntf-main">
                  <span className="ntf-title">{n.title}</span>
                  {n.body && <span className="ntf-body">{n.body}</span>}
                </div>
                <span className="ntf-time mono">
                  {new Date(n.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </button>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
