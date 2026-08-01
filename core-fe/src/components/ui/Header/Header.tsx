import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the Header component.
 */
export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * Logo element or text to display on the left.
   */
  logo?: ReactNode;
  /**
   * Navigation items or slot to display in the middle/right section.
   */
  nav?: ReactNode;
  /**
   * Theme toggle slot/button to display on the right.
   */
  themeToggle?: ReactNode;
  /**
   * Custom children to render inside the header container.
   */
  children?: ReactNode;
  /**
   * Additional CSS class names to extend or override default styles.
   */
  className?: string;
}

/**
 * `<Header>` sticky navigation bar component.
 *
 * Implements a sticky 76px height header with backdrop blur, responsive padding,
 * design token references, and keyboard focus indicators.
 */
export function Header({
  logo,
  nav,
  themeToggle,
  children,
  className = "",
  ...props
}: HeaderProps) {
  const baseStyles =
    "sticky top-0 z-50 min-h-[76px] w-full bg-bg-base-1/80 backdrop-blur-md border-b border-divider flex items-center justify-center text-text-primary";

  return (
    <header className={cn(baseStyles, className)} {...props}>
      <div className="w-full max-w-300 flex items-center justify-between px-5 md:px-25 lg:px-50">
        {children ? (
          children
        ) : (
          <>
            <div className="flex items-center gap-4">
              {logo ?? (
                <Link
                  href="/"
                  className="font-bold text-h6 text-text-primary hover:text-brand-orange transition-colors rounded focus-visible:outline-2 focus-visible:outline-brand-orange"
                >
                  Loc Tran
                </Link>
              )}
            </div>
            {nav && <nav className="flex items-center gap-6">{nav}</nav>}
            <div className="flex items-center gap-4">
              {themeToggle ?? (
                <button
                  type="button"
                  aria-label="Toggle theme"
                  className="p-2 rounded text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange"
                >
                  <span className="sr-only">Toggle theme</span>
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
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
