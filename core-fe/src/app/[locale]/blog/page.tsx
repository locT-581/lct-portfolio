import { setRequestLocale } from "next-intl/server";
import { REVALIDATE_INTERVAL_BLOG } from "@/lib/constants/revalidation";

export const revalidate = 3600; // REVALIDATE_INTERVAL_BLOG

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Blog</h1>
      <p className="text-gray-600">Blog articles list stub.</p>
    </main>
  );
}
