import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx-components";

export async function compileMarkdown(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
  });
  return content;
}
