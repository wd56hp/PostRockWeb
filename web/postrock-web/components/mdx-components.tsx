import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="font-heading mt-10 scroll-mt-24 text-2xl font-semibold text-primary first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading mt-8 text-xl font-semibold text-secondary">{children}</h3>
  ),
  p: ({ children }) => <p className="mt-4 leading-relaxed text-foreground/90">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6 text-foreground/90">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-foreground/90">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  a: ({ href, children, ...props }) => {
    const h = href as string | undefined;
    if (h?.startsWith("http")) {
      return (
        <a
          href={h}
          className="font-medium text-primary underline underline-offset-4 hover:text-secondary"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={h ?? "#"} className="font-medium text-primary underline underline-offset-4 hover:text-secondary" {...props}>
        {children}
      </Link>
    );
  },
};
