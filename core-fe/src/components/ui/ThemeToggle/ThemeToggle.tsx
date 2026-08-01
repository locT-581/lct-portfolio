"use client";

import { useTranslations } from "next-intl";
import {
  type ButtonHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the ThemeToggle component.
 */
export interface ThemeToggleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Additional CSS class names to extend or override default styles.
   */
  className?: string;
}

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "portfolio-theme";

/**
 * `<ThemeToggle>` component.
 *
 * Client component that allows users to toggle between dark and light themes.
 * Reads and writes theme state from document.documentElement ('data-theme')
 * and persists user preference in localStorage under 'portfolio-theme'.
 */
export function ThemeToggle({ className = "", ...props }: ThemeToggleProps) {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<Theme | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = document.documentElement.getAttribute(
      "data-theme",
    ) as Theme | null;
    if (currentTheme === "dark" || currentTheme === "light") {
      setTheme(currentTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setTheme(nextTheme);
  }, [theme]);

  const isDark = theme === "dark";
  const ariaLabel = isDark ? t("switchToLight") : t("switchToDark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={cn(
        "p-2 rounded text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange cursor-pointer",
        className,
      )}
      {...props}
    >
      <span className="sr-only">{ariaLabel}</span>
      {!mounted ? (
        <div style={{ width: 20, height: 20 }} />
      ) : isDark ? (
        /* Sun Icon for switching to light mode */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m4.93 19.07 1.41-1.41" />
          <path d="m17.66 6.34 1.41-1.41" />
        </svg>
      ) : (
        /* Moon Icon for switching to dark mode */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
