import { useTranslations } from "next-intl";
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
   * Copyright prefix symbol. Defaults to "©".
   */
  copyrightPrefix?: string;
  /**
   * Year displayed in copyright. Defaults to current year (e.g. 2026).
   */
  year?: number | string;
  /**
   * Brand name/attribution text. Defaults to localized name from footer.brandName.
   */
  brandName?: string;
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
 * `<Footer>` responsive navigation footer component displaying localized copyright text.
 */
export function Footer({
  copyrightPrefix = "©",
  year,
  brandName,
  links,
  children,
  className = "",
  ...props
}: FooterProps) {
  const t = useTranslations("footer");

  const currentYear = year ?? new Date().getFullYear();
  const displayBrandName = brandName ?? t("brandName");

  const baseStyles =
    "w-full bg-bg-base-1 flex items-center justify-center text-footer text-text-secondary py-5 px-5 md:px-25 lg:px-50";

  return (
    <footer className={cn(baseStyles, className)} {...props}>
      <div className="w-full max-w-200 flex items-center justify-end">
        {children ? (
          children
        ) : links ? (
          <div className="flex flex-wrap items-center justify-end gap-4 md:gap-6">
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
          <p className="text-footer text-text-secondary select-none text-right">
            {copyrightPrefix} {currentYear} {displayBrandName}
          </p>
        )}
      </div>
    </footer>
  );
}

export default Footer;
