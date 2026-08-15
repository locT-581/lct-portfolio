import { HTTPError } from "ky";
import { extractPortableText } from "@/lib/utils";
import type { ProfileIntro, SocialLinkItem } from "@/types/cms";
import { client, type EmdashApiResponse } from "./_client";

interface EmdashProfileItem {
  id: string;
  slug: string;
  data: {
    persona_title?: string;
    full_name?: string;
    headline?: string;
    tagline?: string;
    bio?: unknown;
    avatar?: { url?: string; previewUrl?: string } | null;
    resume_url?: string | null;
    resume_file?: { url?: string } | null;
    location?: string;
    is_open_to_work?: boolean | number;
    is_default?: boolean | number;
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

/**
 * Fetches social links from Em-dash REST endpoint (content/social_links).
 */
export async function getSocialLinks({
  locale,
}: {
  locale: string;
}): Promise<SocialLinkItem[]> {
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
        icon: item.data.icon_name || null,
      }));
    }
    return [];
  } catch (err) {
    if (err instanceof HTTPError) {
      console.warn(
        `[Em-dash API] getSocialLinks failed with status ${err.response.status}.`,
      );
    } else {
      console.warn("[Em-dash API] getSocialLinks error:", err);
    }
    return [];
  }
}

/**
 * Fetches active profile intro from Em-dash REST endpoint (content/profiles).
 */
export async function getProfileIntro({
  locale,
}: {
  locale: string;
}): Promise<ProfileIntro> {
  try {
    const res = await client
      .get("content/profiles", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashProfileItem>>();

    if (
      res?.success &&
      Array.isArray(res.data?.items) &&
      res.data.items.length > 0
    ) {
      // Find the default persona or take the first published persona
      const profile =
        res.data.items.find((item) => Boolean(item.data.is_default)) ??
        res.data.items[0];

      const bioText =
        extractPortableText(profile.data.bio) || profile.data.tagline || "";

      const avatarUrl =
        profile.data.avatar?.url ||
        profile.data.avatar?.previewUrl ||
        "/assets/avatar.png";

      return {
        avatarUrl,
        name: profile.data.full_name || "",
        title: profile.data.persona_title || profile.data.headline || "",
        headline: profile.data.headline || profile.data.persona_title || "",
        bio: bioText,
        bioRaw: profile.data.bio,
        resumeUrl:
          profile.data.resume_url || profile.data.resume_file?.url || null,
      };
    }

    return {
      avatarUrl: "/assets/avatar.png",
      name: "",
      title: "",
      headline: "",
      bio: "",
      resumeUrl: null,
    };
  } catch (err) {
    if (err instanceof HTTPError) {
      console.warn(
        `[Em-dash API] getProfileIntro failed with status ${err.response.status}.`,
      );
    } else {
      console.warn("[Em-dash API] getProfileIntro error:", err);
    }
    return {
      avatarUrl: "/assets/avatar.png",
      name: "",
      title: "",
      headline: "",
      bio: "",
      resumeUrl: null,
    };
  }
}
