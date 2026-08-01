import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
              {themeToggle ?? <ThemeToggle />}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
