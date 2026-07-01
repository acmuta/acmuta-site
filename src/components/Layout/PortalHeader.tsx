import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/lib/auth";
import { NotificationBell } from "./NotificationBell";

function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );
  useEffect(() => {
    const handler = () =>
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);
  return theme;
}

export function PortalHeader() {
  const { user, profile } = useAuth();
  const name = profile?.full_name ?? user?.email ?? null;
  const theme = useTheme();
  const logo = theme === "dark"
    ? "/assets/logo/acmlogo-white.png"
    : "/assets/logo/acmlogo-black.png";

  return (
    <header className="phdr">
      <div className="phdr-in">
        <div className="phdr-l">
          <Link to="/" className="acm-mark" aria-label="ACM at UTA home">
            <img
              src={logo}
              alt=""
              width={26}
              height={26}
              style={{ objectFit: "contain" }}
              aria-hidden="true"
            />
            <span className="acm-word">
              ACM<span style={{ color: "var(--text-faint)" }}>·</span>UTA
            </span>
          </Link>
          <span className="phdr-tag mono">PORTAL</span>
        </div>
        <div className="phdr-r">
          <ThemeToggle />
          <NotificationBell />
          <Link to="/profile" className="phdr-me" aria-label="Your profile">
            <Avatar name={name} size={32} accent />
          </Link>
        </div>
      </div>
    </header>
  );
}
