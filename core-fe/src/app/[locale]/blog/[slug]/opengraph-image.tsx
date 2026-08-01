import { ImageResponse } from "next/og";
import { getBlogPostBySlug } from "@/lib/api/blog";

export const alt = "Blog Post | Loc Tran";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  let title = "Blog Article";
  let publishedAt = "";
  let excerpt = "";
  let tags: string[] = [];

  try {
    const post = await getBlogPostBySlug({ slug, locale }).catch(() => null);
    if (post) {
      title = post.title || title;
      publishedAt = post.publishedAt || publishedAt;
      excerpt = post.excerpt || excerpt;
      tags = post.categoryTags || [];
    }
  } catch {
    // Fall back gracefully on error
  }

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#090d16",
        padding: "60px 80px",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#38bdf8",
          }}
        >
          Loc Tran
        </div>
        <div style={{ fontSize: 24, color: "#64748b" }}>/</div>
        <div style={{ fontSize: 24, color: "#94a3b8" }}>Blog</div>
      </div>

      {/* Content Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 60 ? 42 : 52,
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
          }}
        >
          {title}
        </div>
        {excerpt && (
          <div
            style={{
              fontSize: 22,
              color: "#94a3b8",
              lineHeight: 1.4,
            }}
          >
            {excerpt.length > 140 ? `${excerpt.slice(0, 140)}...` : excerpt}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #1e293b",
          paddingTop: "24px",
          fontSize: 20,
          color: "#64748b",
        }}
      >
        <div>{publishedAt || "Blog Article"}</div>
        <div>loct.dev</div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
