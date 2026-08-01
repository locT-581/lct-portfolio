import Image from "next/image";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types/cms";

export interface SkillsSectionProps {
  /**
   * Array of skill items from Em-dash CMS.
   */
  skills: Skill[];
  /**
   * Optional additional CSS class names.
   */
  className?: string;
}

/**
 * `<SkillsSection>` React Server Component displaying skill items with icon + label.
 *
 * - Desktop (≥1200px): 2-column flex-wrap layout
 * - Tablet (≥810px): 2-column flex-wrap layout
 * - Mobile (≤375px): single-column stacked list
 *
 * Adheres to AD-1 (RSC), AD-8 (design tokens), AD-14 (next/image with explicit dimensions).
 */
export function SkillsSection({ skills, className = "" }: SkillsSectionProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Skills"
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <SectionTag label="Skills" />

      {/* Flex-wrap: 2 cols on sm+ (≥640px), single col on mobile */}
      <div className="w-full flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-0 min-w-40 max-w-72"
            title={skill.label}
          >
            {/* 44×44 icon container with 6px padding around the image */}
            <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-bg-base-2 border border-stroke p-1.5">
              {skill.iconName ? (
                <Image
                  src={skill.iconName}
                  alt={skill.label}
                  width={44}
                  height={44}
                  className="rounded object-contain"
                />
              ) : (
                /* Fallback placeholder when no icon provided */
                <div
                  className="w-11 h-11 rounded bg-stroke"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Skill label */}
            <span className="ml-3 text-body-m-medium text-text-primary leading-tight truncate">
              {skill.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
