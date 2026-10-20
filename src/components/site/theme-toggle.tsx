"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { getTheme, setTheme, subscribeToThemeChanges } from "@/lib/theme";

export function ThemeToggle() {
  useEffect(() => subscribeToThemeChanges(), []);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      onClick={() => setTheme(getTheme() === "dark" ? "light" : "dark")}
    >
      <span className="theme-toggle-light" aria-hidden="true">
        <Sun aria-hidden="true" size={18} />
      </span>
      <span className="theme-toggle-dark" aria-hidden="true">
        <Moon aria-hidden="true" size={18} />
      </span>
    </button>
  );
}
