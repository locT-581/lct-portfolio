import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactSection } from "@/components/contact";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Header } from "@/components/ui/Header";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: `${t("pageTitle")} | Loc Tran`,
    description: t("pageDescription"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const b = await getTranslations({ locale, namespace: "breadcrumbs" });

  const breadcrumbItems = [
    { label: b("brandName"), href: `/${locale}` },
    { label: b("contact") },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-base-1 text-text-primary">
      <Header />
      <main className="flex-1 w-full max-w-300 mx-auto px-5 md:px-10 lg:px-20 py-8 md:py-12 flex flex-col gap-6 md:gap-8">
        {/* Breadcrumb Navigation (AC #16) */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Section Header Tag */}
        <div>
          <SectionTag label={t("sectionLabel")} />
        </div>

        {/* Contact Section Layout & Form */}
        <ContactSection locale={locale} />
      </main>
    </div>
  );
}
