import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { HeroSection } from "@/components/home/HeroSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { ToolsSection } from "@/components/home/ToolsSection";
import { PersonWebsiteJsonLd } from "@/components/seo/PersonWebsiteJsonLd";
import { CTABlock } from "@/components/ui/CTABlock";
import { getExperienceEntries, getSkills, getTools } from "@/lib/api/about";
import { getProfileIntro, getSocialLinks } from "@/lib/api/social";
import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const profile = await getProfileIntro({ locale }).catch(() => null);

  return constructMetadata({
    locale,
    path: "",
    title: profile ? `${profile.name} — ${profile.title}` : undefined,
    description: profile?.bio,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, socialLinks, experienceEntries, skills, tools, tHome] =
    await Promise.all([
      getProfileIntro({ locale }),
      getSocialLinks({ locale }),
      getExperienceEntries({ locale }),
      getSkills({ locale }),
      getTools({ locale }),
      getTranslations({ locale, namespace: "home" }),
    ]);

  return (
    <main className="flex flex-col gap-12 md:gap-16">
      <PersonWebsiteJsonLd />
      <HeroSection
        profile={profile}
        socialLinks={socialLinks}
        resumeLabel={tHome("downloadResume")}
      />
      <ExperienceSection entries={experienceEntries} />
      <SkillsSection skills={skills} />
      <ToolsSection tools={tools} />
      <CTABlock href={`/${locale}/projects`} />
    </main>
  );
}
