import { useTranslations } from "next-intl";
import type { HTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/routing";
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
   * Copyright prefix symbol. Defaults to "@".
   */
  copyrightPrefix?: string;
  /**
   * Year displayed in copyright. Defaults to current year (e.g. 2026).
   */
  year?: number | string;
  /**
   * Brand name/attribution text. Defaults to "Copyseen by Somesquare".
   */
  brandName?: string;
  /**
   * Brand external link URL. Defaults to "https://somesquare.com".
   */
  brandHref?: string;
  /**
   * Label for the policy link. Defaults to "Refund Policy".
   */
  refundPolicyLabel?: string;
  /**
   * Path for the policy link. Defaults to "/refund-policy".
   */
  refundPolicyHref?: string;
  /**
   * Optional legacy list of links for custom override.
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

/**
 * `<Footer>` responsive navigation footer component.
 *
 * Implements the Framer Footer design (Node: c8H11t9VG / DvHOcLavi):
 * - Max-width 800px content container with responsive horizontal/vertical stacks
 * - Left: `@2026 Copyseen by Somesquare` with external link to Somesquare
 * - Right: `Refund Policy` internal route link
 * - Breakpoints: Desktop (lg:px-50), Tablet (md:px-25), Mobile (px-5, vertical stack)
 */
export function Footer({
  copyrightPrefix = "@",
  year,
  brandName,
  brandHref = "https://somesquare.com",
  refundPolicyLabel,
  refundPolicyHref = "/refund-policy",
  links,
  children,
  className = "",
  ...props
}: FooterProps) {
  const t = useTranslations("footer");

  const currentYear = year ?? new Date().getFullYear();
  const displayBrandName = brandName ?? t("brandName");
  const displayRefundPolicy = refundPolicyLabel ?? t("refundPolicy");

  const baseStyles =
    "w-full bg-bg-base-1 flex items-center justify-center text-footer text-text-secondary py-5 px-5 md:px-25 lg:px-50";

  return (
    <footer className={cn(baseStyles, className)} {...props}>
      <div className="w-full max-w-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-1">
        {children ? (
          children
        ) : links ? (
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                target={link.target}
                rel={link.rel}
                className="text-footer text-text-secondary hover:text-text-primary transition-colors duration-200 rounded focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center text-footer text-text-secondary">
              <span>{copyrightPrefix}</span>
              <span>{currentYear}</span>
              <span>&nbsp;</span>
              <a
                href={brandHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer text-text-secondary hover:text-text-primary transition-colors duration-200 rounded focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
                {displayBrandName}
              </a>
            </div>

            <div className="flex items-center">
              <Link
                href={refundPolicyHref}
                className="text-footer text-text-secondary hover:text-text-primary transition-colors duration-200 rounded focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
                {displayRefundPolicy}
              </Link>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
