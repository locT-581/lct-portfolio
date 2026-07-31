import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-lg text-gray-600 mb-8">{t("description")}</p>

      <div className="flex items-center gap-4">
        <span className="font-medium">{t("switchLanguage")}</span>
        <Link
          href="/"
          locale="vi"
          className={`px-4 py-2 rounded-md border ${
            locale === "vi"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
          }`}
        >
          Tiếng Việt
        </Link>
        <Link
          href="/"
          locale="en"
          className={`px-4 py-2 rounded-md border ${
            locale === "en"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
          }`}
        >
          English
        </Link>
      </div>
    </main>
  );
}
