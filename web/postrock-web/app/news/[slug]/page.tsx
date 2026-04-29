import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { compileMarkdown } from "@/lib/mdx-compile";
import { getNewsPost, getNewsSlugs } from "@/lib/content/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getNewsPost(slug);
    return buildMetadata({
      title: frontmatter.title,
      description: frontmatter.excerpt,
      path: `/news/${slug}`,
    });
  } catch {
    return {};
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  let post: ReturnType<typeof getNewsPost>;
  try {
    post = getNewsPost(slug);
  } catch {
    notFound();
  }

  const body = await compileMarkdown(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 lg:px-8 lg:py-20">
      <nav className="text-sm text-foreground/70">
        <Link href="/news" className="hover:text-primary hover:underline">
          News & resources
        </Link>
        <span className="mx-2">/</span>
        <span>{post.frontmatter.category}</span>
      </nav>
      <header className="mt-8 border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">{post.frontmatter.category}</p>
        <h1 className="font-heading mt-3 text-4xl font-bold text-primary">{post.frontmatter.title}</h1>
        <p className="mt-4 text-sm text-foreground/65">{post.frontmatter.date}</p>
        <p className="mt-6 text-lg text-foreground/85">{post.frontmatter.excerpt}</p>
      </header>
      <div className="mt-10 max-w-none">{body}</div>
    </article>
  );
}
