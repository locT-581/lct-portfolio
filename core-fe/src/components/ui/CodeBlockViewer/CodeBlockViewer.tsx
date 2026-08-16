"use client";

import { CodeBlock, CopyBlock, dracula } from "react-code-blocks";
import { cn } from "@/lib/utils";

export interface CodeBlockViewerProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  allowCopy?: boolean;
  className?: string;
}

export function CodeBlockViewer({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  allowCopy = false,
  className = "",
}: CodeBlockViewerProps) {
  // Normalize language for react-code-blocks (e.g. tsx, js, html, css, json)
  const normalizedLang = (language || "text").toLowerCase();

  return (
    <div
      className={cn(
        "my-4 overflow-hidden text-sm font-mono shadow-xs",
        className,
      )}
    >
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-stroke text-caption text-text-secondary font-mono bg-bg-base-1 select-none">
          <span>{filename}</span>
          <span className="uppercase text-2xs text-text-muted">
            {normalizedLang}
          </span>
        </div>
      )}
      <div className="overflow-x-auto text-sm [&>div]:bg-transparent! [&_code]:font-mono!">
        {allowCopy ? (
          <CopyBlock
            text={code}
            language={normalizedLang}
            showLineNumbers={showLineNumbers}
            theme={dracula}
            codeBlock
            wrapLongLines
          />
        ) : (
          <CodeBlock
            text={code}
            language={normalizedLang}
            showLineNumbers={showLineNumbers}
            theme={dracula}
            wrapLongLines
          />
        )}
      </div>
    </div>
  );
}

export default CodeBlockViewer;
