import type { JSX } from "react";

export interface RichTextBlock {
  type: string;
  level?: number;
  text?: string;
  items?: string[];
  children?: RichTextBlock[];
}

export interface RichTextRendererProps {
  content: string | RichTextBlock[];
}

function parseBlocks(content: string | RichTextBlock[]): RichTextBlock[] {
  if (Array.isArray(content)) {
    return content;
  }

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.blocks)) return parsed.blocks;
      if (parsed && Array.isArray(parsed.content)) return parsed.content;
    } catch {
      // Content is formatted string text
      const lines = content.split("\n\n").filter(Boolean);
      return lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("# "))
          return { type: "heading", level: 1, text: trimmed.slice(2) };
        if (trimmed.startsWith("## "))
          return { type: "heading", level: 2, text: trimmed.slice(3) };
        if (trimmed.startsWith("### "))
          return { type: "heading", level: 3, text: trimmed.slice(4) };
        if (trimmed.startsWith("#### "))
          return { type: "heading", level: 4, text: trimmed.slice(5) };
        if (trimmed.startsWith("##### "))
          return { type: "heading", level: 5, text: trimmed.slice(6) };
        if (trimmed.startsWith("###### "))
          return { type: "heading", level: 6, text: trimmed.slice(7) };
        if (trimmed.startsWith("> "))
          return { type: "blockquote", text: trimmed.slice(2) };
        if (trimmed.startsWith("```")) {
          const codeText = trimmed
            .replace(/^```[a-z]*\n?/, "")
            .replace(/\n?```$/, "");
          return { type: "code", text: codeText };
        }
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed
            .split("\n")
            .map((item) => item.replace(/^[-*]\s+/, ""));
          return { type: "unordered-list", items };
        }
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed
            .split("\n")
            .map((item) => item.replace(/^\d+\.\s+/, ""));
          return { type: "ordered-list", items };
        }
        return { type: "paragraph", text: trimmed };
      });
    }
  }

  return [];
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="article-richtext-content space-y-4">
      {blocks.map((block, index) => {
        const key = `rt-block-${index}`;

        switch (block.type) {
          case "heading":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6": {
            const level =
              block.level ||
              (block.type.startsWith("h")
                ? Number.parseInt(block.type[1], 10)
                : 1);
            const HeadingTag =
              `h${Math.min(Math.max(level, 1), 6)}` as keyof JSX.IntrinsicElements;
            const headingClasses: Record<number, string> = {
              1: "text-h1 text-text-primary mt-8 mb-4",
              2: "text-h2 text-text-primary mt-8 mb-4",
              3: "text-h3 text-text-primary mt-6 mb-3",
              4: "text-h4 text-text-primary mt-6 mb-3",
              5: "text-h5 text-text-primary mt-4 mb-2",
              6: "text-h6 text-text-primary mt-4 mb-2",
            };
            return (
              <HeadingTag
                key={key}
                className={headingClasses[level] || headingClasses[1]}
              >
                {block.text}
              </HeadingTag>
            );
          }
          case "blockquote":
            return (
              <blockquote
                key={key}
                className="border-l-4 border-brand-orange pl-4 italic text-text-secondary my-6"
              >
                {block.text}
              </blockquote>
            );
          case "code":
          case "code_block":
            return (
              <pre
                key={key}
                className="bg-bg-base-2 text-text-primary p-4 rounded-lg overflow-x-auto border border-stroke my-6 font-mono text-sm"
              >
                <code>{block.text}</code>
              </pre>
            );
          case "unordered-list":
          case "ul":
          case "bullet_list":
            return (
              <ul
                key={key}
                className="list-disc list-inside text-body-m-regular text-text-secondary mb-4 space-y-2 pl-4"
              >
                {(block.items || []).map((item, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: list item strings may be duplicates
                  <li key={`${key}-item-${idx}`}>{item}</li>
                ))}
              </ul>
            );
          case "ordered-list":
          case "ol":
          case "ordered_list":
            return (
              <ol
                key={key}
                className="list-decimal list-inside text-body-m-regular text-text-secondary mb-4 space-y-2 pl-4"
              >
                {(block.items || []).map((item, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: list item strings may be duplicates
                  <li key={`${key}-item-${idx}`}>{item}</li>
                ))}
              </ol>
            );
          default:
            return (
              <p
                key={key}
                className="text-body-m-regular text-text-secondary leading-relaxed mb-4"
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
