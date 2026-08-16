import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { getProjects } from "@/lib/api/projects";
import { constructMetadata } from "@/lib/seo";

export const revalidate = 3600; // REVALIDATE_INTERVAL_PROJECTS

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return constructMetadata({
    locale,
    path: "projects",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "projects" });
  const b = await getTranslations({ locale, namespace: "breadcrumbs" });
  const projects = await getProjects({ locale }).catch(() => []);

  const breadcrumbItems = [
    { label: b("brandName"), href: `/${locale}` },
    { label: t("pageHeading") },
  ];

  return (
    <main className="max-w-200 w-full mx-auto flex flex-col gap-8">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Content Section */}
      <section className="flex flex-col gap-5 w-full">
        {/* Introduction Title (Heading 4) */}
        <h1 className="text-h4 font-semibold text-text-primary">
          {t("pageHeading")}
        </h1>

        {/* Portfolio grid */}
        <PortfolioGrid projects={projects} sectionLabel={t("sectionLabel")} />
      </section>
    </main>
  );
}
