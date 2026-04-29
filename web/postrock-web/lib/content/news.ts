import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const newsCategories = [
  "Announcements",
  "Agronomy Tips",
  "Market Updates",
  "Company News",
] as const;

export type NewsCategory = (typeof newsCategories)[number];

export type NewsFrontmatter = {
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
};

const newsDir = path.join(process.cwd(), "content/news");

export function getNewsSlugs(): string[] {
  if (!fs.existsSync(newsDir)) return [];
  return fs
    .readdirSync(newsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getNewsPost(slug: string) {
  const full = path.join(newsDir, `${slug}.mdx`);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as NewsFrontmatter, content, slug };
}

export function getAllNewsMeta(): (NewsFrontmatter & { slug: string })[] {
  return getNewsSlugs()
    .map((slug) => {
      const { frontmatter } = getNewsPost(slug);
      return { slug, ...frontmatter };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
