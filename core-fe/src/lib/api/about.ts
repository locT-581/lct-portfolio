import { HTTPError } from "ky";
import type { ExperienceEntry, Skill, SocialLink, Tool } from "@/types/cms";
import { client } from "./_client";

export async function getExperienceEntries({
  locale,
}: {
  locale: string;
}): Promise<ExperienceEntry[]> {
  try {
    return await client
      .get("about/experience", { searchParams: { locale } })
      .json<ExperienceEntry[]>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch experience entries",
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}

export async function getSkills({
  locale,
}: {
  locale: string;
}): Promise<Skill[]> {
  try {
    return await client
      .get("about/skills", { searchParams: { locale } })
      .json<Skill[]>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch skills",
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}

export async function getTools({
  locale,
}: {
  locale: string;
}): Promise<Tool[]> {
  try {
    return await client
      .get("about/tools", { searchParams: { locale } })
      .json<Tool[]>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch tools",
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}

export async function getSocialLinks({
  locale,
}: {
  locale: string;
}): Promise<SocialLink[]> {
  try {
    return await client
      .get("about/social-links", { searchParams: { locale } })
      .json<SocialLink[]>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch social links",
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}
