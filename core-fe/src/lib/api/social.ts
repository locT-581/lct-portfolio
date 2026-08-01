import { HTTPError } from "ky";
import type { ProfileIntro, SocialLinkItem } from "@/types/cms";
import { client } from "./_client";

export const DEFAULT_SOCIAL_LINKS: SocialLinkItem[] = [
  {
    platform: "email",
    url: "mailto:hello@jeanpierre.com",
    label: "Email",
  },
  {
    platform: "twitter",
    url: "https://twitter.com/jeanpierre",
    label: "Twitter / X",
  },
  {
    platform: "instagram",
    url: "https://instagram.com/jeanpierre",
    label: "Instagram",
  },
  {
    platform: "linkedin",
    url: "https://linkedin.com/in/jeanpierre",
    label: "LinkedIn",
  },
];

export const DEFAULT_PROFILE_INTRO: ProfileIntro = {
  avatarUrl: "/assets/avatar.png",
  name: "Jean Pierre",
  title: "Copywriter",
  bio: "Hello there, I'm your copywriter. I help brands craft clear, thoughtful, and persuasive messaging that feels human—whether it's for websites, campaigns, or long-form storytelling.",
};

/**
 * Fetches social links from Em-dash REST endpoint via shared Ky client.
 * Falls back to default structured configuration if CMS endpoint returns empty or errors.
 */
export async function getSocialLinks({
  locale,
}: {
  locale: string;
}): Promise<SocialLinkItem[]> {
  try {
    const data = await client
      .get("about/social-links", { searchParams: { locale } })
      .json<SocialLinkItem[]>();

    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return DEFAULT_SOCIAL_LINKS;
  } catch (err) {
    if (err instanceof HTTPError) {
      console.warn(
        `[Em-dash API] getSocialLinks failed with status ${err.response.status}. Using fallback.`,
      );
    }
    return DEFAULT_SOCIAL_LINKS;
  }
}

/**
 * Fetches profile intro data from Em-dash REST endpoint via shared Ky client.
 * Falls back to default profile configuration if CMS endpoint returns empty or errors.
 */
export async function getProfileIntro({
  locale,
}: {
  locale: string;
}): Promise<ProfileIntro> {
  try {
    const data = await client
      .get("about/profile-intro", { searchParams: { locale } })
      .json<ProfileIntro>();

    if (data?.name) {
      return data;
    }
    return DEFAULT_PROFILE_INTRO;
  } catch (err) {
    if (err instanceof HTTPError) {
      console.warn(
        `[Em-dash API] getProfileIntro failed with status ${err.response.status}. Using fallback.`,
      );
    }
    return DEFAULT_PROFILE_INTRO;
  }
}
