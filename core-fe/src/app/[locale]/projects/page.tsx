import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
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
  const projects = await getProjects({ locale }).catch(() => []);

  return (
    <main className="flex flex-col gap-8 md:gap-10">
      {/* Section header */}
      <SectionTag label={t("sectionLabel")} />

      {/* Portfolio grid */}
      <PortfolioGrid projects={projects} sectionLabel={t("sectionLabel")} />
    </main>
  );
}
