import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal/ScrollReveal";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/cms";
import { ArticleCard } from "./ArticleCard";

export interface ArticleListProps {
  /** Array of blog post entries from Em-dash CMS. */
  posts: BlogPost[];
  /** Optional active locale override. */
  locale?: string;
  /** Optional section label (for accessibility). */
  sectionLabel?: string;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * `<ArticleList>` React Server Component rendering a list of blog posts.
 *
 * Ensures articles are ordered by `publishedAt` descending (most recent first).
 * Handles empty state gracefully when no articles are returned.
 * Fully adheres to design system tokens (AD-8) and RSC paradigm (AD-1).
 */
export function ArticleList({
  posts,
  locale,
  sectionLabel = "Blog Articles",
  className = "",
}: ArticleListProps) {
  const t = useTranslations("blog");

  // Empty state check
  if (!posts || posts.length === 0) {
    return (
      <section
        aria-label={sectionLabel}
        className={cn(
          "w-full flex flex-col items-center justify-center py-16 gap-4 text-center bg-bg-base-2 border border-stroke rounded-xl p-8",
          className,
        )}
      >
        <p className="text-text-secondary text-body-m-regular">
          {t("emptyState")}
        </p>
      </section>
    );
  }

  // Sort posts by publishedAt descending (most recent first)
  const sortedPosts = [...posts].sort((a, b) => {
    const timeA = Date.parse(a.publishedAt);
    const timeB = Date.parse(b.publishedAt);
    const validA = Number.isNaN(timeA) ? 0 : timeA;
    const validB = Number.isNaN(timeB) ? 0 : timeB;
    return validB - validA;
  });

  return (
    <section aria-label={sectionLabel} className={cn("w-full", className)}>
      <ScrollReveal animation="fade-up" stagger={0.08} selector="li">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPosts.map((post) => (
            <li key={post.id} className="flex">
              <ArticleCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  );
}

export default ArticleList;
