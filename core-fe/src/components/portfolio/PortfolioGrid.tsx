import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";
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
 * Grid layout per Framer design spec (`oVI4dxipr` / `AShdIf7RZ`):
 * - Desktop: 2-column grid (`grid-cols-2`, `gap-x-3 gap-y-5`)
 * - Tablet / Mobile: 1-column grid (`grid-cols-1`, `gap-y-8`)
 *
 * Handles the empty state gracefully when no projects are returned.
 * Strictly follows RSC paradigm (AD-1), design tokens (AD-8).
 */
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
      {/* Responsive grid with ScrollReveal staggered entry animations */}
      <ScrollReveal animation="fade-up" stagger={0.08} selector="li">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-8 md:gap-y-5">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  );
}

export default PortfolioGrid;
