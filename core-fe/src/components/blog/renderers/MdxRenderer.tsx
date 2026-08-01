import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentPropsWithoutRef, HTMLAttributes } from "react";
import rehypeHighlight from "rehype-highlight";

interface MdxRendererProps {
  content: string;
}

const components = {
  h1: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-h1 text-text-primary mt-8 mb-4" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-h2 text-text-primary mt-8 mb-4" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-h3 text-text-primary mt-6 mb-3" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-h4 text-text-primary mt-6 mb-3" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="text-h5 text-text-primary mt-4 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className="text-h6 text-text-primary mt-4 mb-2" {...props}>
      {children}
    </h6>
  ),
  p: ({ children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="text-body-m-regular text-text-secondary leading-relaxed mb-4"
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside text-body-m-regular text-text-secondary mb-4 space-y-2 pl-4"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside text-body-m-regular text-text-secondary mb-4 space-y-2 pl-4"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-brand-orange pl-4 italic text-text-secondary my-6"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: HTMLAttributes<HTMLElement>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-bg-base-2 text-brand-orange px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-bg-base-2 text-text-primary p-4 rounded-lg overflow-x-auto border border-stroke my-6 font-mono text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      href={href}
      className="text-brand-orange underline hover:opacity-80 transition-opacity"
      {...props}
    >
      {children}
    </a>
  ),
};

export function MdxRenderer({ content }: MdxRendererProps) {
  return (
    <div className="article-mdx-content prose dark:prose-invert max-w-none">
      <MDXRemote
        source={content}
        components={components}
        options={{
          mdxOptions: {
            rehypePlugins: [rehypeHighlight],
          },
        }}
      />
    </div>
  );
}
