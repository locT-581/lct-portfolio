import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PortableText } from "@/components/ui/PortableText";
import { ResumeDropdown } from "@/components/ui/ResumeDropdown";
import { SocialLink } from "@/components/ui/SocialLink";
import { cn } from "@/lib/utils";
import type { ProfileIntro, ResumeItem, SocialLinkItem } from "@/types/cms";

export interface HeroSectionProps {
  /**
   * Profile intro data (avatarUrl, name, title, headline, bio, bioRaw, resumeUrl).
   */
  profile: ProfileIntro;
  /**
   * List of social links to render.
   */
  socialLinks: SocialLinkItem[];
  /**
   * List of targeted resumes. If omitted or empty, falls back to profile.resumeUrl.
   */
  resumes?: ResumeItem[];
  /**
   * Optional download resume button label.
   */
  resumeLabel?: string;
  /**
   * Header label for dropdown menu.
   */
  selectRoleLabel?: string;
  /**
   * Badge label for primary resume.
   */
  primaryBadgeLabel?: string;
  /**
   * Additional CSS class names.
   */
  className?: string;
}

/**
 * `<HeroSection>` React Server Component displaying developer profile avatar, name, social links, headline, bio, and resume download.
 * Fully responsive across 1200px, 810px, and 375px viewports matching Framer design.
 */
export function HeroSection({
  profile,
  socialLinks,
  resumes = [],
  resumeLabel = "Download resume",
  selectRoleLabel,
  primaryBadgeLabel,
  className = "",
}: HeroSectionProps) {
  const { avatarUrl, name, headline, bio, bioRaw, resumeUrl } = profile;

  // Active resumes: prefer passed `resumes` list, fallback to `profile.resumeUrl` if available
  const activeResumes: ResumeItem[] =
    resumes.length > 0
      ? resumes
      : resumeUrl
        ? [
            {
              id: "profile-resume",
              slug: "default",
              title: resumeLabel,
              url: resumeUrl,
              isPrimary: true,
              orderIndex: 0,
            },
          ]
        : [];

  return (
    <section
      aria-label="About me section"
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <Breadcrumbs />
      <div className="w-full flex flex-col gap-8 items-start">
        {/* Profile Container */}
        <div className="flex flex-row gap-6 items-center">
          <div className="relative shrink-0 overflow-hidden rounded-xl border border-stroke w-19.5 h-19.5 bg-bg-base-2">
            <Image
              src={avatarUrl}
              alt={name}
              width={78}
              height={78}
              priority
              className="w-19.5 h-19.5 object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-3">
            <h1 className="text-h2 font-semibold text-text-primary">{name}</h1>

            <div className="flex items-center gap-1 flex-wrap">
              {socialLinks.map((link) => (
                <SocialLink
                  key={`${link.platform}-${link.url}`}
                  platform={link.platform}
                  href={link.url}
                  label={link.label}
                  iconOnly
                />
              ))}
            </div>
          </div>
        </div>

        {/* Introduction container */}
        <div className="w-full flex flex-col gap-2">
          {headline && (
            <p className="text-text-primary text-body-m-medium font-medium">
              {headline}
            </p>
          )}

          <div className="text-text-secondary text-body-m-regular leading-normal sm:leading-relaxed whitespace-pre-line">
            {bioRaw ? <PortableText value={bioRaw} /> : <p>{bio}</p>}
          </div>
        </div>
      </div>

      {/* Download Button / Multiple Resumes Dropdown */}
      <ResumeDropdown
        resumes={activeResumes}
        label={resumeLabel}
        selectRoleLabel={selectRoleLabel}
        primaryBadgeLabel={primaryBadgeLabel}
      />
    </section>
  );
}

export default HeroSection;
