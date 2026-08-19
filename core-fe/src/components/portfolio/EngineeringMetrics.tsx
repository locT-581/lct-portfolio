"use client";

import { LinkPreview } from "@/components/ui/LinkPreview";
import { cn } from "@/lib/utils";
import type { EngineeringMetrics as EngineeringMetricsType } from "@/types/cms";

export interface EngineeringMetricsProps {
  metrics: EngineeringMetricsType;
  labels?: {
    engineeringMetricsTitle?: string;
    engineeringMetricsSubtitle?: string;
    verifiedAudit?: string;
    inspectAudit?: string;
    viewLighthouseReport?: string;
    testOnPageSpeed?: string;
    lighthouseScoreLabel?: string;
    lcpLabel?: string;
    clsLabel?: string;
    ttfbLabel?: string;
    close?: string;
  };
  className?: string;
}

/**
 * Official Google Lighthouse & Core Web Vitals color thresholds:
 * - Green (Good): Score 90-100, LCP <= 2.5s, CLS <= 0.1, TTFB <= 800ms
 * - Orange (Needs Improvement): Score 50-89, LCP 2.5s-4.0s, CLS 0.1-0.25, TTFB 800ms-1800ms
 * - Red (Poor): Score 0-49, LCP > 4.0s, CLS > 0.25, TTFB > 1800ms
 */
function getScoreColorClass(score: number | null | undefined): string {
  if (score === null || score === undefined) return "text-text-primary";
  if (score >= 90) return "text-emerald-500 dark:text-emerald-400";
  if (score >= 50) return "text-amber-500 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}

function parseTimeToSeconds(val: string | null | undefined): number | null {
  if (!val) return null;
  const clean = val.trim().toLowerCase();
  if (clean.endsWith("ms")) {
    const num = parseFloat(clean.replace("ms", ""));
    return Number.isNaN(num) ? null : num / 1000;
  }
  if (clean.endsWith("s")) {
    const num = parseFloat(clean.replace("s", ""));
    return Number.isNaN(num) ? null : num;
  }
  const num = parseFloat(clean);
  return Number.isNaN(num) ? null : num;
}

function getLcpColorClass(lcp: string | null | undefined): string {
  const seconds = parseTimeToSeconds(lcp);
  if (seconds === null) return "text-text-primary";
  if (seconds <= 2.5) return "text-emerald-500 dark:text-emerald-400";
  if (seconds <= 4.0) return "text-amber-500 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}

function getClsColorClass(cls: string | null | undefined): string {
  if (!cls) return "text-text-primary";
  const num = parseFloat(cls.trim());
  if (Number.isNaN(num)) return "text-text-primary";
  if (num <= 0.1) return "text-emerald-500 dark:text-emerald-400";
  if (num <= 0.25) return "text-amber-500 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}

function getTtfbColorClass(ttfb: string | null | undefined): string {
  const seconds = parseTimeToSeconds(ttfb);
  if (seconds === null) return "text-text-primary";
  if (seconds <= 0.8) return "text-emerald-500 dark:text-emerald-400";
  if (seconds <= 1.8) return "text-amber-500 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}

export function EngineeringMetrics({
  metrics,
  labels,
  className,
}: EngineeringMetricsProps) {
  const { lighthouseScore, lcp, cls, ttfb, reportFileUrl } = metrics;

  // Don't render if no metrics exist
  if (!lighthouseScore && !lcp && !cls && !ttfb) {
    return null;
  }

  // Resolve absolute URL for Google Lighthouse Viewer
  const resolvedReportUrl = reportFileUrl
    ? reportFileUrl.startsWith("http://") ||
      reportFileUrl.startsWith("https://")
      ? reportFileUrl
      : typeof window !== "undefined"
        ? `${window.location.origin}${reportFileUrl.startsWith("/") ? "" : "/"}${reportFileUrl}`
        : reportFileUrl
    : null;

  const officialViewerUrl = resolvedReportUrl
    ? `https://googlechrome.github.io/lighthouse/viewer/?jsonurl=${encodeURIComponent(resolvedReportUrl)}`
    : null;

  return (
    <section
      aria-label="Engineering & Web Performance Metrics"
      className={cn("flex flex-col gap-4 w-full my-2", className)}
    >
      {/* Section Header with System SectionTag & Actions */}
      <div className="flex flex-col justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          <h2 className="text-h3 text-text-primary font-semibold tracking-tight">
            {labels?.engineeringMetricsTitle || "Engineering & Performance"}
          </h2>
        </div>
      </div>

      {/* System Standard Metadata Strip Layout with Lighthouse Color Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-5 w-full">
        {/* Metric 1: Score */}
        {lighthouseScore !== null && lighthouseScore !== undefined && (
          <div className="flex flex-col gap-1 justify-between">
            <span className="text-body-s-regular text-text-secondary">
              {labels?.lighthouseScoreLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-h3 font-semibold opacity-90 grayscale-15",
                  getScoreColorClass(lighthouseScore),
                )}
              >
                {lighthouseScore}
              </span>
              <span className="text-body-s-regular text-text-secondary">
                /100
              </span>
            </div>
          </div>
        )}

        {/* Metric 2: LCP */}
        {lcp && (
          <div className="flex flex-col gap-1 justify-between">
            <span className="text-body-s-regular text-text-secondary">
              {labels?.lcpLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-h3 font-semibold opacity-90 grayscale-15",
                  getLcpColorClass(lcp),
                )}
              >
                {lcp}
              </span>
              <span className="text-body-s-regular text-text-secondary">
                (&lt; 2.5s)
              </span>
            </div>
          </div>
        )}

        {/* Metric 3: CLS */}
        {cls && (
          <div className="flex flex-col gap-1 justify-between">
            <span className="text-body-s-regular text-text-secondary">
              {labels?.clsLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-h3 font-semibold opacity-90 grayscale-15",
                  getClsColorClass(cls),
                )}
              >
                {cls}
              </span>
              <span className="text-body-s-regular text-text-secondary">
                (Zero Shift)
              </span>
            </div>
          </div>
        )}

        {/* Metric 4: TTFB */}
        {ttfb && (
          <div className="flex flex-col gap-1 justify-between">
            <span className="text-body-s-regular text-text-secondary">
              {labels?.ttfbLabel}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "text-h3 font-semibold opacity-90 grayscale-15",
                  getTtfbColorClass(ttfb),
                )}
              >
                {ttfb}
              </span>
              <span className="text-body-s-regular text-text-secondary">
                (Edge CDN)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons using LinkPreview */}
      <div className="flex items-center gap-3 flex-wrap">
        {officialViewerUrl && (
          <LinkPreview
            href={officialViewerUrl}
            target="_blank"
            rel="noopener noreferrer"
            previewData={{
              title: "Google Lighthouse Report",
              description:
                "Official Performance & Core Web Vitals Audit Report",
            }}
            className="inline-flex items-center justify-center gap-2 text-btn text-text-secondary italic hover:text-text-primary transition-colors"
          >
            <span>{labels?.viewLighthouseReport}</span>
            <svg
              width="12"
              height="12"
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
      </div>
    </section>
  );
}
