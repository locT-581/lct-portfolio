import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CaseStudyHeader } from "@/components/portfolio/CaseStudyHeader";
import { CaseStudyMedia } from "@/components/portfolio/CaseStudyMedia";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getProjectBySlug } from "@/lib/api/projects";
import { constructMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug({ slug, locale }).catch(() => null);

  if (!project) {
    return constructMetadata({
      locale,
      path: `projects/${slug}`,
      title: "Project Not Found",
    });
  }

  return constructMetadata({
    locale,
    path: `projects/${slug}`,
    title: `${project.name} | Case Study`,
    description: project.shortDescription || project.description,
    openGraph: {
      title: project.name,
      description: project.shortDescription || project.description,
      images: project.logoUrl ? [{ url: project.logoUrl }] : [],
    },
  });
}

export default async function CaseStudyDetailPage({
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
  const tProjects = await getTranslations({ locale, namespace: "projects" });

  const project = await getProjectBySlug({ slug, locale }).catch(() => null);

  if (!project) {
    notFound();
  }

  const breadcrumbsItems = [
    { label: tBreadcrumbs("home"), href: `/${locale}` },
    { label: tProjects("sectionLabel"), href: `/${locale}/projects` },
    { label: project.name },
  ];

  return (
    <main className="flex flex-col gap-8 md:gap-10">
      {/* Breadcrumb Trail */}
      <Breadcrumbs items={breadcrumbsItems} />

      {/* Case Study Header */}
      <CaseStudyHeader project={project} />

      {/* Case Study Media Gallery */}
      <CaseStudyMedia media={project.media} />
    </main>
  );
}
