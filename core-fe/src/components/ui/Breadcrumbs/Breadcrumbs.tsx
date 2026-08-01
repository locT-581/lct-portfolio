import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Represents an individual item in a breadcrumb trail.
 */
export interface BreadcrumbItem {
  /**
   * Display text for the breadcrumb item (e.g. "Home", "Copyseen", "About me").
   */
  label: string;
  /**
   * Target URL for the breadcrumb link. If omitted or if item is the active page, rendered as static text.
   */
  href?: string;
}

/**
 * Props for the Breadcrumbs component.
 */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /**
   * Array of breadcrumb trail items.
   */
  items?: BreadcrumbItem[];
  /**
   * Custom separator icon or element between items. Defaults to a right arrow.
   */
  separator?: ReactNode;
  /**
   * Additional CSS class names to extend or override default styles.
   */
  className?: string;
}

/**
 * Default right arrow separator icon matching Figma design context.
 */
function ArrowRightIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export const DEFAULT_BREADCRUMB_ITEMS: BreadcrumbItem[] = [
  { label: "Copyseen", href: "/" },
  { label: "About me" },
];

/**
 * `<Breadcrumbs>` component rendering a navigational trail.
 *
 * Adheres to WCAG 2.1 AA breadcrumb navigation standards using `<nav aria-label="Breadcrumb">`
 * and `<ol>` ordered list hierarchy, styled with the `text-breadcrumb` design token utility.
 */
export function Breadcrumbs({
  items = DEFAULT_BREADCRUMB_ITEMS,
  separator = <ArrowRightIcon className="w-3.5 h-3.5 text-text-secondary" />,
  className = "",
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "content-stretch flex gap-1 items-center text-breadcrumb text-text-secondary",
        className,
      )}
      {...props}
    >
      <ol className="flex gap-1 items-center flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-1"
            >
              {index > 0 && (
                <span
                  className="inline-flex items-center shrink-0 text-text-secondary select-none"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap font-medium",
                    isLast ? "text-text-primary" : "text-text-secondary",
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="whitespace-nowrap text-text-secondary hover:text-text-primary transition-colors rounded-xs focus-visible:outline-2 focus-visible:outline-brand-orange"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
