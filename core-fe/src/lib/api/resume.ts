import { HTTPError } from "ky";
import { extractMediaUrl } from "@/lib/api/about";
import type { ResumeItem } from "@/types/cms";
import { client, type EmdashApiResponse } from "./_client";

export interface EmdashResumeItem {
  id: string;
  slug: string;
  data: {
    title: string;
    role_badge?: string | null;
    resume_file?: unknown;
    resume_url?: string | null;
    is_primary?: boolean | number;
    order_index?: number;
  };
}

/**
 * Fetches targeted resumes list from Em-dash REST endpoint (content/resumes).
 */
export async function getResumes({
  locale,
}: {
  locale?: string;
} = {}): Promise<ResumeItem[]> {
  try {
    const searchParams: Record<string, string> = {};
    if (locale) {
      searchParams.locale = locale;
    }

    const res = await client
      .get("content/resumes", { searchParams })
      .json<EmdashApiResponse<EmdashResumeItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const items = res.data.items
        .map((item) => {
          const fileUrl = extractMediaUrl(item.data.resume_file);
          const finalUrl = fileUrl || item.data.resume_url || "";

          return {
            id: item.id,
            slug: item.slug,
            title: item.data.title || "Resume",
            roleBadge: item.data.role_badge || null,
            url: finalUrl,
            isPrimary: Boolean(item.data.is_primary),
            orderIndex: item.data.order_index ?? 99,
          };
        })
        .filter((item) => Boolean(item.url));

      // Sort by orderIndex ascending, with primary items first
      return items.sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) {
          return a.isPrimary ? -1 : 1;
        }
        return a.orderIndex - b.orderIndex;
      });
    }

    return [];
  } catch (err) {
    if (err instanceof HTTPError) {
      console.warn(
        `[Em-dash API] getResumes failed with status ${err.response.status}.`,
      );
    } else {
      console.warn("[Em-dash API] getResumes error:", err);
    }
    return [];
  }
}

/**
 * Finds a specific resume by slug or returns the primary resume.
 */
export async function getResumeBySlug(
  slug?: string,
): Promise<ResumeItem | null> {
  const resumes = await getResumes();
  if (resumes.length === 0) return null;

  if (!slug) {
    return resumes.find((r) => r.isPrimary) ?? resumes[0];
  }

  const normalized = slug.trim().toLowerCase();
  return (
    resumes.find((r) => r.slug.toLowerCase() === normalized) ||
    resumes.find((r) => r.id.toLowerCase() === normalized) ||
    null
  );
}
