import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionTag } from "@/components/ui/SectionTag/SectionTag";
import { cn } from "@/lib/utils";
import type { Skill, SkillCategory } from "@/types/cms";

export interface SkillsSectionProps {
  /**
   * Optional array of skill items from Em-dash CMS.
   */
  skills?: Skill[];
  /**
   * Array of full skill categories dynamically loaded from Em-dash CMS.
   */
  categories?: SkillCategory[];
  /**
   * Optional section tag label string. Defaults to "Skills & Expertise".
   */
  sectionLabel?: string;
  /**
   * Optional additional CSS class names.
   */
  className?: string;
}

interface TechPillProps {
  name: string;
  iconImage?: { url: string; previewUrl?: string } | null;
  iconImageDark?: { url: string; previewUrl?: string } | null;
  highlight?: boolean;
}

function TechPill({
  name,
  iconImage,
  iconImageDark,
  highlight = false,
}: TechPillProps) {
  const hasLight = Boolean(iconImage?.url);
  const hasDark = Boolean(iconImageDark?.url);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-s-medium border transition-all duration-200 select-none",
        highlight
          ? "bg-brand-orange/10 border-brand-orange/30 text-text-primary hover:border-brand-orange hover:bg-brand-orange/15 shadow-sm"
          : "bg-bg-base-2 border-stroke text-text-secondary hover:border-stroke-orange/50 hover:bg-bg-base-3/40",
      )}
    >
      {hasLight && iconImage?.url && (
        <Image
          src={iconImage.url}
          alt={name}
          width={18}
          height={18}
          className={cn(
            "shrink-0 object-contain rounded",
            hasDark && "[html[data-theme='dark']_&]:hidden",
          )}
          unoptimized
        />
      )}
      {hasDark && iconImageDark?.url && (
        <Image
          src={iconImageDark.url}
          alt={name}
          width={18}
          height={18}
          className={cn(
            "shrink-0 object-contain rounded",
            hasLight ? "hidden [html[data-theme='dark']_&]:block" : "block",
          )}
          unoptimized
        />
      )}
      <span>{name}</span>
    </div>
  );
}

function CheckDot() {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2 shrink-0"
      aria-hidden="true"
    />
  );
}

/**
 * `<SkillsSection>` React Server Component displaying structured technical and domain competencies dynamically from CMS.
 */
export function SkillsSection({
  categories,
  skills: _skills,
  sectionLabel,
  className = "",
}: SkillsSectionProps) {
  const t = useTranslations("skills");

  if (!categories || categories.length === 0) {
    return null;
  }

  const technicalCategories = categories.filter(
    (c) =>
      c.groupType === "technical" &&
      (c.skills?.length > 0 || Boolean(c.description)),
  );
  const softSkillCategories = categories.filter(
    (c) =>
      c.groupType === "soft_skills" &&
      (c.skills?.length > 0 || Boolean(c.description)),
  );

  return (
    <section
      aria-label={sectionLabel ?? t("sectionLabel")}
      className={cn("w-full flex flex-col gap-8 items-start", className)}
    >
      <SectionTag label={sectionLabel ?? t("sectionLabel")} />

      <ScrollReveal
        animation="fade-up"
        selector=".skill-group-container"
        stagger={0.15}
        className="w-full flex flex-col gap-10"
      >
        {technicalCategories.length > 0 && (
          <div className="skill-group-container w-full flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stroke">
              <span className="text-body-s-medium uppercase tracking-wider text-brand-orange font-semibold">
                01
              </span>
              <h3 className="text-text-primary text-body-m-medium font-semibold">
                {t("technicalTitle")}
              </h3>
            </div>

            <div className="w-full flex flex-col divide-y divide-stroke">
              {technicalCategories.map((category) => (
                <div
                  key={category.id || category.name}
                  className="py-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
                >
                  <span className="w-full sm:w-48 md:w-56 shrink-0 text-body-m-medium text-text-secondary font-medium">
                    {category.name}
                  </span>
                  <div className="flex-1 flex flex-col gap-2.5">
                    <div className="flex flex-wrap gap-2 items-center">
                      {category.skills.map((skill) => (
                        <TechPill
                          key={skill.id || skill.name}
                          name={skill.name}
                          iconImage={skill.iconImage}
                          iconImageDark={skill.iconImageDark}
                          highlight={skill.isHighlight}
                        />
                      ))}
                    </div>
                    {category.description && (
                      <p className="text-body-s-regular text-text-secondary bg-bg-base-2/50 border border-stroke/70 rounded-lg p-3 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {softSkillCategories.length > 0 && (
          <div className="skill-group-container w-full flex flex-col gap-5">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stroke">
              <span className="text-body-s-medium uppercase tracking-wider text-brand-orange font-semibold">
                02
              </span>
              <h3 className="text-text-primary text-body-m-medium font-semibold">
                {t("softSkillsTitle")}
              </h3>
            </div>

            <div className="w-full flex flex-col divide-y divide-stroke">
              {softSkillCategories.map((category) => (
                <div
                  key={category.id || category.name}
                  className="py-4 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
                >
                  <span className="w-full sm:w-48 md:w-56 shrink-0 text-body-m-medium text-text-secondary font-medium">
                    {category.name}
                  </span>
                  <div className="flex-1 flex flex-col gap-2.5">
                    {category.displayType === "bullet_list" ? (
                      category.skills.map((skill) => (
                        <div
                          key={skill.id || skill.name}
                          className="flex items-start gap-2.5 text-body-m-regular text-text-primary"
                        >
                          <CheckDot />
                          <span className="leading-relaxed">
                            {skill.description || skill.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-wrap gap-2 items-center">
                        {category.skills.map((skill) => (
                          <TechPill
                            key={skill.id || skill.name}
                            name={skill.name}
                            iconImage={skill.iconImage}
                            iconImageDark={skill.iconImageDark}
                            highlight={skill.isHighlight}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}

export default SkillsSection;
