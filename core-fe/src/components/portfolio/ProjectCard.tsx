import Image from "next/image";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/cms";
import { PeriodLabel } from "../ui/PeriodLabel";

export interface ProjectCardProps {
  /** Project data from Em-dash CMS. */
  project: Project;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * `<ProjectCard>` React Server Component displaying a single portfolio project.
 *
 * Tailored for Software & Website Development projects:
 * - 240px height logo container with rounded-2xl corners and subtle stroke border.
 * - Top-left badge displaying `projectType` (e.g. "Full-stack", "Frontend", "Mobile").
 * - 72×72px centered logo with smooth hover scaling.
 * - Details section: working period, project title (`text-h6`), and short description (`line-clamp-2`).
 */
export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const { slug, name, logoUrl, shortDescription, projectType, workingPeriod } =
    project;

  return (
    <Link
      href={`/projects/${slug}`}
      className={cn("group flex flex-col gap-3 w-full", className)}
      aria-label={name}
    >
      {/* Top Logo Container — 240px height, rounded-2xl */}
      <div className="relative w-full h-60 bg-bg-base-2 border border-stroke rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-300 ease-out group-hover:border-brand-orange/40">
        {/* Project Type Badge (Top-left) */}
        {projectType && (
          <PeriodLabel className="absolute top-2.5 left-2.5 z-10 border border-stroke">
            {projectType}
          </PeriodLabel>
        )}

        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-text-secondary opacity-30">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:scale-105"
            >
              <rect
                x="4"
                y="4"
                width="32"
                height="32"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="14" cy="16" r="3" fill="currentColor" />
              <path
                d="M4 28l9-8 6 6 5-5 12 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-1.5 w-full">
        {workingPeriod && (
          <span className="text-body-s-regular text-text-secondary">
            {workingPeriod}
          </span>
        )}

        <h2 className="text-h6 font-semibold text-text-primary transition-colors duration-200 group-hover:text-brand-orange">
          {name}
        </h2>

        {shortDescription && (
          <p className="text-body-m-regular text-text-secondary line-clamp-2">
            {shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
}

export default ProjectCard;
