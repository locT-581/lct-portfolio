import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "brand-orange",
        "bg-base-1",
        "bg-base-2",
        "bg-base-3",
        "text-primary",
        "text-secondary",
        "text-btn-primary",
        "stroke",
        "divider",
        "stroke-orange",
      ],
    },
    classGroups: {
      "font-size": [
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-h5",
        "text-h6",
        "text-body-m-medium",
        "text-body-m-regular",
        "text-body-s-medium",
        "text-body-s-regular",
        "text-btn",
        "text-breadcrumb",
        "text-footer",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

/**
 * Extracts plain text from Portable Text block array or returns string directly.
 */
export function extractPortableText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";

  return value
    .map((block) => {
      if (
        block &&
        typeof block === "object" &&
        Array.isArray((block as { children?: unknown[] }).children)
      ) {
        const text = (block as { children: Array<{ text?: string }> }).children
          .map((child) => child?.text || "")
          .join("");
        if (!text || text.trim().length === 0) return "";
        if ((block as { listItem?: string }).listItem === "bullet") {
          return `• ${text}`;
        }
        return text;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}
