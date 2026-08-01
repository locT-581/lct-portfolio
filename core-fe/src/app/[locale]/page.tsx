import { setRequestLocale } from "next-intl/server";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCtaSection } from "@/components/home/HomeCtaSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { CTABlock } from "@/components/ui/CTABlock";
import { Header } from "@/components/ui/Header";
import { getExperienceEntries, getSkills, getTools } from "@/lib/api/about";
import { getProfileIntro, getSocialLinks } from "@/lib/api/social";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, socialLinks, experienceEntries, skills, tools] =
    await Promise.all([
      getProfileIntro({ locale }),
      getSocialLinks({ locale }),
      getExperienceEntries({ locale }),
      getSkills({ locale }),
      getTools({ locale }),
    ]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-base-1 text-text-primary">
      <Header />
      <main className="flex-1 w-full max-w-300 mx-auto px-5 md:px-10 lg:px-20 py-8 md:py-12 flex flex-col gap-8 md:gap-10">
        <HeroSection profile={profile} socialLinks={socialLinks} />
        <HomeCtaSection locale={locale} />
        <ExperienceSection entries={experienceEntries} />
        <SkillsSection skills={skills} />
        <ToolsSection tools={tools} />
        <CTABlock href={`/${locale}/projects`} />
      </main>
    </div>
  );
}
