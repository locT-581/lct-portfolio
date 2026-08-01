"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { subscribeNewsletterAction } from "@/app/actions/newsletter";
import { NewsletterBlock } from "@/components/ui/NewsletterBlock/NewsletterBlock";
import { cn } from "@/lib/utils";

/**
 * Props for the `<HomeCtaSection>` component.
 */
export interface HomeCtaSectionProps {
  /**
   * Locale string used to build locale-prefixed hrefs.
   */
  locale: string;
  /**
   * Additional CSS class names.
   */
  className?: string;
}

/**
 * `<HomeCtaSection>` is a Client Component (interactive island) that renders:
 * - A primary CTA link-button (e.g. "View Projects") styled with design tokens.
 * - A `<NewsletterBlock>` wired to TanStack Query `useMutation` calling
 *   `subscribeNewsletterAction` via the newsletter adapter.
 *
 * Adheres to AD-1 (Islands-of-Interactivity), AD-5/AD-6 (TanStack Query
 * for mutation state), and AD-8 (design tokens).
 */
export function HomeCtaSection({
  locale,
  className = "",
}: HomeCtaSectionProps) {
  const t = useTranslations("home");

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const result = await subscribeNewsletterAction({ email, locale });
      if (!result.success) {
        throw new Error(result.message ?? "Subscription failed");
      }
      return result;
    },
  });

  const handleNewsletterSubmit = async (email: string): Promise<void> => {
    await mutation.mutateAsync(email);
  };

  return (
    <section
      aria-label="CTA and newsletter section"
      className={cn("w-full flex flex-col gap-6 md:gap-8", className)}
    >
      {/* Primary CTA — "View Projects" link styled as brand button */}
      <div>
        <Link
          id="home-cta-view-projects"
          href={`/${locale}/projects`}
          className="inline-flex items-center justify-center h-10 px-5 rounded text-btn bg-brand-orange text-text-btn-primary hover:opacity-90 transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange"
        >
          {t("ctaButtonLabel")}
        </Link>
      </div>

      {/* Newsletter subscription block */}
      <NewsletterBlock
        onSubmit={handleNewsletterSubmit}
        status={mutation.status === "pending" ? "loading" : mutation.status}
        errorMessage={mutation.error?.message}
        className="w-full"
      />
    </section>
  );
}
