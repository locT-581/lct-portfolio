"use client";

import { useTranslations } from "next-intl";
import { MagicBento } from "@/components/ui/MagicBento";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/cms";
import { ProjectCard } from "./ProjectCard";

export interface PortfolioGridProps {
  /** Array of project entries from Em-dash CMS. */
  projects: Project[];
  /** Optional section label (for accessibility). */
  sectionLabel?: string;
  /** Additional CSS class names. */
  className?: string;
  /** Custom glow color (RGB numbers without rgba, e.g. "232, 90, 12") */
  glowColor?: string;
}

/**
 * `<PortfolioGrid>` React Client Component rendering a responsive grid of projects
 * with clean, unboxed typography and MagicBento global cursor spotlight on media canvases.
 *
 * Grid layout per Framer design spec:
 * - Desktop: 2-column grid (`grid-cols-2`, `gap-x-5 gap-y-10`)
 * - Tablet / Mobile: 1-column grid (`grid-cols-1`, `gap-y-8`)
 */
export function PortfolioGrid({
  projects,
  sectionLabel = "Portfolio",
  className = "",
  glowColor = "232, 90, 12",
}: PortfolioGridProps) {
  const t = useTranslations("projects");

  // Empty state
  if (!projects || projects.length === 0) {
    return (
      <section
        aria-label={sectionLabel}
        className={cn(
          "w-full flex flex-col items-center justify-center py-16 gap-4 text-center",
          className,
        )}
      >
        <p className="text-text-secondary text-body-m-regular">
          {t("emptyState")}
        </p>
      </section>
    );
  }

  return (
    <section aria-label={sectionLabel} className={cn("w-full", className)}>
      <MagicBento
        glowColor={glowColor}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableStars={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        className="w-full p-0! max-w-none!"
        gridClassName="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 w-full"
      >
        {projects.map((project, index) => (
          <div key={project.id} className="project-item w-full">
            <ProjectCard
              project={project}
              glowColor={glowColor}
              priority={index < 4}
            />
          </div>
        ))}
      </MagicBento>
    </section>
  );
}

export default PortfolioGrid;
