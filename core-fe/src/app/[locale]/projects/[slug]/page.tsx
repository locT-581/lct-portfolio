import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600; // REVALIDATE_INTERVAL_PROJECTS

export function generateStaticParams() {
  return [{ slug: "demo-project" }];
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Project: {slug}</h1>
      <p className="text-gray-600">Case study detail page stub for {slug}.</p>
    </main>
  );
}
