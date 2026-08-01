import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleList } from "@/components/blog";
import { Header } from "@/components/ui/Header";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
import { getBlogPosts } from "@/lib/api/blog";

export const revalidate = 3600; // REVALIDATE_INTERVAL_BLOG

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = await getBlogPosts({ locale }).catch(() => []);

  return (
    <div className="min-h-screen flex flex-col bg-bg-base-1 text-text-primary">
      <Header />
      <main className="flex-1 w-full max-w-300 mx-auto px-5 md:px-10 lg:px-20 py-8 md:py-12 flex flex-col gap-8 md:gap-10">
        {/* Section header */}
        <div className="flex flex-col gap-3">
          <SectionTag label={t("sectionLabel")} />
          <h1 className="text-heading-m-bold md:text-heading-l-bold text-text-primary">
            {t("pageTitle")}
          </h1>
          <p className="text-body-m-regular text-text-secondary max-w-2xl">
            {t("pageDescription")}
          </p>
        </div>

        {/* Article List */}
        <ArticleList
          posts={posts}
          locale={locale}
          sectionLabel={t("sectionLabel")}
        />
      </main>
    </div>
  );
}
