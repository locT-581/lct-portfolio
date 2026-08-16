import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "refundPolicy" });

  return constructMetadata({
    locale,
    path: "refund-policy",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "refundPolicy" });
  const b = await getTranslations({ locale, namespace: "breadcrumbs" });

  const breadcrumbItems = [
    { label: b("brandName"), href: `/${locale}` },
    { label: t("pageTitle") },
  ];

  return (
    <main className="flex flex-col gap-6 md:gap-8 max-w-200">
      <Breadcrumbs items={breadcrumbItems} />

      <div>
        <SectionTag label={t("sectionLabel")} />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-[24px] md:text-[28px] font-semibold text-text-primary leading-tight tracking-tight">
          {t("pageTitle")}
        </h1>
        <p className="text-body-m text-text-secondary leading-relaxed">
          At Copyseen, we stand behind the quality of our digital products.
          Please read our policy below regarding refunds and returns.
        </p>
      </div>

      <div className="flex flex-col gap-8 text-text-secondary leading-relaxed border-t border-divider pt-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-[18px] font-semibold text-text-primary">
            1. Eligibility for Refunds
          </h2>
          <p className="text-body-m">
            We offer refunds within 14 days of purchase if you encounter
            technical defects that prevent you from using the digital asset and
            our support team is unable to resolve them.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-[18px] font-semibold text-text-primary">
            2. Non-Refundable Situations
          </h2>
          <p className="text-body-m">
            Refunds cannot be granted for change of mind, lack of required
            third-party software, or once digital assets have been downloaded
            and utilized.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-[18px] font-semibold text-text-primary">
            3. How to Request a Refund
          </h2>
          <p className="text-body-m">
            To request a refund, please contact us at{" "}
            <a
              href="mailto:hellosomesquare@gmail.com"
              className="text-text-primary underline hover:text-brand-orange transition-colors"
            >
              hellosomesquare@gmail.com
            </a>{" "}
            with your order receipt and detailed description of the issue.
          </p>
        </section>
      </div>
    </main>
  );
}
