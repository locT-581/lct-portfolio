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
export function ToolsSection({ tools, className = "" }: ToolsSectionProps) {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Tools"
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <SectionTag label="Tools" />

      {/* Horizontal logo row — wraps responsively */}
      <div className="flex flex-wrap items-center">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center justify-center w-15.5 px-3.75"
            title={tool.name}
          >
            {tool.iconName ? (
              <Image
                src={tool.iconName}
                alt={tool.name}
                width={32}
                height={32}
                className="object-contain"
              />
            ) : (
              /* Fallback placeholder when no icon provided */
              <div
                role="img"
                aria-label={tool.name}
                className="w-8 h-8 rounded bg-stroke"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ToolsSection;
