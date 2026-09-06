"use client";

import Image from "next/image";
import { useRef } from "react";
import { useProjectFlip } from "@/components/providers/ProjectFlipProvider";
import { ParticleCard } from "@/components/ui/MagicBento";
import { PeriodLabel } from "@/components/ui/PeriodLabel";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/cms";

export interface ProjectCardProps {
  /** Project data from Em-dash CMS. */
  project: Project;
  /** Additional CSS class names. */
  className?: string;
  /** Custom glow color (RGB numbers without rgba, e.g. "232, 90, 12") */
  glowColor?: string;
  /** Enable particle stars on hover */
  enableStars?: boolean;
  /** Enable 3D tilt effect on hover */
  enableTilt?: boolean;
  /** Enable magnetism effect on hover */
  enableMagnetism?: boolean;
  /** Enable click ripple effect */
  clickEffect?: boolean;
  /** Preload image with high priority (above-the-fold) */
  priority?: boolean;
}

/**
 * `<ProjectCard>` Clean, unboxed modern portfolio project card with GSAP Flip transition.
 *
 * Design principles:
 * - Eliminates rigid double-border nesting: the interactive media container is the sole Bento canvas.
 * - Typography breathes naturally underneath with clear visual hierarchy.
 * - Seamlessly participates in GPU-accelerated GSAP Flip shared-element transition on click.
 * - Ambient glow backdrop, floating glass badge, and crisp micro-animations.
 */
export function ProjectCard({
  project,
  className = "",
  glowColor = "232, 90, 12",
  enableStars = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  priority = false,
}: ProjectCardProps) {
  const { slug, name, logoUrl, shortDescription, projectType, workingPeriod } =
    project;
  const { triggerTransition, activeTransition } = useProjectFlip();
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const isCurrentTransitionSource = activeTransition?.slug === slug;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only trigger transition on left click without modifier keys (Cmd/Ctrl/Shift/Alt)
    if (
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      imageContainerRef.current
    ) {
      triggerTransition(slug, imageContainerRef.current, {
        logoUrl,
        projectType,
        name,
      });
    }
  };

  return (
    <Link
      href={`/projects/${slug}`}
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col gap-3.5 w-full outline-none select-none",
        className,
      )}
      aria-label={name}
    >
      {/* Interactive Bento Media Canvas */}
      <div ref={imageContainerRef} className="w-full">
        <ParticleCard
          className={cn(
            "card card--border-glow relative w-full h-60 sm:h-64 bg-bg-base-2 border border-stroke/70 rounded-2xl overflow-hidden flex items-center justify-center transition-[box-shadow,border-color,transform] duration-300 ease-out group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] group-hover:border-stroke cursor-pointer",
            isCurrentTransitionSource && "opacity-0",
          )}
          glowColor={glowColor}
          particleCount={enableStars ? 3 : 0}
          enableTilt={enableTilt}
          enableMagnetism={enableMagnetism}
          clickEffect={clickEffect}
        >
          {/* Project Type Badge (Top-left floating pill) */}
          {projectType && (
            <PeriodLabel className="absolute top-3 left-3 z-10 border border-stroke/50 bg-bg-base-1/85 backdrop-blur-md text-text-primary text-body-s-medium px-2.5 py-1 shadow-xs transition-transform duration-300 group-hover:-translate-y-px">
              {projectType}
            </PeriodLabel>
          )}

          {logoUrl ? (
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={logoUrl}
                alt={name}
                fill
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover w-full h-full transition-transform duration-700 ease-out"
              />
              {/* Subtle top glare reflection */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-text-secondary opacity-25">
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
        </ParticleCard>
      </div>

      {/* Details Section — Clean, unboxed typography with generous breathing space */}
      <div className="flex flex-col gap-1.5 w-full px-0.5">
        {workingPeriod && (
          <span className="text-body-s-regular text-text-secondary font-medium tracking-wide">
            {workingPeriod}
          </span>
        )}

        <h2 className="text-h6 font-semibold text-text-primary transition-colors duration-200 group-hover:text-brand-orange flex items-center justify-between gap-2">
          <span>{name}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-brand-orange shrink-0"
            aria-hidden="true"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </h2>

        {shortDescription && (
          <p className="text-body-m-regular text-text-secondary line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
}

export default ProjectCard;
