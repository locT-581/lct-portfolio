import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
        return (block as { children: Array<{ text?: string }> }).children
          .map((child) => child?.text || "")
          .join("");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}
