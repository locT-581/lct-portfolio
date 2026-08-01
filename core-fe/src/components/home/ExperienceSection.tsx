import { PeriodLabel } from "@/components/ui/PeriodLabel/PeriodLabel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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
  sectionLabel = "Experience",
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

      <ScrollReveal
        animation="fade-up"
        selector=".experience-entry"
        stagger={0.15}
        className="w-full flex flex-col gap-6 items-start"
      >
        <div className="w-full flex flex-col gap-6 items-start">
          {entries.map((entry, index) => (
            <div
              key={entry.id || `${entry.company}-${index}`}
              className="experience-entry w-full flex flex-col gap-6"
            >
              <div className="w-full flex flex-col gap-2 max-w-2xl">
                <div className="flex items-start justify-between gap-2 w-full">
                  <div className="flex flex-col gap-1.5 text-body-m-medium">
                    <h3 className="text-text-primary font-medium">
                      {entry.role}
                    </h3>
                    <p className="text-text-secondary font-medium">
                      {entry.company}
                    </p>
                  </div>
                  <PeriodLabel period={entry.period} className="shrink-0" />
                </div>
                <p className="text-text-secondary text-body-m-regular leading-relaxed w-full whitespace-pre-line">
                  {entry.description}
                </p>
              </div>
              {index < entries.length - 1 && (
                <div className="h-px bg-stroke w-full rounded-xs" />
              )}
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

export default ExperienceSection;
