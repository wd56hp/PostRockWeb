import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getAllNewsMeta, newsCategories } from "@/lib/content/news";
import { NewsCard } from "@/components/NewsCard";
import { NewsSidebar } from "@/components/NewsSidebar";

export const metadata: Metadata = buildMetadata({
  title: "News & Resources",
  description: "Announcements, agronomy tips, market updates, and company news from Post Rock Ag.",
  path: "/news",
});

type Props = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function NewsIndexPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const catRaw = sp.category?.trim();
  const all = getAllNewsMeta();
  const filtered =
    catRaw && catRaw !== "All" ? all.filter((p) => p.category === catRaw) : all;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">News & resources</p>
      <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">Updates from Post Rock Ag</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
        Filters below map to MDX frontmatter categories — edit posts under <code className="rounded bg-muted px-1">content/news</code>.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/news"
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${!catRaw || catRaw === "All" ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-muted"}`}
        >
          All
        </Link>
        {newsCategories.map((c) => (
          <Link
            key={c}
            href={`/news?category=${encodeURIComponent(c)}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${catRaw === c ? "bg-primary text-primary-foreground" : "border border-border bg-background hover:bg-muted"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-foreground/70 md:col-span-2">No posts match this filter yet.</p>
          ) : (
            filtered.map((post) => <NewsCard key={post.slug} {...post} />)
          )}
        </div>
        <NewsSidebar />
      </div>
    </div>
  );
}
