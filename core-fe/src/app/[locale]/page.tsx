import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { Header } from "@/components/ui/Header";
import { getProfileIntro, getSocialLinks } from "@/lib/api/social";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, socialLinks] = await Promise.all([
    getProfileIntro({ locale }),
    getSocialLinks({ locale }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-base-1 text-text-primary">
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-5 md:px-10 lg:px-20 py-8 md:py-12">
        <HeroSection profile={profile} socialLinks={socialLinks} />
      </main>
    </div>
  );
}
