import { cn } from "@/lib/utils";
import type { ProjectDetail } from "@/types/cms";

export interface CaseStudyHeaderProps {
  /** Project detail data from Em-dash CMS */
  project: ProjectDetail;
  /** Additional CSS class names */
  className?: string;
}

/**
 * `<CaseStudyHeader>` component displaying project title, description, tech stack badges, and live/GitHub link buttons.
 */
export function CaseStudyHeader({
  project,
  className = "",
}: CaseStudyHeaderProps) {
  const { name, description, techStack, githubUrl, liveUrl } = project;

  return (
    <header className={cn("flex flex-col gap-6 w-full", className)}>
      {/* Title */}
      <h1 className="text-h1 font-bold text-text-primary tracking-tight">
        {name}
      </h1>

      {/* Description */}
      <p className="text-body-l text-text-secondary leading-relaxed max-w-3xl">
        {description}
      </p>

      {/* Tech Stack Badges */}
      {techStack && techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-caption font-medium rounded-full bg-bg-base-2 border border-stroke text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Action Links */}
      {(liveUrl || githubUrl) && (
        <div className="flex flex-wrap gap-3 items-center pt-2">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-btn font-medium bg-brand-orange text-text-btn-primary rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-brand-orange"
            >
              <span>Visit Live Site</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-btn font-medium bg-bg-base-2 text-text-primary border border-stroke rounded-lg transition-colors hover:bg-bg-base-3 focus-visible:outline-2 focus-visible:outline-brand-orange"
            >
              <span>View Source</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          )}
        </div>
      )}
    </header>
  );
}

export default CaseStudyHeader;
