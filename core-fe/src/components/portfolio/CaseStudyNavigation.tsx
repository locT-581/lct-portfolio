import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/cms";

export interface CaseStudyNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
  locale: string;
  labels: {
    previousProject: string;
    nextProject: string;
    allProjects: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  className?: string;
}

/**
 * `<CaseStudyNavigation>` Minimalist project pager and CTA banner.
 */
export function CaseStudyNavigation({
  prevProject,
  nextProject,
  locale,
  labels,
  className = "",
}: CaseStudyNavigationProps) {
  return (
    <footer
      className={cn(
        "flex flex-col gap-8 w-full pt-8 border-t border-stroke",
        className,
      )}
    >
      {/* 1. Prev & Next Project Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Previous Project Card */}
        {prevProject ? (
          <Link
            href={`/${locale}/projects/${prevProject.slug}`}
            className="group flex flex-col gap-1.5 p-5 rounded-xl border border-stroke bg-bg-base-2 hover:border-brand-orange/40 transition-colors"
          >
            <span className="flex items-center gap-1.5 text-body-s-regular text-text-secondary group-hover:text-brand-orange transition-colors">
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
                <path d="m15 18-6-6 6-6" />
              </svg>
              {labels.previousProject}
            </span>
            <span className="text-h6 text-text-primary group-hover:text-brand-orange transition-colors line-clamp-1">
              {prevProject.name}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Next Project Card */}
        {nextProject ? (
          <Link
            href={`/${locale}/projects/${nextProject.slug}`}
            className="group flex flex-col gap-1.5 p-5 rounded-xl border border-stroke bg-bg-base-2 hover:border-brand-orange/40 transition-colors sm:items-end text-left sm:text-right"
          >
            <span className="flex items-center justify-end gap-1.5 text-body-s-regular text-text-secondary group-hover:text-brand-orange transition-colors">
              {labels.nextProject}
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
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
            <span className="text-h6 text-text-primary group-hover:text-brand-orange transition-colors line-clamp-1">
              {nextProject.name}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      {/* 2. Minimalist Contact CTA Banner */}
      <div className="rounded-2xl border border-stroke bg-bg-base-2 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1 max-w-lg">
          <h2 className="text-h5 font-semibold text-text-primary">
            {labels.ctaTitle}
          </h2>
          <p className="text-body-m-regular text-text-secondary">
            {labels.ctaDescription}
          </p>
        </div>

        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center justify-center h-10 px-5 rounded text-btn bg-brand-orange text-text-btn-primary hover:opacity-90 transition-opacity shrink-0"
        >
          {labels.ctaButton}
        </Link>
      </div>
    </footer>
  );
}

export default CaseStudyNavigation;
