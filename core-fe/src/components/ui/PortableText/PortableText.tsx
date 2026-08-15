import type { ReactNode } from "react";
import { CodeBlockViewer } from "@/components/ui/CodeBlockViewer";
import { LinkPreview } from "@/components/ui/LinkPreview";
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
  asset?: { url?: string };
  url?: string;
  previewUrl?: string;
  children?: PortableTextSpan[];
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
 * Renders inline spans with formatting marks (strong, em, underline, code, link).
 */
function renderSpan(
  span: PortableTextSpan,
  markDefs?: PortableTextBlock["markDefs"],
): ReactNode {
  let content: ReactNode = span.text || "";

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
        content = <u className="underline underline-offset-2">{content}</u>;
        break;
      case "strike-through":
      case "strikethrough":
        content = <s className="line-through">{content}</s>;
        break;
      case "code":
        content = (
          <code className="px-1.5 py-0.5 rounded bg-bg-base-2 text-brand-orange font-mono text-sm">
            {content}
          </code>
        );
        break;
      default: {
        const linkDef = markDefs?.find((def) => def._key === mark);
        if (linkDef?.href) {
          content = (
            <LinkPreview
              href={linkDef.href}
              className="text-brand-orange hover:underline font-medium"
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
 * Handles blocks (headings, paragraphs, blockquotes, lists), code blocks, images, and custom elements.
 */
export function PortableText({ value, className = "" }: PortableTextProps) {
  if (!value) return null;

  if (typeof value === "string") {
    return (
      <div
        className={cn(
          "text-body-m-regular text-text-secondary leading-relaxed space-y-3",
          className,
        )}
      >
        {value.split("\n\n").map((para, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: simple text split
          <p key={`para-${idx}`}>{para}</p>
        ))}
      </div>
    );
  }

  if (!Array.isArray(value)) return null;

  const blocks = value as PortableTextBlock[];

  // Group consecutive list items together
  const groupedBlocks: GroupedBlock[] = [];
  let currentList: {
    listItem: string;
    key: string;
    items: PortableTextBlock[];
  } | null = null;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Skip empty trailing text block
    const spans = block.children || [];
    const hasText = spans.some((s) => s.text && s.text.trim().length > 0);
    if (
      !hasText &&
      !block.listItem &&
      block.style === "normal" &&
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
    <div className={cn("portable-text-content space-y-3", className)}>
      {groupedBlocks.map((grouped, idx) => {
        if (grouped.type === "list") {
          const listChildren = grouped.items.map((liBlock, liIdx) => {
            const liKey = liBlock._key || `li-${liIdx}`;
            const spans = liBlock.children || [];
            return (
              <li key={liKey} className="leading-relaxed">
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
                className="list-decimal pl-5 space-y-1.5 text-body-m-regular text-text-secondary"
              >
                {listChildren}
              </ol>
            );
          }

          return (
            <ul
              key={grouped.key}
              className="list-disc pl-5 space-y-1 text-body-m-regular text-text-secondary"
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
            <CodeBlockViewer
              key={key}
              code={codeContent}
              language={block.language}
              filename={block.filename}
            />
          );
        }

        // 2. Image Block (_type: "image")
        if (block._type === "image") {
          const imgSrc =
            block.asset?.url || block.url || block.previewUrl || "";
          if (!imgSrc) return null;
          return (
            <figure key={key} className="my-4">
              {/* biome-ignore lint/performance/noImgElement: Dynamic CMS images with variable dimensions */}
              <img
                src={imgSrc}
                alt={block.alt || "CMS image"}
                className="rounded-lg max-w-full h-auto border border-stroke"
              />
              {block.caption && (
                <figcaption className="text-caption text-text-secondary mt-1.5 text-center">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // 3. Horizontal Rule / Divider
        if (block._type === "hr" || block._type === "divider") {
          return <hr key={key} className="border-stroke my-4" />;
        }

        // 4. Standard Text Block (_type: "block")
        const spans = block.children || [];
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
                className="text-h2 md:text-h1 font-bold text-text-primary tracking-tight mt-6 mb-2"
              >
                {renderedChildren}
              </h1>
            );
          case "h2":
            return (
              <h2
                key={key}
                className="text-h3 md:text-h2 font-semibold text-text-primary tracking-tight mt-5 mb-2"
              >
                {renderedChildren}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={key}
                className="text-h4 md:text-h3 font-semibold text-text-primary tracking-tight mt-3 mb-1"
              >
                {renderedChildren}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={key}
                className="text-h5 font-semibold text-text-primary mt-3 mb-1"
              >
                {renderedChildren}
              </h4>
            );
          case "blockquote":
            return (
              <blockquote
                key={key}
                className="border-l-3 border-brand-orange pl-4 italic text-text-secondary my-3"
              >
                {renderedChildren}
              </blockquote>
            );
          default:
            return (
              <p
                key={key}
                className="text-body-m-regular text-text-secondary leading-relaxed"
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
