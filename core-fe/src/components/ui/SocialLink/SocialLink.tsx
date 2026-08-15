import { useTranslations } from "next-intl";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { LinkPreview } from "@/components/ui/LinkPreview";
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
  | "pinterest"
  | "upwork"
  | (string & {});

/**
 * Props for the `<SocialLink>` component.
 */
export interface SocialLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Social media platform key (email, twitter, instagram, linkedin, github, pinterest, upwork, or custom).
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
 * Inline SVG components matching Iconoir / Figma icon names (`mail-02`, `new-twitter`, `instagram`, `linkedin-02`, `github`, `pinterest`).
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

function PinterestIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M236.3,335.8c-1.9,7.7-3.6,14.5-5.3,21.3c-1.9,7.8-3.7,15.6-5.5,23.4c-2.2,9.5-3.9,19.1-6.7,28.3c-4,13.1-8,26.2-13.4,38.7 c-5,11.5-11.6,22.4-17.9,33.3c-5.2,8.9-11.1,17.5-16.9,26.1c-0.9,1.3-3.4,2.6-4.5,2.2c-1.4-0.5-3-2.7-3.2-4.3 c-3.8-30.3-5.8-60.8-1.8-91.2c1.6-12.3,4.9-24.3,7.4-36.5c1.6-8,3.2-16.1,4.9-24.2c2.1-9.9,4.3-19.9,6.5-29.8 c3.2-14.6,6.5-29.1,9.8-43.7c2.7-11.7,5.3-23.5,8.2-35.2c1.4-5.6-1.5-10.2-2.8-15.2c-4.3-17.2-7-34.3-3.8-52.2 c2.3-12.9,5.7-25.2,13-36.1c9.5-14.2,22.3-23.5,40.4-22.5c15.5,0.9,26.3,11,30.3,25.3c4.5,15.8,2.5,31.6-1.6,47.2 c-4.4,17-9.1,33.8-13.4,50.8c-2.7,10.6-6.6,21.2-7.2,32c-0.9,16.1,5.4,30.2,19.5,39.3c11.2,7.2,23.1,8.6,36.3,5.4 c17.5-4.3,29.6-15.2,39.8-29c12.1-16.3,18.9-34.8,24.2-54.3c6.5-24.2,9-48.6,8.5-73.5c-0.4-23-6.5-44.3-19.5-63.3 c-9.8-14.2-22.7-24.8-38.7-31.8c-10.2-4.5-20.3-8.4-31.5-8.9c-12.1-0.5-24.3-2.6-36.2-1.4c-35.9,3.9-65.6,19.7-88,48.5 c-8.9,11.5-16,24-20.7,37.5c-7.2,20.8-10.4,42.4-8.3,64.5c1.5,15.5,6,30.4,16.2,42.4c7,8.2,5.7,16.2,3.3,25 c-1.3,4.6-2.5,9.2-3.5,13.9c-1.7,8.4-6.4,12.7-16.1,8c-19.4-9.4-31.7-24.9-40.3-44.1c-12-26.9-14.1-55.3-11.3-83.9 c3.3-32.4,15.8-61.7,35-88c13.9-19,31.2-34.4,51.4-46.5c15.8-9.5,32.6-16.2,50.4-20.8c23.1-6,46.5-7.8,70-5.9 c17.6,1.4,34.6,5.6,51.1,12.4c28.5,11.8,51.8,29.9,70,54.6c10.8,14.7,19.1,30.8,24.5,48.4c3.2,10.4,5.9,20.8,6.2,31.7 c0.4,12.3,1.8,24.6,1.1,36.7c-0.7,12.9-3.3,25.8-5.3,38.6c-3.3,21.2-10.4,41.2-19.9,60.3c-8.2,16.4-18.5,31.3-31.8,44.2 c-13.4,13-28.8,22.7-46.4,29.1c-16.7,6.1-33.8,8.3-51.2,6.2c-20.7-2.6-38.2-11.9-51.3-28.7C239.4,339.1,238,337.7,236.3,335.8z" />
    </svg>
  );
}

function UpworkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.47,6.07h0a4.54,4.54,0,0,0-4.38,3.69,19.9,19.9,0,0,1-2.28-4.9H8.55l0,6a2.14,2.14,0,1,1-4.28,0l0-6L2,4.91l0,6a4.4,4.4,0,1,0,8.8-.05v-1a20.55,20.55,0,0,0,1.65,2.7l-1.38,6.61h2.32l1-4.81a5.61,5.61,0,0,0,3.11.89,4.57,4.57,0,0,0,0-9.14Zm0,6.83h0a4.09,4.09,0,0,1-2.55-1l.23-.91v-.05c.16-1,.66-2.6,2.35-2.6a2.25,2.25,0,0,1,2.27,2.24A2.41,2.41,0,0,1,17.5,12.9Z" />
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
    pinterest: { label: "Pinterest", icon: <PinterestIcon /> },
    upwork: { label: "Upwork", icon: <UpworkIcon /> },
  };

  const platformInfo = platformDefaults[platform] ?? {
    label: platform,
    icon: <MailIcon />,
  };

  const displayLabel = label ?? platformInfo.label;
  const icon = customIcon ?? platformInfo.icon;

  return (
    <LinkPreview
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
    </LinkPreview>
  );
}
