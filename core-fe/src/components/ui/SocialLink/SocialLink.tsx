import { useTranslations } from "next-intl";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Supported social platform identifiers.
 */
export type SocialPlatform =
  | "email"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "github"
  | (string & {});

/**
 * Props for the `<SocialLink>` component.
 */
export interface SocialLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Social media platform key (email, twitter, instagram, linkedin, github, or custom).
   */
  platform: SocialPlatform;
  /**
   * Target URL or mailto link.
   */
  href: string;
  /**
   * Accessible text label or visible text label.
   */
  label?: string;
  /**
   * If true, renders icon only with hidden accessible text for screen readers.
   * @default true
   */
  iconOnly?: boolean;
  /**
   * Custom inline SVG icon override.
   */
  customIcon?: ReactNode;
  /**
   * Additional CSS class names to extend default styles.
   */
  className?: string;
}

/**
 * Inline SVG components matching Iconoir / Figma icon names (`mail-02`, `new-twitter`, `instagram`, `linkedin-02`, `github`).
 */
function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L1 7" />
    </svg>
  );
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

/**
 * `<SocialLink>` component rendering an accessible social media icon link.
 *
 * Adheres to WCAG 2.1 AA requirements with proper `aria-label`, hover states, and design token integration.
 */
export function SocialLink({
  platform,
  href,
  label,
  iconOnly = true,
  customIcon,
  className = "",
  ...props
}: SocialLinkProps) {
  const t = useTranslations("social");

  const platformDefaults: Record<string, { label: string; icon: ReactNode }> = {
    email: { label: t("email"), icon: <MailIcon /> },
    twitter: { label: t("twitter"), icon: <TwitterIcon /> },
    instagram: { label: t("instagram"), icon: <InstagramIcon /> },
    linkedin: { label: t("linkedin"), icon: <LinkedinIcon /> },
    github: { label: t("github"), icon: <GithubIcon /> },
  };

  const platformInfo = platformDefaults[platform] ?? {
    label: platform,
    icon: <MailIcon />,
  };

  const displayLabel = label ?? platformInfo.label;
  const icon = customIcon ?? platformInfo.icon;

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={displayLabel}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 p-1.5 rounded border border-stroke bg-bg-base-1 text-text-secondary hover:text-text-primary hover:bg-bg-base-2 transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange",
        className,
      )}
      {...props}
    >
      <span className="shrink-0">{icon}</span>
      {!iconOnly && <span className="text-body-s-medium">{displayLabel}</span>}
    </a>
  );
}
