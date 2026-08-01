import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Navigation item link for the Footer component.
 */
export interface FooterLinkItem {
  /**
   * Text label to display.
   */
  label: string;
  /**
   * Destination URL.
   */
  href: string;
  /**
   * Optional target attribute (e.g. `_blank` for external links).
   */
  target?: string;
  /**
   * Optional rel attribute.
   */
  rel?: string;
}

/**
 * Props for the Footer component.
 */
export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /**
   * Custom copyright notice text.
   * @default "© 2026 Loc Tran. All rights reserved."
   */
  copyrightText?: string;
  /**
   * List of links to display in the footer.
   */
  links?: FooterLinkItem[];
  /**
   * Custom children to render inside the footer container.
   */
  children?: ReactNode;
  /**
   * Additional CSS class names to extend or override default styles.
   */
  className?: string;
}

const defaultLinks: FooterLinkItem[] = [
  {
    label: "GitHub",
    href: "https://github.com",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

/**
 * `<Footer>` responsive navigation footer component.
 *
 * Implements a 54px Desktop/Tablet (80px Mobile) footer layout with design token references,
 * copyright notice, links, and keyboard focus indicators.
 */
export function Footer({
  copyrightText = "© 2026 Loc Tran. All rights reserved.",
  links = defaultLinks,
  children,
  className = "",
  ...props
}: FooterProps) {
  const baseStyles =
    "min-h-[80px] md:min-h-[54px] w-full bg-bg-base-1 border-t border-divider flex items-center justify-center text-footer text-text-secondary";

  return (
    <footer className={cn(baseStyles, className)} {...props}>
      <div className="w-full max-w-300 flex flex-col md:flex-row gap-3 md:gap-0 items-start md:items-center justify-between px-5 md:px-25 lg:px-50 py-5 md:py-0">
        {children ? (
          children
        ) : (
          <>
            <p className="text-footer text-text-secondary">{copyrightText}</p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {links.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  target={link.target}
                  rel={link.rel}
                  className="text-footer text-text-secondary hover:text-text-primary transition-colors rounded focus-visible:outline-2 focus-visible:outline-brand-orange"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
