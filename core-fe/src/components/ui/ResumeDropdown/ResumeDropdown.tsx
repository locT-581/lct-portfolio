"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ResumeItem } from "@/types/cms";

export interface ResumeDropdownProps {
  /**
   * List of resumes to display in dropdown.
   */
  resumes: ResumeItem[];
  /**
   * Default fallback button label.
   */
  label?: string;
  /**
   * Header label inside dropdown menu.
   */
  selectRoleLabel?: string;
  /**
   * Label for primary resume badge.
   */
  primaryBadgeLabel?: string;
  /**
   * Custom CSS classes.
   */
  className?: string;
}

function DownloadIcon({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DocumentIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function ResumeDropdown({
  resumes,
  label = "Download resume",
  selectRoleLabel = "Select targeted resume",
  primaryBadgeLabel = "Primary",
  className = "",
}: ResumeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!resumes || resumes.length === 0) {
    return null;
  }

  // Single resume: Render direct link matching original design
  if (resumes.length === 1) {
    const single = resumes[0];
    const resumeHref = single.slug ? `/resume/${single.slug}` : single.url;
    return (
      <a
        href={resumeHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Resume download button"
        className={cn(
          "inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-stroke bg-bg-base-1 hover:bg-bg-base-2 text-text-primary text-body-s-medium font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange",
          className,
        )}
      >
        <DownloadIcon className="w-4.5 h-4.5" />
        <span>{label}</span>
      </a>
    );
  }

  // Multiple resumes: Render interactive Dropdown
  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Download resume options"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-stroke bg-bg-base-1 hover:bg-bg-base-2 text-text-primary text-body-s-medium font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange cursor-pointer"
      >
        <DownloadIcon className="w-4.5 h-4.5" />
        <span>{label}</span>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 text-text-secondary transition-transform duration-200",
            isOpen && "rotate-180 text-brand-orange",
          )}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={selectRoleLabel}
          className="absolute left-0 top-full mt-2 z-50 min-w-72 sm:min-w-84 py-2 rounded-xl border border-stroke bg-bg-base-1/95 backdrop-blur-md shadow-2xl"
        >
          {selectRoleLabel && (
            <div className="px-4 py-2 text-caption-medium text-text-secondary border-b border-stroke/60 font-medium">
              {selectRoleLabel}
            </div>
          )}

          <div className="py-1 flex flex-col">
            {resumes.map((resume) => {
              const resumeHref = resume.slug
                ? `/resume/${resume.slug}`
                : resume.url;

              return (
                <a
                  key={resume.id}
                  href={resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="group flex items-start justify-between gap-3 px-4 py-2.5 hover:bg-bg-base-2 transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange text-left"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <DocumentIcon className="w-4 h-4 text-text-secondary group-hover:text-brand-orange mt-0.5 shrink-0 transition-colors" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-body-s-medium font-medium text-text-primary group-hover:text-brand-orange transition-colors truncate">
                          {resume.title}
                        </span>
                        {resume.isPrimary && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-brand-orange/15 text-brand-orange border border-brand-orange/30">
                            {primaryBadgeLabel}
                          </span>
                        )}
                      </div>
                      {resume.roleBadge && (
                        <span className="text-caption-regular text-text-secondary mt-0.5 line-clamp-1">
                          {resume.roleBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  <DownloadIcon className="w-4 h-4 text-text-secondary group-hover:text-brand-orange shrink-0 mt-0.5 transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeDropdown;
