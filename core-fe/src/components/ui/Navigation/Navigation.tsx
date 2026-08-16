"use client";

import { useTranslations } from "next-intl";
import type { HTMLAttributes, ReactNode } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Represents a single navigation item.
 */
export interface NavItem {
  /**
   * Display text for the navigation link (e.g. "About me", "Service").
   */
  label: string;
  /**
   * Target URL or route for the link.
   */
  href: string;
  /**
   * Optional custom icon to display in mobile navigation view.
   */
  icon?: ReactNode;
}

/**
 * Props for the Navigation component.
 */
export interface NavigationProps extends HTMLAttributes<HTMLElement> {
  /**
   * Array of navigation items to render. Defaults to standard portfolio sections.
   */
  items?: NavItem[];
  /**
   * Currently active path or href to highlight active navigation link.
   */
  activePath?: string;
  /**
   * Additional CSS class names to extend or override default styles.
   */
  className?: string;
}

/**
 * Default SVG Icons for Mobile Navigation view.
 */
function UserIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PortfolioIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/**
 * `<Navigation>` component for site orientation and section navigation.
 *
 * Renders as a left sidebar (103px wide, vertical stack) on Desktop/Tablet (viewport ≥810px),
 * and as a top horizontal navigation bar on Mobile (viewport <810px).
 */
export function Navigation({
  items,
  activePath,
  className = "",
  ...props
}: NavigationProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const currentPath = activePath ?? pathname;

  const defaultItems: NavItem[] = [
    { label: t("about"), href: "/", icon: <UserIcon /> },
    { label: t("portfolio"), href: "/projects", icon: <PortfolioIcon /> },
    { label: t('blog'), href: '/blog' },
  ];

  const navItems = items ?? defaultItems;
  return (
    <nav
      aria-label="Main Navigation"
      className={cn(
        // Base layout: Mobile = horizontal bar; Desktop/Tablet (≥810px) = vertical left sidebar 103px wide, sticky at top
        "flex w-full min-[810px]:w-25.75 min-[810px]:flex-col gap-1.5 items-center min-[810px]:items-stretch bg-bg-base-2 border border-divider min-[810px]:bg-transparent min-[810px]:border-none p-1.5 min-[810px]:p-0 rounded-xl min-[810px]:rounded-none shrink-0 min-[810px]:sticky min-[810px]:top-24 min-[810px]:self-start",
        className,
      )}
      {...props}
    >
      {navItems.map((item) => {
        const isActive =
          currentPath === item.href ||
          (item.href !== "/" && currentPath.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center justify-center min-[810px]:justify-start p-2.5 rounded-lg text-body-m-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange shrink-0",
              // Responsive active state colors matching design tokens
              isActive
                ? "bg-bg-base-1 min-[810px]:bg-bg-base-2 min-[810px]:border min-[810px]:border-divider text-text-primary shadow-xs min-[810px]:shadow-none"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-base-2/50",
            )}
          >
            {/* Desktop / Tablet label (≥810px) */}
            <span className="hidden min-[810px]:inline whitespace-nowrap">
              {item.label}
            </span>
            {/* Mobile icon (<810px) */}
            <span className="min-[810px]:hidden size-6 flex items-center justify-center">
              {item.icon ?? <UserIcon />}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
