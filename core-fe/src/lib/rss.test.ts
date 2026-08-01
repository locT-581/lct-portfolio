import assert from "node:assert/strict";
import { test } from "node:test";
import type { BlogPost } from "@/types/cms";
import { generateRssFeed } from "./rss";

test("generateRssFeed generates valid RSS 2.0 XML with correct post details and absolute URLs", () => {
  const samplePosts: BlogPost[] = [
    {
      id: "post-1",
      slug: "hello-world",
      title: "Hello World Post",
      excerpt: "This is a test post excerpt.",
      publishedAt: "2026-08-01T00:00:00Z",
      readingTime: "5 min read",
      categoryTags: ["tech"],
      contentType: "markdown",
    },
  ];

  const siteUrl = "https://loct.dev";
  const xml = generateRssFeed(samplePosts, siteUrl);

  assert.ok(xml.includes('<rss version="2.0"'));
  assert.ok(xml.includes("Hello World Post"));
  assert.ok(xml.includes("https://loct.dev/vi/blog/hello-world"));
  assert.ok(xml.includes("This is a test post excerpt."));
});
