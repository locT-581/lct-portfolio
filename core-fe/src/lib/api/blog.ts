import { HTTPError } from "ky";
import type { BlogPost, BlogPostDetail } from "@/types/cms";
import { client } from "./_client";

export async function getBlogPosts({
  locale,
}: {
  locale: string;
}): Promise<BlogPost[]> {
  try {
    return await client
      .get("blog", { searchParams: { locale } })
      .json<BlogPost[]>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch blog posts",
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}

export async function getBlogPostBySlug({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}): Promise<BlogPostDetail> {
  try {
    return await client
      .get(`blog/${encodeURIComponent(slug)}`, { searchParams: { locale } })
      .json<BlogPostDetail>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || `Failed to fetch blog post ${slug}`,
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}
