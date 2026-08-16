import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PortableText } from "@/components/ui/PortableText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SocialLink } from "@/components/ui/SocialLink";
import { cn } from "@/lib/utils";
import type { ProfileIntro, SocialLinkItem } from "@/types/cms";

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
   * Optional download resume button label.
   */
  resumeLabel?: string;
  /**
   * Additional CSS class names.
   */
  className?: string;
}

function DownloadIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/**
 * `<HeroSection>` React Server Component displaying developer profile avatar, name, social links, headline, bio, and resume download.
 * Fully responsive across 1200px, 810px, and 375px viewports matching Framer design.
 */
export function HeroSection({
  profile,
  socialLinks,
  resumeLabel = "Download resume",
  className = "",
}: HeroSectionProps) {
  const { avatarUrl, name, headline, bio, bioRaw, resumeUrl } = profile;

  return (
    <section
      aria-label="About me section"
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <Breadcrumbs />

      <ScrollReveal
        animation="fade-up"
        className="w-full flex flex-col gap-6 items-start"
      >
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
              <h1 className="text-h2 font-semibold text-text-primary">
                {name}
              </h1>

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

        {/* Download Button */}
        {resumeUrl && (
          <a
            href={resumeUrl}
            download
            target={resumeUrl.startsWith("http") ? "_blank" : undefined}
            rel={
              resumeUrl.startsWith("http") ? "noopener noreferrer" : undefined
            }
            aria-label="Resume download button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-stroke bg-bg-base-1 hover:bg-bg-base-2 text-text-primary text-body-s-medium font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange"
          >
            <DownloadIcon className="w-4.5 h-4.5" />
            <span>{resumeLabel}</span>
          </a>
        )}
      </ScrollReveal>
    </section>
  );
}

export default HeroSection;
