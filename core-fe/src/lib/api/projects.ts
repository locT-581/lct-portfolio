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
    role?: string;
    team_size?: string;
    gallery?: unknown;
    lighthouse_score?: number | null;
    metric_lcp?: string | null;
    metric_cls?: string | null;
    metric_ttfb?: string | null;
    lighthouse_report_file?: unknown;
    audit_metadata?: unknown;
  };
}

function parseEngineeringMetrics(
  data: EmdashProjectItem["data"],
): Project["engineeringMetrics"] {
  const hasMetrics =
    (data.lighthouse_score !== undefined && data.lighthouse_score !== null) ||
    Boolean(data.metric_lcp) ||
    Boolean(data.metric_cls) ||
    Boolean(data.metric_ttfb) ||
    Boolean(data.lighthouse_report_file);

  if (!hasMetrics) return null;

  const reportFileUrl =
    extractMediaUrl(data.lighthouse_report_file) ||
    (typeof data.lighthouse_report_file === "string"
      ? data.lighthouse_report_file
      : null);

  let metadata = null;
  if (typeof data.audit_metadata === "object" && data.audit_metadata !== null) {
    metadata = data.audit_metadata as Project["engineeringMetrics"] extends {
      metadata?: infer M;
    }
      ? M
      : never;
  } else if (typeof data.audit_metadata === "string") {
    try {
      metadata = JSON.parse(data.audit_metadata);
    } catch {
      metadata = null;
    }
  }

  return {
    lighthouseScore:
      data.lighthouse_score != null ? Number(data.lighthouse_score) : null,
    lcp: data.metric_lcp || null,
    cls: data.metric_cls || null,
    ttfb: data.metric_ttfb || null,
    reportFileUrl: reportFileUrl || null,
    metadata,
  };
}

function parseGallery(
  galleryRaw: unknown,
): { type: string; url: string; caption?: string | null }[] | null {
  if (Array.isArray(galleryRaw) && galleryRaw.length > 0) {
    const items = galleryRaw
      .map((item) => {
        if (typeof item === "string")
          return { type: "image", url: extractMediaUrl(item) || item };
        if (item && typeof item === "object") {
          const url =
            extractMediaUrl(item) || (item as { url?: string }).url || "";
          if (!url) return null;
          return {
            type: (item as { type?: string }).type || "image",
            url,
            caption:
              (item as { caption?: string; alt?: string }).caption ||
              (item as { alt?: string }).alt ||
              null,
          };
        }
        return null;
      })
      .filter(
        (x): x is { type: string; url: string; caption?: string | null } =>
          x !== null && Boolean(x.url),
      );
    return items.length > 0 ? items : null;
  }
  return null;
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
        const gallery = parseGallery(item.data.gallery);

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
          role: item.data.role,
          teamSize: item.data.team_size,
          gallery:
            gallery || (logoUrl ? [{ type: "image", url: logoUrl }] : null),
          techStack: item.data.technologies || [],
          githubUrl: item.data.github_url || null,
          liveUrl: item.data.live_demo_url || null,
          engineeringMetrics: parseEngineeringMetrics(item.data),
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
        const gallery = parseGallery(item.data.gallery);

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
          role: item.data.role,
          teamSize: item.data.team_size,
          gallery:
            gallery || (logoUrl ? [{ type: "image", url: logoUrl }] : null),
          techStack: item.data.technologies || [],
          githubUrl: item.data.github_url || null,
          liveUrl: item.data.live_demo_url || null,
          engineeringMetrics: parseEngineeringMetrics(item.data),
          description:
            extractPortableText(item.data.full_description) ||
            item.data.short_description ||
            "",
          descriptionRaw: item.data.full_description ?? null,
          media:
            gallery || (logoUrl ? [{ type: "image", url: logoUrl }] : null),
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
