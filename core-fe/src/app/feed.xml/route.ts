import { env } from "@/env";
import { getBlogPosts } from "@/lib/api/blog";
import { generateRssFeed } from "@/lib/rss";

export async function GET() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  try {
    const posts = await getBlogPosts({ locale: "vi" });
    const xml = generateRssFeed(posts, siteUrl);

    return new Response(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    });
  } catch (_error) {
    return new Response("Internal Server Error generating RSS feed.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store",
      },
    });
  }
}
