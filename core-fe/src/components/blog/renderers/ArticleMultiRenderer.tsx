import { env } from "@/env";
import { HtmlRenderer } from "./HtmlRenderer";
import { MdxRenderer } from "./MdxRenderer";
import { RichTextRenderer } from "./RichTextRenderer";

export interface ArticleMultiRendererProps {
  contentType: string;
  content: string;
}

export function ArticleMultiRenderer({
  contentType,
  content,
}: ArticleMultiRendererProps) {
  const normalizedType = contentType?.toLowerCase()?.trim();

  switch (normalizedType) {
    case "mdx":
      return <MdxRenderer content={content} />;
    case "html":
      return <HtmlRenderer content={content} />;
    case "rich_text":
    case "richtext":
      return <RichTextRenderer content={content} />;
    default:
      if (env.NODE_ENV !== "production") {
        console.warn(
          `[ArticleMultiRenderer] Unknown content_type: "${contentType}". Falling back to plain text.`,
        );
      }
      return (
        <div className="article-plain-text bg-bg-base-2 border border-stroke p-4 rounded-lg font-mono text-text-secondary text-sm whitespace-pre-wrap">
          {content || ""}
        </div>
      );
  }
}
