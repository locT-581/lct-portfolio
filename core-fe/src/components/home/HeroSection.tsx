import Image from "next/image";
import { PortableText } from "@/components/ui/PortableText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SocialLink } from "@/components/ui/SocialLink";
import { cn } from "@/lib/utils";
import type { ProfileIntro, SocialLinkItem } from "@/types/cms";

export interface HeroSectionProps {
  /**
   * Profile intro data (avatarUrl, name, title, bio, bioRaw).
   */
  profile: ProfileIntro;
  /**
   * List of social links to render.
   */
  socialLinks: SocialLinkItem[];
  /**
   * Additional CSS class names.
   */
  className?: string;
}

/**
 * `<HeroSection>` React Server Component displaying developer profile avatar, name, title, bio, and social links.
 * Fully responsive across 1200px, 810px, and 375px viewports.
 */
export function HeroSection({
  profile,
  socialLinks,
  className = "",
}: HeroSectionProps) {
  const { avatarUrl, name, title, bio, bioRaw } = profile;

  return (
    <ScrollReveal
      animation="fade-up"
      className={cn("w-full flex flex-col gap-6 md:gap-8", className)}
    >
      <section
        aria-label="Hero section"
        className="w-full flex flex-col gap-6 md:gap-8"
      >
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center">
          <div className="relative shrink-0 overflow-hidden rounded-full border border-stroke w-19.5 h-19.5 bg-bg-base-2">
            <Image
              src={avatarUrl}
              alt={name}
              width={78}
              height={78}
              priority
              className="w-19.5 h-19.5 object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-h1 text-text-primary">
              {name}
              {title && (
                <span className="text-text-secondary text-body-m-regular font-normal ml-2">
                  — {title}
                </span>
              )}
            </h1>

            <div className="flex items-center gap-1.5 flex-wrap">
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

        <div className="max-w-2xl">
          <PortableText value={bioRaw || bio} />
        </div>
      </section>
    </ScrollReveal>
  );
}

export default HeroSection;
