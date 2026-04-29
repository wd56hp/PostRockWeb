import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type CareerFrontmatter = {
  title: string;
  department: string;
  location: string;
  type: string;
};

const dir = path.join(process.cwd(), "content/careers");

export function getCareerSlugs(): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getCareerPost(slug: string) {
  const full = path.join(dir, `${slug}.mdx`);
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  return { frontmatter: data as CareerFrontmatter, content, slug };
}

export function getAllCareers(): (CareerFrontmatter & { slug: string })[] {
  return getCareerSlugs().map((slug) => {
    const { frontmatter } = getCareerPost(slug);
    return { slug, ...frontmatter };
  });
}
