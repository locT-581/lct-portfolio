import { Feed } from "feed";
import type { BlogPost } from "@/types/cms";

export function generateRssFeed(posts: BlogPost[], siteUrl: string): string {
  const cleanSiteUrl = siteUrl.replace(/\/$/, "");

  const feed = new Feed({
    title: "LocT - Blog",
    description:
      "Articles and thoughts on software engineering, web development, and architecture.",
    id: cleanSiteUrl,
    link: cleanSiteUrl,
    language: "en",
    image: `${cleanSiteUrl}/favicon.ico`,
    favicon: `${cleanSiteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, LocT`,
    updated:
      posts.length > 0 && posts[0]?.publishedAt
        ? new Date(posts[0].publishedAt)
        : new Date(),
    feedLinks: {
      rss2: `${cleanSiteUrl}/feed.xml`,
    },
    author: {
      name: "LocT",
      email: "contact@loct.dev",
      link: cleanSiteUrl,
    },
  });

  for (const post of posts) {
    const postUrl = `${cleanSiteUrl}/blog/${post.slug}`;
    feed.addItem({
      title: post.title,
      id: postUrl,
      link: postUrl,
      description: post.excerpt,
      content: post.excerpt,
      author: [
        {
          name: "Loc Tran",
          email: "contact@loct.dev",
          link: cleanSiteUrl,
        },
      ],
      date: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    });
  }

  return feed.rss2();
}
