import Image from "next/image";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { cn } from "@/lib/utils";
import type { ProjectDetail } from "@/types/cms";
import { PeriodLabel } from "../ui/PeriodLabel";

export interface CaseStudyHeroProps {
  project: ProjectDetail;
  labels: {
    visitLive: string;
    viewSource: string;
    role: string;
    client: string;
    timeline: string;
    platform: string;
    teamSize: string;
    techStack: string;
  };
  className?: string;
}

/**
 * `<CaseStudyHero>` Minimalist, refined Hero component matching the portfolio design language.
 */
export function CaseStudyHero({
  project,
  labels,
  className = "",
}: CaseStudyHeroProps) {
  const {
    name,
    shortDescription,
    techStack,
    githubUrl,
    liveUrl,
    clientName,
    workingPeriod,
    projectType,
    role,
    teamSize,
    logoUrl,
  } = project;

  return (
    <header className={cn("flex flex-col gap-8 w-full", className)}>
      {/* Showcase Cover Image */}
      {logoUrl && (
        <div className="relative w-full aspect-16/10 md:aspect-video rounded-2xl overflow-hidden bg-bg-base-2">
          <Image
            src={logoUrl}
            alt={`${name} cover screenshot`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
            className="object-cover"
          />
        </div>
      )}

      {/* Top Header: Badge, Title, Description, Buttons */}
      <div className="flex flex-col gap-4 w-full">
        {/* Category & Period Row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {projectType && (
            <PeriodLabel className="border border-stroke font-medium">
              {projectType}
            </PeriodLabel>
          )}
        </div>

        {/* Project Title */}
        <h1 className="text-h1 text-text-primary font-semibold tracking-tight">
          {name}
        </h1>

        {/* Short Description */}
        {shortDescription && (
          <p className="text-body-m-regular text-text-secondary leading-relaxed max-w-3xl">
            {shortDescription}
          </p>
        )}

        {/* Action Buttons */}
        {(liveUrl || githubUrl) && (
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            {liveUrl && (
              <LinkPreview
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                previewData={{
                  title: name,
                  description: shortDescription || undefined,
                  image: logoUrl || undefined,
                }}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded text-btn bg-brand-orange text-text-btn-primary hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
                <span>{labels.visitLive}</span>
                <svg
                  width="14"
                  height="14"
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
              </LinkPreview>
            )}

            {githubUrl && (
              <LinkPreview
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                previewData={{
                  title: `${name} — GitHub Repository`,
                  description: shortDescription || undefined,
                }}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded text-btn bg-bg-base-1 border border-stroke text-text-primary hover:bg-bg-base-2 transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange"
              >
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
                <span>{labels.viewSource}</span>
              </LinkPreview>
            )}
          </div>
        )}
      </div>

      {/* Metadata Specifications Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stroke w-full">
        {role && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary">
              {labels.role}
            </span>
            <span className="text-body-m-medium text-text-primary font-medium">
              {role}
            </span>
          </div>
        )}

        {clientName && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary">
              {labels.client}
            </span>
            <span className="text-body-m-medium text-text-primary font-medium">
              {clientName}
            </span>
          </div>
        )}

        {workingPeriod && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary">
              {labels.timeline}
            </span>
            <span className="text-body-m-medium text-text-primary font-medium">
              {workingPeriod}
            </span>
          </div>
        )}

        {teamSize && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary">
              {labels.teamSize}
            </span>
            <span className="text-body-m-medium text-text-primary font-medium">
              {teamSize}
            </span>
          </div>
        )}
      </div>

      {/* Tech Stack Badges */}
      {techStack && techStack.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-body-s-regular text-text-secondary mr-1">
            {labels.techStack}:
          </span>
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded bg-bg-base-2 border border-stroke text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}

export default CaseStudyHero;
