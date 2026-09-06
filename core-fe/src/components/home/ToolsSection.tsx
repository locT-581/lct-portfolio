import Image from "next/image";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/cms";

export interface ToolsSectionProps {
  /**
   * Array of tool items from Em-dash CMS.
   */
  tools: Tool[];
  /**
   * Optional section tag label string. Defaults to "Tools".
   */
  sectionLabel?: string;
  /**
   * Optional additional CSS class names.
   */
  className?: string;
}

/**
 * `<ToolsSection>` React Server Component displaying tool logos in a horizontal row.
 *
 * - All breakpoints: horizontal flex row, each tool logo at 32×32px (icon-only via next/image)
 * - Each tool occupies a 62px-wide column cell (15px horizontal padding each side) matching Figma spec
 * - Responsive: wraps on narrow viewports
 *
 * Adheres to AD-1 (RSC), AD-8 (design tokens), AD-14 (next/image with explicit dimensions).
 */
export function ToolsSection({
  tools,
  sectionLabel = "Tools",
  className = "",
}: ToolsSectionProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={sectionLabel}
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <SectionTag label={sectionLabel} />
      {tools.map((tool) => (
        <div
          key={tool.id}
          className="tool-item flex items-center justify-center w-15.5 px-3.75"
          title={tool.name}
        >
          {tool.iconName &&
          (tool.iconName.startsWith("/") ||
            tool.iconName.startsWith("http")) ? (
            <Image
              src={tool.iconName}
              alt={tool.name}
              width={32}
              height={32}
              className="object-contain"
            />
          ) : (
            /* Fallback badge when icon is a slug or empty */
            <div
              role="img"
              aria-label={tool.name}
              className="w-8 h-8 rounded bg-bg-base-2 border border-stroke flex items-center justify-center text-caption text-text-secondary uppercase font-medium"
            >
              {tool.name.slice(0, 2)}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

export default ToolsSection;
