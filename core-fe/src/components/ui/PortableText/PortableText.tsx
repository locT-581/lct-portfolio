import type { ReactNode } from "react";
import { CodeBlockViewer } from "@/components/ui/CodeBlockViewer";
import { LinkPreview } from "@/components/ui/LinkPreview";
import { extractMediaUrl } from "@/lib/api/about";
import { cn } from "@/lib/utils";

export interface PortableTextSpan {
  _type?: string;
  _key?: string;
  text?: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _type?: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  code?: string;
  language?: string;
  filename?: string;
  alt?: string;
  caption?: string;
  asset?: { url?: string; _ref?: string; meta?: { storageKey?: string } };
  url?: string;
  previewUrl?: string;
  children?: PortableTextSpan[];
  rows?: Array<{ cells?: string[] }>;
  table?: { rows?: Array<{ cells?: string[] }> };
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
}

export interface PortableTextProps {
  value: unknown;
  className?: string;
}

/**
 * Renders inline spans with formatting marks (strong, em, underline, code, highlight, links).
 */
function renderSpan(
  span: PortableTextSpan,
  markDefs?: PortableTextBlock["markDefs"],
): ReactNode {
  let content: ReactNode = span.text ?? "";

  if (!span.marks || span.marks.length === 0) {
    return content;
  }

  for (const mark of span.marks) {
    switch (mark) {
      case "strong":
      case "bold":
        content = (
          <strong className="font-semibold text-text-primary">{content}</strong>
        );
        break;
      case "em":
      case "italic":
        content = <em className="italic">{content}</em>;
        break;
      case "underline":
        content = (
          <u className="underline underline-offset-4 decoration-stroke-orange/40">
            {content}
          </u>
        );
        break;
      case "strike-through":
      case "strikethrough":
      case "strike":
        content = (
          <s className="line-through text-text-secondary/70">{content}</s>
        );
        break;
      case "code":
        content = (
          <code className="px-1.5 py-0.5 mx-0.5 rounded-md bg-bg-base-2 border border-stroke text-brand-orange font-mono text-[0.875em] font-medium inline-block align-baseline">
            {content}
          </code>
        );
        break;
      case "highlight":
      case "mark":
        content = (
          <mark className="bg-brand-orange/15 text-text-primary px-1 py-0.5 rounded">
            {content}
          </mark>
        );
        break;
      default: {
        const linkDef = markDefs?.find((def) => def._key === mark);
        if (linkDef?.href) {
          const isExternal =
            linkDef.href.startsWith("http://") ||
            linkDef.href.startsWith("https://");
          content = (
            <LinkPreview
              href={linkDef.href}
              className="text-brand-orange hover:underline font-medium inline-flex items-center gap-0.5 underline-offset-4 transition-colors"
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {content}
            </LinkPreview>
          );
        }
        break;
      }
    }
  }

  return content;
}

/**
 * Parses markdown inline formatted strings into PortableText spans.
 */
function parseInlineMarkdown(
  text: string,
  keyPrefix: string,
  markDefs: NonNullable<PortableTextBlock["markDefs"]>,
): PortableTextSpan[] {
  const regex =
    /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  const spans: PortableTextSpan[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = regex.exec(text);
  let spanIndex = 0;

  while (match !== null) {
    if (match.index > lastIndex) {
      spans.push({
        _type: "span",
        _key: `${keyPrefix}-s-${spanIndex++}`,
        text: text.slice(lastIndex, match.index),
      });
    }

    if (match[2]) {
      // Bold **...**
      spans.push({
        _type: "span",
        _key: `${keyPrefix}-s-${spanIndex++}`,
        text: match[2],
        marks: ["strong"],
      });
    } else if (match[3]) {
      // Italic *...*
      spans.push({
        _type: "span",
        _key: `${keyPrefix}-s-${spanIndex++}`,
        text: match[3],
        marks: ["em"],
      });
    } else if (match[4]) {
      // Inline code `...`
      spans.push({
        _type: "span",
        _key: `${keyPrefix}-s-${spanIndex++}`,
        text: match[4],
        marks: ["code"],
      });
    } else if (match[5] && match[6]) {
      // Link [text](href)
      const linkKey = `link-${keyPrefix}-${spanIndex}`;
      markDefs.push({
        _key: linkKey,
        _type: "link",
        href: match[6],
      });
      spans.push({
        _type: "span",
        _key: `${keyPrefix}-s-${spanIndex++}`,
        text: match[5],
        marks: [linkKey],
      });
    }

    lastIndex = regex.lastIndex;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    spans.push({
      _type: "span",
      _key: `${keyPrefix}-s-${spanIndex++}`,
      text: text.slice(lastIndex),
    });
  }

  return spans.length > 0
    ? spans
    : [{ _type: "span", _key: `${keyPrefix}-s-0`, text }];
}

/**
 * Fallback parser for raw markdown / plain text strings into PortableText blocks.
 */
function parseMarkdownStringToBlocks(text: string): PortableTextBlock[] {
  const chunks = text.split(/\n{2,}/).filter((c) => c.trim().length > 0);
  const result: PortableTextBlock[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].trim();
    const key = `str-block-${i}`;
    const markDefs: NonNullable<PortableTextBlock["markDefs"]> = [];

    if (chunk.startsWith("# ")) {
      result.push({
        _type: "block",
        _key: key,
        style: "h1",
        markDefs,
        children: parseInlineMarkdown(chunk.slice(2).trim(), key, markDefs),
      });
    } else if (chunk.startsWith("## ")) {
      result.push({
        _type: "block",
        _key: key,
        style: "h2",
        markDefs,
        children: parseInlineMarkdown(chunk.slice(3).trim(), key, markDefs),
      });
    } else if (chunk.startsWith("### ")) {
      result.push({
        _type: "block",
        _key: key,
        style: "h3",
        markDefs,
        children: parseInlineMarkdown(chunk.slice(4).trim(), key, markDefs),
      });
    } else if (chunk.startsWith("#### ")) {
      result.push({
        _type: "block",
        _key: key,
        style: "h4",
        markDefs,
        children: parseInlineMarkdown(chunk.slice(5).trim(), key, markDefs),
      });
    } else if (chunk.startsWith("> ")) {
      result.push({
        _type: "block",
        _key: key,
        style: "blockquote",
        markDefs,
        children: parseInlineMarkdown(chunk.slice(2).trim(), key, markDefs),
      });
    } else if (chunk.startsWith("```")) {
      const code = chunk
        .replace(/^```[a-zA-Z0-9_-]*\n?/, "")
        .replace(/\n?```$/, "");
      const langMatch = chunk.match(/^```([a-zA-Z0-9_-]+)/);
      result.push({
        _type: "code",
        _key: key,
        code,
        language: langMatch ? langMatch[1] : undefined,
      });
    } else if (/^[-*•]\s+/.test(chunk)) {
      const lines = chunk.split("\n");
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j].trim();
        if (line) {
          const liKey = `${key}-li-${j}`;
          const liMarkDefs: NonNullable<PortableTextBlock["markDefs"]> = [];
          result.push({
            _type: "block",
            _key: liKey,
            listItem: "bullet",
            style: "normal",
            markDefs: liMarkDefs,
            children: parseInlineMarkdown(
              line.replace(/^[-*•]\s+/, ""),
              liKey,
              liMarkDefs,
            ),
          });
        }
      }
    } else if (/^\d+\.\s+/.test(chunk)) {
      const lines = chunk.split("\n");
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j].trim();
        if (line) {
          const liKey = `${key}-li-${j}`;
          const liMarkDefs: NonNullable<PortableTextBlock["markDefs"]> = [];
          result.push({
            _type: "block",
            _key: liKey,
            listItem: "number",
            style: "normal",
            markDefs: liMarkDefs,
            children: parseInlineMarkdown(
              line.replace(/^\d+\.\s+/, ""),
              liKey,
              liMarkDefs,
            ),
          });
        }
      }
    } else {
      result.push({
        _type: "block",
        _key: key,
        style: "normal",
        markDefs,
        children: parseInlineMarkdown(chunk, key, markDefs),
      });
    }
  }

  return result;
}

type GroupedBlock =
  | {
      type: "list";
      listItem: string;
      key: string;
      items: PortableTextBlock[];
    }
  | {
      type: "block";
      block: PortableTextBlock;
    };

/**
 * Component to render Emdash / Sanity Portable Text blocks into styled semantic HTML elements.
 * Handles headings, paragraphs, lists, mark decorations, code blocks, images, tables, and callouts.
 */
export function PortableText({ value, className = "" }: PortableTextProps) {
  if (!value) return null;

  let blocks: PortableTextBlock[];

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          blocks = parsed;
        } else if (parsed && Array.isArray(parsed.blocks)) {
          blocks = parsed.blocks;
        } else if (parsed && Array.isArray(parsed.content)) {
          blocks = parsed.content;
        } else {
          blocks = parseMarkdownStringToBlocks(value);
        }
      } catch {
        blocks = parseMarkdownStringToBlocks(value);
      }
    } else {
      blocks = parseMarkdownStringToBlocks(value);
    }
  } else if (Array.isArray(value)) {
    blocks = value as PortableTextBlock[];
  } else {
    return null;
  }

  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Group consecutive list items together into unified lists
  const groupedBlocks: GroupedBlock[] = [];
  let currentList: {
    listItem: string;
    key: string;
    items: PortableTextBlock[];
  } | null = null;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Skip empty trailing text blocks with no listItem
    const spans = block.children || [];
    const hasText = spans.some((s) => s.text && s.text.trim().length > 0);
    if (
      !hasText &&
      !block.listItem &&
      (block.style === "normal" || !block.style) &&
      block._type === "block"
    ) {
      continue;
    }

    if (block.listItem) {
      if (currentList && currentList.listItem === block.listItem) {
        currentList.items.push(block);
      } else {
        if (currentList) {
          groupedBlocks.push({ type: "list", ...currentList });
        }
        currentList = {
          listItem: block.listItem,
          key: `list-${block._key || i}`,
          items: [block],
        };
      }
    } else {
      if (currentList) {
        groupedBlocks.push({ type: "list", ...currentList });
        currentList = null;
      }
      groupedBlocks.push({ type: "block", block });
    }
  }

  if (currentList) {
    groupedBlocks.push({ type: "list", ...currentList });
  }

  return (
    <div
      className={cn("portable-text-content w-full flex flex-col", className)}
    >
      {groupedBlocks.map((grouped, idx) => {
        if (grouped.type === "list") {
          const listChildren = grouped.items.map((liBlock, liIdx) => {
            const liKey = liBlock._key || `li-${liIdx}`;
            const spans = liBlock.children || [];
            const level = liBlock.level || 1;
            const indentStyle =
              level > 1
                ? { paddingLeft: `${(level - 1) * 1.25}rem` }
                : undefined;

            return (
              <li
                key={liKey}
                style={indentStyle}
                className="leading-relaxed text-body-m-regular text-text-secondary pl-1"
              >
                {spans.map((span, sIdx) => (
                  <span key={span._key || `span-${sIdx}`}>
                    {renderSpan(span, liBlock.markDefs)}
                  </span>
                ))}
              </li>
            );
          });

          if (grouped.listItem === "number") {
            return (
              <ol
                key={grouped.key}
                className="list-decimal pl-6 my-3 space-y-2 text-body-m-regular text-text-secondary marker:font-medium"
              >
                {listChildren}
              </ol>
            );
          }

          return (
            <ul
              key={grouped.key}
              className="list-disc pl-6 my-3 space-y-2 text-body-m-regular text-text-secondary marker:opacity-90"
            >
              {listChildren}
            </ul>
          );
        }

        const block = grouped.block;
        const key = block._key || `block-${idx}`;

        // 1. Code Block (_type: "code")
        if (block._type === "code" || block.code !== undefined) {
          const codeContent = block.code || "";
          return (
            <div key={key} className="my-5 w-full">
              <CodeBlockViewer
                code={codeContent}
                language={block.language}
                filename={block.filename}
              />
            </div>
          );
        }

        // 2. Image Block (_type: "image")
        if (block._type === "image") {
          const imgSrc =
            (block.asset ? extractMediaUrl(block.asset) : null) ||
            extractMediaUrl(block) ||
            (block.url ? extractMediaUrl(block.url) : null) ||
            (block.previewUrl ? extractMediaUrl(block.previewUrl) : null) ||
            (block.asset?._ref ? extractMediaUrl(block.asset._ref) : null) ||
            (block.asset?.url ? extractMediaUrl(block.asset.url) : null) ||
            block.url ||
            block.previewUrl ||
            "";
          if (!imgSrc) return null;
          return (
            <figure
              key={key}
              className="my-8 w-full flex flex-col items-center"
            >
              {/* biome-ignore lint/performance/noImgElement: Dynamic CMS images with variable dimensions */}
              <img
                src={imgSrc}
                alt={block.alt || block.caption || "Content image"}
                className="rounded-xl w-full max-w-full h-auto border border-stroke shadow-sm object-cover bg-bg-base-2"
                loading="lazy"
              />
              {block.caption && (
                <figcaption className="text-body-s-regular text-text-secondary mt-2.5 text-center italic">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // 3. Table Block (_type: "table" / "tableBlock")
        if (block._type === "table" || block._type === "tableBlock") {
          const rows = block.rows || block.table?.rows || [];
          if (Array.isArray(rows) && rows.length > 0) {
            return (
              <div
                key={key}
                className="my-6 overflow-x-auto w-full rounded-xl border border-stroke"
              >
                <table className="min-w-full divide-y divide-stroke text-sm text-left">
                  <tbody className="divide-y divide-stroke">
                    {rows.map((row, rIdx) => {
                      const isHeader = rIdx === 0;
                      const cells = row.cells || [];
                      return (
                        <tr
                          // biome-ignore lint/suspicious/noArrayIndexKey: CMS table rows
                          key={`row-${rIdx}`}
                          className={
                            isHeader
                              ? "bg-bg-base-2 font-semibold text-text-primary"
                              : "text-text-secondary hover:bg-bg-base-2/50"
                          }
                        >
                          {cells.map((cellText, cIdx) => {
                            const cellKey = `cell-${rIdx}-${cIdx}`;
                            return isHeader ? (
                              <th
                                key={cellKey}
                                className="px-4 py-3 text-xs uppercase tracking-wider"
                              >
                                {cellText}
                              </th>
                            ) : (
                              <td key={cellKey} className="px-4 py-3">
                                {cellText}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
        }

        // 4. Horizontal Rule / Divider
        if (block._type === "hr" || block._type === "divider") {
          return <hr key={key} className="border-stroke my-8" />;
        }

        // 5. Standard Text Block (_type: "block")
        const spans = block.children || [];
        const textContent = spans
          .map((s) => s.text || "")
          .join("")
          .trim();
        const headingSlug = textContent
          ? textContent
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
          : undefined;

        const renderedChildren = spans.map((span, sIdx) => (
          <span key={span._key || `span-${sIdx}`}>
            {renderSpan(span, block.markDefs)}
          </span>
        ));

        switch (block.style) {
          case "h1":
            return (
              <h1
                key={key}
                id={headingSlug}
                className="scroll-mt-24 text-h2 md:text-h1 font-semibold text-text-primary tracking-tight mt-10 mb-4 first:mt-0"
              >
                {renderedChildren}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={key}
                id={headingSlug}
                className="scroll-mt-24 text-h3 md:text-h2 font-semibold text-text-primary tracking-tight mt-8 mb-3.5 pb-2 border-b border-stroke"
              >
                {renderedChildren}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={key}
                id={headingSlug}
                className="scroll-mt-24 text-h4 md:text-h3 font-semibold text-text-primary tracking-tight mt-6 mb-2.5"
              >
                {renderedChildren}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={key}
                id={headingSlug}
                className="scroll-mt-24 text-h5 md:text-h4 font-semibold text-text-primary mt-5 mb-2"
              >
                {renderedChildren}
              </h4>
            );
          case "h5":
            return (
              <h5
                key={key}
                id={headingSlug}
                className="scroll-mt-24 text-h6 md:text-h5 font-semibold text-text-primary mt-4 mb-1.5"
              >
                {renderedChildren}
              </h5>
            );
          case "h6":
            return (
              <h6
                key={key}
                id={headingSlug}
                className="scroll-mt-24 text-body-m-medium font-semibold uppercase tracking-wider text-text-secondary mt-4 mb-1"
              >
                {renderedChildren}
              </h6>
            );
          case "blockquote":
            return (
              <blockquote
                key={key}
                className="border-l-2 border-brand-orange bg-bg-base-2/40 px-4 py-3 rounded-r-lg italic text-text-secondary my-5 text-body-m-regular leading-relaxed"
              >
                {renderedChildren}
              </blockquote>
            );
          case "callout":
            return (
              <aside
                key={key}
                className="my-5 flex gap-3 p-4 rounded-xl border border-stroke bg-bg-base-2/80 text-text-primary"
              >
                <div className="text-body-m-regular text-text-secondary leading-relaxed">
                  {renderedChildren}
                </div>
              </aside>
            );
          default:
            return (
              <p
                key={key}
                className="text-body-m-regular text-text-secondary leading-relaxed mb-4 last:mb-0"
              >
                {renderedChildren}
              </p>
            );
        }
      })}
    </div>
  );
}

export default PortableText;
