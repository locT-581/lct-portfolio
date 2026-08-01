import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/api/blog";
import { getProjects } from "@/lib/api/projects";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const locales = ["en", "vi"];
  const staticPaths = ["", "/projects", "/blog", "/contact", "/uses"];

  const entries: MetadataRoute.Sitemap = [];

  // Static routes for each supported locale
  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic blog post routes for each locale
  for (const locale of locales) {
    try {
      const posts = await getBlogPosts({ locale }).catch(() => []);
      if (Array.isArray(posts)) {
        for (const post of posts) {
          if (post.slug) {
            entries.push({
              url: `${baseUrl}/${locale}/blog/${post.slug}`,
              lastModified: post.publishedAt
                ? new Date(post.publishedAt)
                : new Date(),
              changeFrequency: "monthly",
              priority: 0.7,
            });
          }
        }
      }
    } catch {
      // Safe fallback if API endpoint is unreachable during static sitemap build
    }
  }

  // Dynamic project case study routes for each locale
  for (const locale of locales) {
    try {
      const projects = await getProjects({ locale }).catch(() => []);
      if (Array.isArray(projects)) {
        for (const project of projects) {
          if (project.slug) {
            entries.push({
              url: `${baseUrl}/${locale}/projects/${project.slug}`,
              lastModified: new Date(),
              changeFrequency: "monthly",
              priority: 0.7,
            });
          }
        }
      }
    } catch {
      // Safe fallback if API endpoint is unreachable during static sitemap build
    }
  }

  return entries;
}
