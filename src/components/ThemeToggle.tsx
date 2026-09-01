import { useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light"
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
    try {
      localStorage.setItem("acm-theme", next);
    } catch (_) {}
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle color theme">
      <span className="mono" style={{ fontSize: "0.62rem" }}>
        {theme === "dark" ? "LGT" : "DRK"}
      </span>
      <span className="tt-dot" />
    </button>
  );
}
