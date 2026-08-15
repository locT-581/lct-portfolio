import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the `<PeriodLabel>` component.
 */
export interface PeriodLabelProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Date range or period string (e.g., "2023 - Present", "Jan 2025").
   */
  period?: string;
  /**
   * Custom child element if period is not passed directly as a string prop.
   */
  children?: ReactNode;
  /**
   * Additional CSS class names to extend default styles.
   */
  className?: string;
}

/**
 * `<PeriodLabel>` component rendering date ranges for experience entries.
 *
 * Adheres to design system specifications using `text-body-s-regular`, `bg-bg-base-2`, and `text-text-secondary`.
 */
export function PeriodLabel({
  period,
  children,
  className = "",
  ...props
}: PeriodLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-2.5 rounded-lg bg-bg-base-2 text-text-secondary text-body-s-regular",
        className,
      )}
      {...props}
    >
      {period ?? children}
    </div>
  );
}
