(function () {
  try {
    var saved = localStorage.getItem("acm-theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch {
    // Keep the HTML's light default when browser storage is unavailable.
  }
})();
