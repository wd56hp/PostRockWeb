import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { compileMarkdown } from "@/lib/mdx-compile";
import { getCareerPost, getCareerSlugs } from "@/lib/content/careers";
import { siteConfig } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCareerSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = getCareerPost(slug);
    return buildMetadata({
      title: `${frontmatter.title} — Careers`,
      description: `${frontmatter.department} opening — ${frontmatter.location}`,
      path: `/careers/${slug}`,
    });
  } catch {
    return {};
  }
}

export default async function CareerPostingPage({ params }: Props) {
  const { slug } = await params;
  let post: ReturnType<typeof getCareerPost>;
  try {
    post = getCareerPost(slug);
  } catch {
    notFound();
  }

  const body = await compileMarkdown(post.content);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 lg:px-8 lg:py-20">
      <nav className="text-sm text-foreground/70">
        <Link href="/careers" className="hover:text-primary hover:underline">
          Careers
        </Link>
        <span className="mx-2">/</span>
        <span>{post.frontmatter.title}</span>
      </nav>

      <header className="mt-8 border-b border-border pb-8">
        <h1 className="font-heading text-4xl font-bold text-primary">{post.frontmatter.title}</h1>
        <p className="mt-4 text-sm text-foreground/75">
          {post.frontmatter.department} · {post.frontmatter.location} · {post.frontmatter.type}
        </p>
      </header>

      <div className="mt-10 max-w-none">{body}</div>

      <div className="mt-12 rounded-xl border border-border bg-muted p-8">
        <h2 className="font-heading text-xl font-semibold text-primary">How to apply</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">
          Email{" "}
          <a href={`mailto:${siteConfig.emails.careers}`} className="font-semibold text-secondary underline">
            {siteConfig.emails.careers}
          </a>{" "}
          — reference this posting title in your subject line.
        </p>
      </div>
    </article>
  );
}
