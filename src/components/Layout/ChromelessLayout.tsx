import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export function ChromelessLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return <Outlet />;
}
