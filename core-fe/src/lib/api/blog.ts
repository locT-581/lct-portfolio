import { HTTPError } from "ky";
import { extractPortableText } from "@/lib/utils";
import type { BlogPost, BlogPostDetail } from "@/types/cms";
import { client, type EmdashApiResponse } from "./_client";

interface EmdashPostItem {
  id: string;
  slug: string;
  publishedAt?: string;
  createdAt?: string;
  data: {
    title: string;
    excerpt?: string;
    content?: unknown;
    cover_image?: { url?: string } | null;
    reading_time_min?: number;
  };
}

export async function getBlogPosts({
  locale,
}: {
  locale: string;
}): Promise<BlogPost[]> {
  try {
    const res = await client
      .get("content/posts", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashPostItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      return res.data.items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.data.title,
        excerpt: item.data.excerpt || "",
        publishedAt:
          item.publishedAt || item.createdAt || new Date().toISOString(),
        readingTime: `${item.data.reading_time_min || 5} min read`,
        categoryTags: [],
        contentType: "article",
      }));
    }
    return [];
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to fetch blog posts",
        status: err.response.status,
      };
    }
    throw {
      error: err instanceof Error ? err.message : "Unknown error",
      status: 500,
    };
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
    const res = await client
      .get("content/posts", { searchParams: { locale } })
      .json<EmdashApiResponse<EmdashPostItem>>();

    if (res?.success && Array.isArray(res.data?.items)) {
      const item = res.data.items.find((p) => p.slug === slug || p.id === slug);

      if (item) {
        return {
          id: item.id,
          slug: item.slug,
          title: item.data.title,
          excerpt: item.data.excerpt || "",
          publishedAt:
            item.publishedAt || item.createdAt || new Date().toISOString(),
          readingTime: `${item.data.reading_time_min || 5} min read`,
          categoryTags: [],
          contentType: "article",
          content:
            extractPortableText(item.data.content) || item.data.excerpt || "",
        };
      }
    }

    throw {
      error: `Blog post not found: ${slug}`,
      status: 404,
    };
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || `Failed to fetch blog post ${slug}`,
        status: err.response.status,
      };
    }
    throw {
      error: err instanceof Error ? err.message : "Unknown error",
      status: 500,
    };
  }
}
