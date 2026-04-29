import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getLegalCopy } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility",
  description: "Accessibility statement for postrockag.com — WCAG-oriented placeholders.",
  path: "/accessibility",
});

export default async function AccessibilityPage() {
  const legal = await getLegalCopy();
  const paragraphs = legal.accessibilityBody.split(/\n\n+/).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700">LEGAL REVIEW REQUIRED</p>
      <h1 className="font-heading mt-4 text-4xl font-bold text-primary">Accessibility</h1>
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-foreground/85">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
