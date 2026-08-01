import type { BlogPost } from "@/types/cms";

export interface ArticleDetailHeaderProps {
  /** Blog post data */
  post: BlogPost;
  /** Active locale for date formatting */
  locale: string;
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
 * `<ArticleDetailHeader>` React Server Component displaying the header section of an article detail page.
 */
export function ArticleDetailHeader({
  post,
  locale,
}: ArticleDetailHeaderProps) {
  const { title, excerpt, publishedAt, readingTime, categoryTags } = post;
  const formattedDate = formatDate(publishedAt, locale);

  return (
    <header className="flex flex-col gap-4 pb-8 mb-8 border-b border-stroke">
      {/* Category Tags & Meta info */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {categoryTags?.map((tag, index) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: category tags may contain duplicate string values
              key={`${tag}-${index}`}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-bg-base-2 border border-stroke text-brand-orange"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 text-body-s-regular text-text-secondary">
          <time dateTime={publishedAt}>{formattedDate}</time>
          {readingTime && (
            <>
              <span aria-hidden="true">•</span>
              <span>{readingTime}</span>
            </>
          )}
        </div>
      </div>

      {/* Article Title */}
      <h1 className="text-h1 text-text-primary font-semibold tracking-tight">
        {title}
      </h1>

      {/* Article Excerpt */}
      {excerpt && (
        <p className="text-body-m-regular text-text-secondary leading-relaxed">
          {excerpt}
        </p>
      )}
    </header>
  );
}

export default ArticleDetailHeader;
