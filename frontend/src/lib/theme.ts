export type LumiTheme = "light" | "dark" | "mist";

const THEME_STORAGE_KEY = "lumi_theme";

export function getStoredTheme(): LumiTheme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as LumiTheme | null;
  if (stored === "dark" || stored === "mist" || stored === "light") {
    return stored;
  }
  return "light";
}

export function applyTheme(theme: LumiTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  
  // Set data-theme attribute
  root.setAttribute("data-theme", theme);
  
  // Update class list for Tailwind/CSS selector compatibility
  root.classList.remove("light", "dark", "mist");
  root.classList.add(theme);

  // Store in localStorage
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  // Dispatch custom event for cross-component reactive sync
  window.dispatchEvent(new CustomEvent("lumi-theme-change", { detail: { theme } }));
}

// Self-executing initialization helper
export function initTheme() {
  const current = getStoredTheme();
  applyTheme(current);
}
