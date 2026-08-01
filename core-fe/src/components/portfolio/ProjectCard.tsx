import Image from "next/image";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/cms";

export interface ProjectCardProps {
  /** Project data from Em-dash CMS. */
  project: Project;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * `<ProjectCard>` React Server Component displaying a single portfolio project.
 *
 * Renders a 200×140px logo container (via `next/image`) and project name below.
 * Wrapped in a localized `Link` to `/projects/${project.slug}`.
 * Falls back to an SVG placeholder when `logoUrl` is null.
 * Fully adheres to design tokens (AD-8) and RSC paradigm (AD-1).
 */
export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  const { slug, name, logoUrl } = project;

  return (
    <Link
      href={`/projects/${slug}`}
      className={cn("group flex flex-col gap-3 w-full", className)}
      aria-label={name}
    >
      {/* Logo Container — 200×140px per Figma spec */}
      <div className="relative w-full aspect-200/140 bg-bg-base-2 border border-stroke rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 ease-out group-hover:bg-bg-base-1 group-hover:border-brand-orange/40 group-hover:shadow-sm">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            width={200}
            height={140}
            className="object-contain w-full h-full p-4 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          // SVG placeholder when logoUrl is null
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="text-text-secondary opacity-30 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
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
        )}
      </div>

      {/* Company / Project Name */}
      <p className="text-body-s-medium text-text-primary truncate transition-colors duration-200 group-hover:text-brand-orange">
        {name}
      </p>
    </Link>
  );
}

export default ProjectCard;
