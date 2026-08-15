"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { type LinkMetadata, useLinkPreview } from "./LinkPreviewContext";

export type { LinkMetadata };

export interface LinkPreviewProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  previewData?: Partial<LinkMetadata>;
  className?: string;
}

export function LinkPreview({
  href,
  children,
  previewData,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: LinkPreviewProps) {
  const context = useLinkPreview();

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (context && href.startsWith("http")) {
      context.showPreview({
        href,
        targetElement: e.currentTarget,
        target: href.startsWith("http") ? target : undefined,
        rel: href.startsWith("http") ? rel : undefined,
        previewData,
      });
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (context && href.startsWith("http")) {
      context.hidePreview();
    }
    onMouseLeave?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
    if (context && href.startsWith("http")) {
      context.showPreview({
        href,
        targetElement: e.currentTarget,
        target: href.startsWith("http") ? target : undefined,
        rel: href.startsWith("http") ? rel : undefined,
        previewData,
      });
    }
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
    if (context && href.startsWith("http")) {
      context.hidePreview();
    }
    onBlur?.(e);
  };

  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? target : undefined}
      rel={isExternal ? rel : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        "hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange",
        className ||
          "underline underline-offset-4 decoration-stroke hover:decoration-text-primary rounded-xs inline-block",
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export default LinkPreview;
