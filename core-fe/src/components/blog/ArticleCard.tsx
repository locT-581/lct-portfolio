import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/cms";

export interface ArticleCardProps {
  /** Blog post entry from Em-dash CMS. */
  post: BlogPost;
  /** Optional active locale override. Defaults to active locale from `useLocale()`. */
  locale?: string;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * Safely format publication date using Intl.DateTimeFormat with active locale.
 */
function formatDate(dateStr: string, locale: string): string {
  try {
    const parsedDate = new Date(dateStr);
    if (Number.isNaN(parsedDate.getTime())) {
      return dateStr;
    }
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  } catch {
    return dateStr;
  }
}

/**
 * `<ArticleCard>` React Server Component displaying an individual blog article.
 *
 * Adheres strictly to RSC paradigm (AD-1) and design tokens (AD-8).
 */
export function ArticleCard({
  post,
  locale: propLocale,
  className = "",
}: ArticleCardProps) {
  const activeLocale = useLocale();
  const locale = propLocale ?? activeLocale;
  const { slug, title, excerpt, publishedAt, readingTime, categoryTags } = post;

  const formattedDate = formatDate(publishedAt, locale);

  return (
    <Link
      href={`/blog/${slug}`}
      className={cn(
        "group flex flex-col justify-between w-full h-full p-6 bg-bg-base-2 border border-stroke rounded-xl transition-all duration-300 ease-out hover:border-brand-orange/40 hover:bg-bg-base-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange",
        className,
      )}
      aria-label={title}
    >
      <div className="flex flex-col gap-3">
        {/* Category Tags & Reading Time */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-body-s-medium">
          <div className="flex items-center gap-2 flex-wrap">
            {categoryTags?.map((tag, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: category tags may contain duplicate string values
                key={`${tag}-${index}`}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-bg-base-1 border border-stroke text-brand-orange transition-colors duration-200 group-hover:border-brand-orange/40"
              >
                {tag}
              </span>
            ))}
          </div>
          {readingTime && (
            <span className="text-body-s-regular text-text-secondary">
              {readingTime}
            </span>
          )}
        </div>

        {/* Article Title */}
        <h2 className="text-body-l-medium text-text-primary group-hover:text-brand-orange transition-colors duration-200 line-clamp-2">
          {title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-body-m-regular text-text-secondary line-clamp-3">
            {excerpt}
          </p>
        )}
      </div>

      {/* Footer / Publication Date */}
      <div className="mt-6 pt-4 border-t border-stroke flex items-center justify-between text-body-s-regular text-text-secondary">
        <time dateTime={publishedAt}>{formattedDate}</time>
        <span className="group-hover:translate-x-1.5 transition-transform duration-200 text-brand-orange font-medium">
          →
        </span>
      </div>
    </Link>
  );
}

export default ArticleCard;
