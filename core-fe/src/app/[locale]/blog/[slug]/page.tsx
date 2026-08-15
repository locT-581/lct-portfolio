import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleDetailHeader, ArticleMultiRenderer } from "@/components/blog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getBlogPostBySlug } from "@/lib/api/blog";
import { constructMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug({ slug, locale }).catch(() => null);

  if (!post) {
    return constructMetadata({
      locale,
      path: `blog/${slug}`,
      title: "Article Not Found",
    });
  }

  return constructMetadata({
    locale,
    path: `blog/${slug}`,
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tBreadcrumbs = await getTranslations({
    locale,
    namespace: "breadcrumbs",
  });

  const post = await getBlogPostBySlug({ slug, locale }).catch(() => null);

  if (!post) {
    notFound();
  }

  const breadcrumbsItems = [
    { label: tBreadcrumbs("home"), href: `/${locale}` },
    { label: tBreadcrumbs("blog"), href: `/${locale}/blog` },
    { label: post.title },
  ];

  return (
    <main className="flex flex-col gap-8">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={breadcrumbsItems} />

      {/* Article Container */}
      <article className="max-w-4xl w-full mx-auto flex flex-col">
        {/* Article Header */}
        <ArticleDetailHeader post={post} locale={locale} />

        {/* Multi-Format Content Renderer */}
        <ArticleMultiRenderer
          contentType={post.contentType}
          content={post.content}
        />
      </article>
    </main>
  );
}
