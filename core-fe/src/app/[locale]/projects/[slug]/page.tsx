import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CaseStudyHero,
  CaseStudyMedia,
  CaseStudyNavigation,
  EngineeringMetrics,
} from "@/components/portfolio";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PortableText } from "@/components/ui/PortableText";
import { getProjectBySlug, getProjects } from "@/lib/api/projects";
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

  const [project, allProjects] = await Promise.all([
    getProjectBySlug({ slug, locale }).catch(() => null),
    getProjects({ locale }).catch(() => []),
  ]);
  console.log("🚀 ~ CaseStudyDetailPage ~ project:", project);

  if (!project) {
    notFound();
  }

  // Find previous and next projects
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const breadcrumbsItems = [
    { label: tBreadcrumbs("home"), href: `/${locale}` },
    { label: tProjects("sectionLabel"), href: `/${locale}/projects` },
    { label: project.name },
  ];

  const heroLabels = {
    visitLive: tProjects("visitLive"),
    viewSource: tProjects("viewSource"),
    role: tProjects("role"),
    client: tProjects("client"),
    timeline: tProjects("timeline"),
    platform: tProjects("platform"),
    teamSize: tProjects("teamSize"),
    techStack: tProjects("techStack"),
  };

  const metricsLabels = {
    engineeringMetricsTitle: tProjects("engineeringMetricsTitle"),
    engineeringMetricsSubtitle: tProjects("engineeringMetricsSubtitle"),
    verifiedAudit: tProjects("verifiedAudit"),
    inspectAudit: tProjects("inspectAudit"),
    viewLighthouseReport: tProjects("viewLighthouseReport"),
    testOnPageSpeed: tProjects("testOnPageSpeed"),
    lighthouseScoreLabel: tProjects("lighthouseScoreLabel"),
    lcpLabel: tProjects("lcpLabel"),
    clsLabel: tProjects("clsLabel"),
    ttfbLabel: tProjects("ttfbLabel"),
    close: tProjects("close"),
  };

  const navLabels = {
    previousProject: tProjects("previousProject"),
    nextProject: tProjects("nextProject"),
    allProjects: tProjects("allProjects"),
    ctaTitle: tProjects("ctaTitle"),
    ctaDescription: tProjects("ctaDescription"),
    ctaButton: tProjects("ctaButton"),
  };

  return (
    <main className="flex flex-col gap-10 md:gap-12 w-full">
      {/* Breadcrumb Trail */}
      <Breadcrumbs items={breadcrumbsItems} />

      {/* Modern Clean Hero Section */}
      <CaseStudyHero project={project} labels={heroLabels} />

      <section className="w-full flex flex-col gap-10">
        <article className="case-study-story-content flex flex-col gap-4 w-full">
          <PortableText value={project.descriptionRaw || project.description} />
        </article>

        {/* Case Study Media Gallery (Extra Screenshots if available) */}
        {project.media && project.media.length > 1 && (
          <CaseStudyMedia media={project.media.slice(1)} />
        )}
      </section>

      {/* Engineering Metrics Section (if available on project) */}
      {project.engineeringMetrics && (
        <EngineeringMetrics
          metrics={project.engineeringMetrics}
          labels={metricsLabels}
        />
      )}

      {/* Bottom Project Navigation & CTA */}
      <CaseStudyNavigation
        prevProject={prevProject}
        nextProject={nextProject}
        locale={locale}
        labels={navLabels}
      />
    </main>
  );
}
