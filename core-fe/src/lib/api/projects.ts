import { HTTPError } from "ky";
import { extractMediaUrl } from "@/lib/api/about";
import { extractPortableText } from "@/lib/utils";
import type { Project, ProjectDetail, ProjectType } from "@/types/cms";
import { client, type EmdashApiResponse } from "./_client";

interface EmdashProjectTypeItem {
  id: string;
  slug: string;
  data: {
    name: string;
    description?: string;
    order_index?: number;
  };
}

interface EmdashProjectItem {
  id: string;
  slug: string;
  data: {
    title: string;
    short_description?: string;
    full_description?: unknown;
    thumbnail?: unknown;
    live_demo_url?: string | null;
    github_url?: string | null;
    is_featured?: boolean | number;
    order_index?: number;
    technologies?: string[];
    project_type?: string;
    project_type_id?: string;
    working_period?: string;
    client_name?: string;
  };
}

/**
 * Fetch all available project types / categories dynamically from Emdash CMS for the requested locale.
 */
export async function getProjectTypes({
  locale,
}: {
  locale: string;
}): Promise<ProjectType[]> {
  try {
    const res = await client
      .get("content/project_types", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashProjectTypeItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const sorted = [...res.data.items].sort(
        (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
      );

      return sorted.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.data.name,
        description: item.data.description || null,
        orderIndex: item.data.order_index,
      }));
    }
    return [];
  } catch (err) {
    console.warn("[Em-dash API] getProjectTypes failed:", err);
    return [];
  }
}

/**
 * Fetch all projects dynamically from Emdash CMS with localized project type names.
 */
export async function getProjects({
  locale,
}: {
  locale: string;
}): Promise<Project[]> {
  try {
    const [projectsRes, projectTypes] = await Promise.all([
      client
        .get("content/projects", { searchParams: { locale } })
        .json<EmdashApiResponse<EmdashProjectItem>>(),
      getProjectTypes({ locale }),
    ]);

    if (
      projectsRes?.success &&
      Array.isArray(projectsRes.data?.items) &&
      projectsRes.data.items.length > 0
    ) {
      const sorted = [...projectsRes.data.items].sort(
        (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
      );

      return sorted.map((item) => {
        const logoUrl = extractMediaUrl(item.data.thumbnail);
        const typeSlug = item.data.project_type || "";
        const matchedType = projectTypes.find(
          (pt) => pt.slug === typeSlug || pt.id === typeSlug,
        );
        const typeName = matchedType?.name || typeSlug || undefined;

        return {
          id: item.id,
          slug: item.slug,
          name: item.data.title,
          logoUrl: logoUrl || null,
          shortDescription: item.data.short_description || "",
          projectType: typeName,
          projectTypeId: typeSlug || undefined,
          workingPeriod: item.data.working_period,
          clientName: item.data.client_name,
          techStack: item.data.technologies || [],
          githubUrl: item.data.github_url || null,
          liveUrl: item.data.live_demo_url || null,
        };
      });
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

/**
 * Fetch project details by slug from Emdash CMS with localized project type name.
 */
export async function getProjectBySlug({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}): Promise<ProjectDetail> {
  try {
    const [projectsRes, projectTypes] = await Promise.all([
      client
        .get("content/projects", { searchParams: { locale } })
        .json<EmdashApiResponse<EmdashProjectItem>>(),
      getProjectTypes({ locale }),
    ]);

    if (projectsRes?.success && Array.isArray(projectsRes.data?.items)) {
      const item = projectsRes.data.items.find(
        (p) => p.slug === slug || p.id === slug,
      );

      if (item) {
        const logoUrl = extractMediaUrl(item.data.thumbnail);
        const typeSlug = item.data.project_type || "";
        const matchedType = projectTypes.find(
          (pt) => pt.slug === typeSlug || pt.id === typeSlug,
        );
        const typeName = matchedType?.name || typeSlug || undefined;

        return {
          id: item.id,
          slug: item.slug,
          name: item.data.title,
          logoUrl: logoUrl || null,
          shortDescription: item.data.short_description || "",
          projectType: typeName,
          projectTypeId: typeSlug || undefined,
          workingPeriod: item.data.working_period,
          clientName: item.data.client_name,
          techStack: item.data.technologies || [],
          githubUrl: item.data.github_url || null,
          liveUrl: item.data.live_demo_url || null,
          description:
            extractPortableText(item.data.full_description) ||
            item.data.short_description ||
            "",
          media: logoUrl ? [{ type: "image", url: logoUrl }] : null,
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
