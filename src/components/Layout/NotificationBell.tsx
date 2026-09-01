import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getUnreadNotificationCount } from "@/lib/api";
import { Bell } from "@/components/icons";

const POLL_MS = 60_000;

export function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const refresh = () => {
      getUnreadNotificationCount(user.id).then((n) => {
        if (!cancelled) setUnread(n);
      });
    };

    refresh();
    const interval = setInterval(refresh, POLL_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, [user, location.pathname]);

  if (!user) return null;

  return (
    <button
      className="hdr-bell"
      aria-label={unread > 0 ? `${unread} unread notifications` : "Notifications"}
      title="Notifications"
      onClick={() => navigate("/notifications")}
    >
      <Bell s={20} />
      {unread > 0 && <span className="hdr-bell-dot">{unread}</span>}
    </button>
  );
}
