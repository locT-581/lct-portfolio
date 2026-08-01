import { HTTPError } from "ky";
import type { Project, ProjectDetail } from "@/types/cms";
import { client } from "./_client";

export async function getProjects({
  locale,
}: {
  locale: string;
}): Promise<Project[]> {
  try {
    return await client
      .get("projects", { searchParams: { locale } })
      .json<Project[]>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch projects",
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
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
    return await client
      .get(`projects/${encodeURIComponent(slug)}`, { searchParams: { locale } })
      .json<ProjectDetail>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || `Failed to fetch project ${slug}`,
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}
