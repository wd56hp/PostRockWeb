import Link from "next/link";
import type { NewsFrontmatter } from "@/lib/content/news";

export function NewsCard(props: NewsFrontmatter & { slug: string }) {
  return (
    <article className="flex flex-col rounded-lg border border-border bg-background p-6 shadow-sm transition hover:border-secondary/60">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{props.category}</p>
      <p className="mt-2 text-xs text-foreground/60">{props.date}</p>
      <h3 className="font-heading mt-3 text-xl font-semibold text-primary">
        <Link href={`/news/${props.slug}`} className="hover:underline">
          {props.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/80">{props.excerpt}</p>
      <Link href={`/news/${props.slug}`} className="mt-5 text-sm font-semibold text-secondary hover:underline">
        Read update →
      </Link>
    </article>
  );
}
