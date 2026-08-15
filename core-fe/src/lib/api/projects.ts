import { HTTPError } from "ky";
import { extractPortableText } from "@/lib/utils";
import type { Project, ProjectDetail } from "@/types/cms";
import { client, type EmdashApiResponse } from "./_client";

interface EmdashProjectItem {
  id: string;
  slug: string;
  data: {
    title: string;
    short_description?: string;
    full_description?: unknown;
    thumbnail?: { url?: string } | null;
    live_demo_url?: string | null;
    github_url?: string | null;
    is_featured?: boolean | number;
    order_index?: number;
    technologies?: string[];
  };
}

export async function getProjects({
  locale,
}: {
  locale: string;
}): Promise<Project[]> {
  try {
    const res = await client
      .get("content/projects", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashProjectItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const sorted = [...res.data.items].sort(
        (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
      );

      return sorted.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.data.title,
        logoUrl: item.data.thumbnail?.url || null,
        shortDescription: item.data.short_description || "",
      }));
    }
    return [];
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch projects",
        status: err.response.status,
      };
    }
    throw {
      error: err instanceof Error ? err.message : "Unknown error",
      status: 500,
    };
  }
}

export async function getProjectBySlug({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}): Promise<ProjectDetail> {
  try {
    const res = await client
      .get("content/projects", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashProjectItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const item = res.data.items.find((p) => p.slug === slug || p.id === slug);

      if (item) {
        return {
          id: item.id,
          slug: item.slug,
          name: item.data.title,
          logoUrl: item.data.thumbnail?.url || null,
          shortDescription: item.data.short_description || "",
          description:
            extractPortableText(item.data.full_description) ||
            item.data.short_description ||
            "",
          techStack: item.data.technologies || [],
          githubUrl: item.data.github_url || null,
          liveUrl: item.data.live_demo_url || null,
          media: item.data.thumbnail?.url
            ? [{ type: "image", url: item.data.thumbnail.url }]
            : null,
        };
      }
    }

    throw {
      error: `Project not found: ${slug}`,
      status: 404,
    };
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || `Failed to fetch project ${slug}`,
        status: err.response.status,
      };
    }
    throw {
      error: err instanceof Error ? err.message : "Unknown error",
      status: 500,
    };
  }
}
