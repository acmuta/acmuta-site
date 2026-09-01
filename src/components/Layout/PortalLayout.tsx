import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PortalHeader } from "./PortalHeader";

export function PortalLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      <PortalHeader />
      <main className="route-view" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
}
