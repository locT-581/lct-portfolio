import DOMPurify from "isomorphic-dompurify";

interface HtmlRendererProps {
  content: string;
}

export function HtmlRenderer({ content }: HtmlRendererProps) {
  const sanitizedHtml = DOMPurify.sanitize(content || "", {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className="article-html-content prose dark:prose-invert max-w-none"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: content is sanitised via DOMPurify before rendering
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
