import { env } from "@/env";
import { extractPortableText } from "@/lib/utils";
import type {
  CertificationEntry,
  ExperienceEntry,
  Skill,
  SkillCategory,
  SocialLink,
  Tool,
} from "@/types/cms";
import { client, type EmdashApiResponse } from "./_client";

export function extractMediaUrl(media: unknown): string | null {
  if (!media) return null;

  const baseUrl = env.EMDASH_API_URL.replace(/\/content$/, "").replace(
    /\/_emdash\/api$/,
    "",
  );

  const resolveUrl = (u?: string | null): string | null => {
    if (!u || typeof u !== "string") return null;
    const trimmed = u.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (trimmed.startsWith("/_emdash/")) {
      return `${baseUrl}${trimmed}`;
    }
    if (trimmed.startsWith("/")) {
      return trimmed;
    }
    return `${baseUrl}/_emdash/api/media/file/${trimmed}`;
  };

  if (typeof media === "string") {
    return resolveUrl(media);
  }

  if (typeof media === "object" && media !== null) {
    const m = media as {
      url?: string;
      src?: string;
      previewUrl?: string;
      asset?: unknown;
      meta?: { storageKey?: string };
      filename?: string;
      id?: string;
      _ref?: string;
    };

    if (m.asset) {
      const fromAsset = extractMediaUrl(m.asset);
      if (fromAsset) return fromAsset;
    }

    if (m.url) return resolveUrl(m.url);
    if (m.src) return resolveUrl(m.src);
    if (m.previewUrl) return resolveUrl(m.previewUrl);
    if (m._ref) return resolveUrl(m._ref);

    const storageKey = m.meta?.storageKey || m.filename || m.id;
    if (storageKey) {
      return `${baseUrl}/_emdash/api/media/file/${storageKey}`;
    }
  }

  return null;
}

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

interface EmdashSkillCategoryItem {
  id: string;
  slug: string;
  data: {
    name: string;
    group_type?: "technical" | "soft_skills";
    display_type?: "badges" | "bullet_list";
    description?: string;
    order_index?: number;
  };
}

interface EmdashSkillItem {
  id: string;
  slug: string;
  data: {
    name: string;
    category?: string;
    icon_image?: unknown;
    icon_image_dark?: unknown;
    icon_name?: string | null;
    description?: string;
    is_highlight?: boolean;
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
      const sorted = [...res.data.items]
        .filter((item) => item.data.type !== "certification")
        .sort(
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

export async function getCertificationEntries({
  locale,
}: {
  locale: string;
}): Promise<CertificationEntry[]> {
  try {
    const res = await client
      .get("content/timeline_items", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashTimelineItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const sorted = [...res.data.items]
        .filter((item) => item.data.type === "certification")
        .sort(
          (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
        );

      return sorted.map((item) => {
        const issueDate = item.data.end_date || item.data.start_date || "";
        const credentialUrl =
          item.data.credential_url ||
          item.data.company_url ||
          item.data.organization_url ||
          item.data.website_url ||
          item.data.url ||
          null;

        return {
          id: item.id,
          title: item.data.title || "",
          issuer: item.data.organization || "",
          issueDate,
          credentialUrl,
          description: extractPortableText(item.data.description),
          descriptionRaw: item.data.description,
        };
      });
    }
    return [];
  } catch (err) {
    console.warn("[Em-dash API] getCertificationEntries failed:", err);
    return [];
  }
}

export async function getSkillCategories({
  locale,
}: {
  locale: string;
}): Promise<SkillCategory[]> {
  try {
    const [categoriesRes, skillsRes] = await Promise.all([
      client
        .get("content/skill_categories", { searchParams: { locale } })
        .json<EmdashApiResponse<EmdashSkillCategoryItem>>()
        .catch(() => null),
      client
        .get("content/skills", { searchParams: { locale } })
        .json<EmdashApiResponse<EmdashSkillItem>>()
        .catch(() => null),
    ]);

    if (categoriesRes?.success && Array.isArray(categoriesRes.data?.items)) {
      const skillsList =
        skillsRes?.success && Array.isArray(skillsRes.data?.items)
          ? skillsRes.data.items
          : [];

      const sortedCategories = [...categoriesRes.data.items].sort(
        (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
      );

      return sortedCategories.map((cat) => {
        const catSkills = skillsList
          .filter(
            (s) => s.data.category === cat.slug || s.data.category === cat.id,
          )
          .sort(
            (a, b) => (a.data.order_index ?? 99) - (b.data.order_index ?? 99),
          )
          .map((s) => {
            const mediaUrl = extractMediaUrl(s.data.icon_image);
            const mediaUrlDark = extractMediaUrl(s.data.icon_image_dark);
            return {
              id: s.id,
              name: s.data.name,
              category: s.data.category || cat.slug,
              iconImage: mediaUrl
                ? { url: mediaUrl, previewUrl: mediaUrl }
                : null,
              iconImageDark: mediaUrlDark
                ? { url: mediaUrlDark, previewUrl: mediaUrlDark }
                : null,
              iconName: s.data.icon_name || null,
              description: s.data.description || null,
              isHighlight: Boolean(s.data.is_highlight),
              proficiencyLevel: s.data.proficiency_level || null,
              orderIndex: s.data.order_index ?? 99,
            };
          });

        return {
          id: cat.id,
          name: cat.data.name,
          groupType: cat.data.group_type || "technical",
          displayType: cat.data.display_type || "badges",
          description: cat.data.description || null,
          orderIndex: cat.data.order_index ?? 99,
          skills: catSkills,
        };
      });
    }
    return [];
  } catch (err) {
    console.warn("[Em-dash API] getSkillCategories failed:", err);
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

      return sorted.map((item) => {
        const mediaUrl = extractMediaUrl(item.data.icon_image);
        const mediaUrlDark = extractMediaUrl(item.data.icon_image_dark);
        return {
          id: item.id,
          label: item.data.name,
          iconName: item.data.icon_name || null,
          iconImage: mediaUrl ? { url: mediaUrl, previewUrl: mediaUrl } : null,
          iconImageDark: mediaUrlDark
            ? { url: mediaUrlDark, previewUrl: mediaUrlDark }
            : null,
          category: item.data.category,
          description: item.data.description || null,
          isHighlight: Boolean(item.data.is_highlight),
        };
      });
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
