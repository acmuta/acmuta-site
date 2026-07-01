import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getDirectedCommittees, type DirectedCommittee } from "@/lib/api";
import {
  BackIcon,
  DashIcon,
  CalIcon,
  DocIcon,
  UsersIcon,
  TeamIcon,
  LinkIcon,
  TableIcon,
  AuditIcon,
  HackIcon,
  NewsIcon,
} from "@/components/icons";

export interface AdminContext {
  isAdmin: boolean;
  directedCommittees: DirectedCommittee[];
}

const NAV = [
  { path: "/admin/dashboard", label: "Dashboard", icon: DashIcon },
  { path: "/admin/events", label: "Events", icon: CalIcon },
  { path: "/admin/applications", label: "Applications", icon: DocIcon },
  { path: "/admin/members", label: "Members", icon: UsersIcon },
  { path: "/admin/teams", label: "Teams", icon: TeamIcon },
  { path: "/admin/news", label: "News", icon: NewsIcon },
];

export default function AdminLayout() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const [directed, setDirected] = useState<DirectedCommittee[] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;
    getDirectedCommittees(user.id).then(setDirected);
  }, [user]);

  if (loading || (user && directed === null)) {
    return <div className="ob-loading"><div className="auth-cb-spinner" /></div>;
  }

  if (!user) return <Navigate to="/signin" replace />;

  const isAdmin = profile?.is_admin ?? false;
  const directedCommittees = directed ?? [];
  const showMentorship = isAdmin || directedCommittees.some((c) => c.slug === "educate");
  let nav = showMentorship ? [...NAV, { path: "/admin/mentorship", label: "Mentorship", icon: LinkIcon }] : NAV;
  if (isAdmin) nav = [
    ...nav,
    { path: "/admin/hackuta", label: "HackUTA", icon: HackIcon },
    { path: "/admin/roster", label: "Roster", icon: TableIcon },
    { path: "/admin/audit-log", label: "Audit log", icon: AuditIcon },
  ];

  if (!isAdmin && directedCommittees.length === 0) {
    return (
      <div className="adm-noauth">
        <h1 className="adm-noauth-h">Not authorized</h1>
        <p className="adm-noauth-p">This area is for officers and admins.</p>
        <Link to="/" className="btn btn-ghost">Back home</Link>
      </div>
    );
  }

  return (
    <div className="adm-wrap">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-head">
          <Link to="/profile" className="adm-back-link">
            <BackIcon s={15} /> Back to profile
          </Link>
          <span className={`adm-role-badge adm-role-badge--${isAdmin ? "admin" : "director"}`}>
            {isAdmin ? "Admin" : "Director"}
          </span>
        </div>
        <nav className="adm-nav">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = location.pathname.startsWith(n.path);
            return (
              <Link key={n.path} to={n.path} className={`adm-nav-link${active ? " active" : ""}`}>
                <Icon s={18} />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="adm-main">
        <Outlet context={{ isAdmin, directedCommittees } satisfies AdminContext} />
      </main>
    </div>
  );
}
