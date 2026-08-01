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
}

/**
 * `<PortfolioGrid>` React Server Component rendering a responsive grid of projects.
 *
 * Grid layout per Figma design spec:
 * - Desktop (≥1200px): 3-column grid, gap-2
 * - Tablet / Mobile:   2-column grid, gap-2
 *
 * Handles the empty state gracefully when no projects are returned.
 * Strictly follows RSC paradigm (AD-1), design tokens (AD-8).
 */
import { useTranslations } from "next-intl";

export function PortfolioGrid({
  projects,
  sectionLabel = "Portfolio",
  className = "",
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
      {/* Responsive grid: 2-col mobile/tablet, 3-col desktop */}
      <ul className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PortfolioGrid;
