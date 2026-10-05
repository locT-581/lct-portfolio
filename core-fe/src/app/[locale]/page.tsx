import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CertificatesSection } from "@/components/home/CertificatesSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { HeroSection } from "@/components/home/HeroSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { PersonWebsiteJsonLd } from "@/components/seo/PersonWebsiteJsonLd";
import {
  getCertificationEntries,
  getExperienceEntries,
  getSkillCategories,
  getSkills,
} from "@/lib/api/about";
import { getResumes } from "@/lib/api/resume";
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

  const [
    profile,
    resumes,
    socialLinks,
    experienceEntries,
    certificationEntries,
    skillCategories,
    skills,
    tHome,
  ] = await Promise.all([
    getProfileIntro({ locale }),
    getResumes({ locale }),
    getSocialLinks({ locale }),
    getExperienceEntries({ locale }),
    getCertificationEntries({ locale }),
    getSkillCategories({ locale }),
    getSkills({ locale }),
    getTranslations({ locale, namespace: "home" }),
  ]);

  return (
    <main className="flex flex-col gap-12 md:max-w-200">
      <PersonWebsiteJsonLd />
      <HeroSection
        profile={profile}
        socialLinks={socialLinks}
        resumes={resumes}
        resumeLabel={tHome("downloadResume")}
        selectRoleLabel={tHome("selectResumeRole")}
        primaryBadgeLabel={tHome("primaryResume")}
      />
      <ExperienceSection
        entries={experienceEntries}
        sectionLabel={tHome("experiences")}
      />
      <SkillsSection
        categories={skillCategories}
        skills={skills}
        sectionLabel={tHome("skills")}
      />
      <CertificatesSection
        entries={certificationEntries}
        sectionLabel={tHome("certifications")}
        verifyLabel={tHome("verifyCredential")}
      />
      {/* <CTABlock href={`/${locale}/projects`} /> */}
    </main>
  );
}
