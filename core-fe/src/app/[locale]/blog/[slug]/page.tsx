import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600; // REVALIDATE_INTERVAL_BLOG

export function generateStaticParams() {
  return [{ slug: "demo-post" }];
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Blog Article: {slug}</h1>
      <p className="text-gray-600">Blog article detail page stub for {slug}.</p>
    </main>
  );
}
