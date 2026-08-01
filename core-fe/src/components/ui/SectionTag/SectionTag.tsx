import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the `<SectionTag>` component.
 */
export interface SectionTagProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Label text or custom content for the section tag badge.
   */
  label?: string;
  /**
   * Optional child elements if label is not passed directly.
   */
  children?: ReactNode;
  /**
   * Additional CSS class names to extend default styles.
   */
  className?: string;
}

/**
 * `<SectionTag>` component rendering a small badge visual anchor for section headers.
 *
 * Adheres to design system specifications using `text-body-s-medium`, `bg-bg-base-2`, and `text-text-secondary`.
 */
export function SectionTag({
  label,
  children,
  className = "",
  ...props
}: SectionTagProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-2.5 rounded-lg bg-bg-base-2 text-text-secondary text-body-s-medium",
        className,
      )}
      {...props}
    >
      {label ?? children}
    </div>
  );
}
