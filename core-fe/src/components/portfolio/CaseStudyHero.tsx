"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useProjectFlip } from "@/components/providers/ProjectFlipProvider";
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
 * `<CaseStudyHero>` Minimalist, refined Hero component matching the portfolio design language,
 * featuring GSAP Flip shared-element transition registration and cinematic entrance animation.
 */
export function CaseStudyHero({
  project,
  labels,
  className = "",
}: CaseStudyHeroProps) {
  const {
    slug,
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

  const targetImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLElement>(null);

  const { registerTarget, isFlipping, activeTransition } = useProjectFlip();
  const isTransitionTarget = isFlipping && activeTransition?.slug === slug;

  useEffect(() => {
    if (!targetImageRef.current) {
      return;
    }

    const cleanup = registerTarget(slug, targetImageRef.current);

    return () => {
      cleanup?.();
    };
  }, [slug, registerTarget]);

  // Stagger entrance of the hero text elements and details
  useGSAP(
    () => {
      if (!heroContentRef.current) return;
      gsap.fromTo(
        heroContentRef.current.querySelectorAll(".hero-reveal"),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          delay: isTransitionTarget ? 0.2 : 0.05,
          ease: "power2.out",
        },
      );
    },
    {
      scope: heroContentRef,
      dependencies: [slug],
    },
  );

  return (
    <header
      ref={heroContentRef}
      className={cn("relative flex flex-col gap-8 w-full", className)}
    >
      {/* Showcase Cover Image with GSAP Flip Shared Element Target */}
      {logoUrl && (
        <div className="relative w-full">
          <div
            ref={targetImageRef}
            className={cn(
              "relative w-full aspect-16/10 md:aspect-video rounded-2xl overflow-hidden bg-bg-base-2 border border-stroke/70 shadow-md",
              isTransitionTarget && "opacity-0",
            )}
          >
            <Image
              src={logoUrl}
              alt={`${name} cover screenshot`}
              fill
              priority
              loading="eager"
              decoding="sync"
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Top Header: Badge, Title, Description, Buttons */}
      <div className="flex flex-col gap-4 w-full">
        {/* Category & Status Row */}
        <div className="hero-reveal flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {projectType && (
              <PeriodLabel className="border border-stroke/70 bg-bg-base-2 font-medium px-3 py-1 text-text-primary text-body-s-medium shadow-xs">
                {projectType}
              </PeriodLabel>
            )}
          </div>
        </div>

        {/* Project Title */}
        <h1 className="hero-reveal text-h2 md:text-h1 text-text-primary font-bold tracking-tight leading-tight">
          {name}
        </h1>

        {/* Short Description */}
        {shortDescription && (
          <p className="hero-reveal text-body-m-regular text-text-secondary leading-relaxed max-w-3xl">
            {shortDescription}
          </p>
        )}

        {/* Action Buttons */}
        {(liveUrl || githubUrl) && (
          <div className="hero-reveal flex items-center gap-3 pt-2 flex-wrap">
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
                className="group relative inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-btn font-medium bg-brand-orange text-text-btn-primary hover:opacity-95 shadow-[0_4px_16px_rgba(232,90,12,0.25)] hover:shadow-[0_6px_24px_rgba(232,90,12,0.38)] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-orange"
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
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
                className="group inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-btn font-medium bg-bg-base-1 border border-stroke text-text-primary hover:bg-bg-base-2 hover:border-stroke/90 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-orange"
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
      <div className="hero-reveal grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-stroke/80 w-full bg-bg-base-2/40 px-4 rounded-xl">
        {role && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary text-xs uppercase tracking-wider font-medium">
              {labels.role}
            </span>
            <span className="text-body-m-medium text-text-primary font-medium">
              {role}
            </span>
          </div>
        )}

        {clientName && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary text-xs uppercase tracking-wider font-medium">
              {labels.client}
            </span>
            <span className="text-body-m-medium text-text-primary font-medium">
              {clientName}
            </span>
          </div>
        )}

        {workingPeriod && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary text-xs uppercase tracking-wider font-medium">
              {labels.timeline}
            </span>
            <span className="text-body-m-medium text-text-primary font-medium">
              {workingPeriod}
            </span>
          </div>
        )}

        {teamSize && (
          <div className="flex flex-col gap-1">
            <span className="text-body-s-regular text-text-secondary text-xs uppercase tracking-wider font-medium">
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
        <div className="hero-reveal flex items-center gap-2 flex-wrap">
          <span className="text-body-s-regular text-text-secondary mr-1 font-medium">
            {labels.techStack}:
          </span>
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-bg-base-2 border border-stroke/70 text-text-secondary transition-colors hover:border-brand-orange/40 hover:text-text-primary"
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
