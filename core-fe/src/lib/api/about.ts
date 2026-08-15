import { extractPortableText } from "@/lib/utils";
import type { ExperienceEntry, Skill, SocialLink, Tool } from "@/types/cms";
import { client, type EmdashApiResponse } from "./_client";

interface EmdashTimelineItem {
  id: string;
  slug: string;
  data: {
    type?: string;
    title: string;
    organization: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean | number;
    description?: unknown;
    credential_url?: string;
    company_url?: string;
    organization_url?: string;
    website_url?: string;
    url?: string;
    order_index?: number;
  };
}

interface EmdashSkillItem {
  id: string;
  slug: string;
  data: {
    name: string;
    category?: string;
    icon_name?: string | null;
    proficiency_level?: string;
    order_index?: number;
  };
}

interface EmdashSocialLinkItem {
  id: string;
  slug: string;
  data: {
    platform_name: string;
    url: string;
    icon_name?: string | null;
    order_index?: number;
  };
}

export async function getExperienceEntries({
  locale,
}: {
  locale: string;
}): Promise<ExperienceEntry[]> {
  try {
    const res = await client
      .get("content/timeline_items", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashTimelineItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const sorted = [...res.data.items].sort(
        (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
      );

      return sorted.map((item) => {
        const isCurrentLabel = locale === "vi" ? "Hiện tại" : "Present";
        const periodStr = [
          item.data.start_date,
          item.data.end_date ||
            (item.data.is_current ? isCurrentLabel : undefined),
        ]
          .filter(Boolean)
          .join(" - ");

        const companyUrl =
          item.data.company_url ||
          item.data.organization_url ||
          item.data.website_url ||
          item.data.credential_url ||
          item.data.url ||
          null;

        return {
          id: item.id,
          company: item.data.organization || "",
          companyUrl,
          role: item.data.title || "",
          period: periodStr || "Present",
          location: item.data.location || "",
          description: extractPortableText(item.data.description),
          descriptionRaw: item.data.description,
        };
      });
    }
    return [];
  } catch (err) {
    console.warn("[Em-dash API] getExperienceEntries failed:", err);
    return [];
  }
}

export async function getSkills({
  locale,
}: {
  locale: string;
}): Promise<Skill[]> {
  try {
    const res = await client
      .get("content/skills", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashSkillItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const sorted = [...res.data.items].sort(
        (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
      );

      return sorted.map((item) => ({
        id: item.id,
        label: item.data.name,
        iconName: item.data.icon_name || null,
      }));
    }
    return [];
  } catch (err) {
    console.warn("[Em-dash API] getSkills failed:", err);
    return [];
  }
}

export async function getTools({
  locale,
}: {
  locale: string;
}): Promise<Tool[]> {
  try {
    const res = await client
      .get("content/skills", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashSkillItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      return res.data.items.map((item) => ({
        id: item.id,
        name: item.data.name,
        iconName: item.data.icon_name || null,
      }));
    }
    return [];
  } catch (err) {
    console.warn("[Em-dash API] getTools failed:", err);
    return [];
  }
}

export async function getSocialLinks({
  locale,
}: {
  locale: string;
}): Promise<SocialLink[]> {
  try {
    const res = await client
      .get("content/social_links", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashSocialLinkItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const sorted = [...res.data.items].sort(
        (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
      );

      return sorted.map((item) => ({
        platform: (item.data.platform_name || "link").toLowerCase(),
        url: item.data.url || "#",
        label: item.data.platform_name || "Link",
        iconName: item.data.icon_name || null,
      }));
    }
    return [];
  } catch (err) {
    console.warn("[Em-dash API] getSocialLinks failed:", err);
    return [];
  }
}
