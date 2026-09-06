import { LinkPreview } from "@/components/ui/LinkPreview";
import { PeriodLabel } from "@/components/ui/PeriodLabel/PeriodLabel";
import { PortableText } from "@/components/ui/PortableText";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/types/cms";

export interface ExperienceSectionProps {
  /**
   * Array of experience entries from Em-dash CMS.
   */
  entries: ExperienceEntry[];
  /**
   * Optional section tag label string. Defaults to "Experience".
   */
  sectionLabel?: string;
  /**
   * Additional CSS class names.
   */
  className?: string;
}

/**
 * `<ExperienceSection>` React Server Component displaying work experience entries.
 * Features company name, role title, period label badge, description, and dividers.
 * Fully responsive across Desktop (≥1200px), Tablet (≥810px), and Mobile (≤375px).
 */
export function ExperienceSection({
  entries,
  sectionLabel = "Experiences",
  className = "",
}: ExperienceSectionProps) {
  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={sectionLabel}
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <SectionTag label={sectionLabel} />
      <div className="w-full flex flex-col gap-6 items-start">
        {entries.map((entry, index) => (
          <div
            key={entry.id || `${entry.company}-${index}`}
            className="experience-entry w-full flex flex-col gap-6"
          >
            <div className="w-full flex flex-col gap-2 max-w-2xl">
              <div className="flex items-start justify-between gap-4 w-full">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-text-primary text-body-m-medium font-medium">
                    {entry.role}
                  </h3>
                  <p className="text-text-secondary text-body-m-medium font-medium">
                    {entry.companyUrl ? (
                      <LinkPreview href={entry.companyUrl}>
                        {entry.company}
                      </LinkPreview>
                    ) : (
                      entry.company
                    )}
                    {entry.location && (
                      <span className="text-text-muted font-normal italic">
                        {" "}
                        · {entry.location}
                      </span>
                    )}
                  </p>
                </div>
                <PeriodLabel period={entry.period} className="shrink-0" />
              </div>
              <div className="text-text-secondary text-body-m-regular leading-normal sm:leading-relaxed w-full">
                {entry.descriptionRaw ? (
                  <PortableText value={entry.descriptionRaw} />
                ) : (
                  <p className="whitespace-pre-line">{entry.description}</p>
                )}
              </div>
            </div>
            {index < entries.length - 1 && (
              <div className="h-px bg-stroke w-full" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExperienceSection;
