import { useTranslations } from "next-intl";
import { SocialLink } from "@/components/ui/SocialLink";
import { CalendlyEmbed } from "./CalendlyEmbed";
import { ContactForm } from "./ContactForm";

export interface ContactSectionProps {
  locale: string;
  calendlyUrl?: string;
  className?: string;
}

export function ContactSection({
  locale,
  calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL,
  className = "",
}: ContactSectionProps) {
  const t = useTranslations("contact");

  const socialPlatforms = [
    { platform: "email", href: "mailto:contact@copyseen.dev" },
    { platform: "twitter", href: "https://x.com" },
    { platform: "instagram", href: "https://instagram.com" },
    { platform: "linkedin", href: "https://linkedin.com" },
    { platform: "github", href: "https://github.com" },
  ] as const;

  const hasCalendly = Boolean(calendlyUrl && calendlyUrl.trim() !== "");

  return (
    <section
      className={`w-full py-10 md:py-16 ${
        hasCalendly ? "flex flex-col gap-12 md:gap-16" : ""
      } ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left Column: Intro & Social Links */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-[24px] md:text-[28px] font-semibold text-text-primary leading-tight tracking-tight">
              {t("pageTitle")}
            </h1>
            <p className="text-body-m text-text-secondary leading-relaxed">
              {t("pageDescription")}
            </p>
          </div>

          {/* Social Links Panel (AC #4) */}
          <div className="flex flex-col gap-3 pt-2">
            <span className="text-caption font-medium text-text-secondary uppercase tracking-wider">
              {t("connectWithMe")}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {socialPlatforms.map((item) => (
                <SocialLink
                  key={item.platform}
                  platform={item.platform}
                  href={item.href}
                  iconOnly={true}
                  className="w-9 h-9 border-stroke rounded-[6px] hover:border-brand-orange"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="w-full flex justify-start md:justify-end">
          <ContactForm locale={locale} />
        </div>
      </div>

      {hasCalendly && <CalendlyEmbed url={calendlyUrl} />}
    </section>
  );
}
