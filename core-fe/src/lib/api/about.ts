import type { ExperienceEntry, Skill, SocialLink, Tool } from "@/types/cms";
import { client } from "./_client";

export async function getExperienceEntries({
  locale,
}: {
  locale: string;
}): Promise<ExperienceEntry[]> {
  try {
    const data = await client
      .get("about/experience", { searchParams: { locale } })
      .json<ExperienceEntry[]>();
    return Array.isArray(data) ? data : [];
  } catch (_err) {
    console.warn(
      "[Em-dash API] getExperienceEntries failed. Using fallback empty array.",
    );
    return [];
  }
}

export async function getSkills({
  locale,
}: {
  locale: string;
}): Promise<Skill[]> {
  try {
    const data = await client
      .get("about/skills", { searchParams: { locale } })
      .json<Skill[]>();
    return Array.isArray(data) ? data : [];
  } catch (_err) {
    console.warn("[Em-dash API] getSkills failed. Using fallback empty array.");
    return [];
  }
}

export async function getTools({
  locale,
}: {
  locale: string;
}): Promise<Tool[]> {
  try {
    const data = await client
      .get("about/tools", { searchParams: { locale } })
      .json<Tool[]>();
    return Array.isArray(data) ? data : [];
  } catch (_err) {
    console.warn("[Em-dash API] getTools failed. Using fallback empty array.");
    return [];
  }
}

export async function getSocialLinks({
  locale,
}: {
  locale: string;
}): Promise<SocialLink[]> {
  try {
    const data = await client
      .get("about/social-links", { searchParams: { locale } })
      .json<SocialLink[]>();
    return Array.isArray(data) ? data : [];
  } catch (_err) {
    console.warn(
      "[Em-dash API] getSocialLinks failed. Using fallback empty array.",
    );
    return [];
  }
}
