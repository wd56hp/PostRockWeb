import type { VisionMissionContent } from "@/lib/sanity/loaders";

type Props = {
  content: VisionMissionContent;
  /** Extra classes on the outermost wrapper (e.g. section spacing). */
  className?: string;
};

export function VisionMissionSection({ content, className = "" }: Props) {
  return (
    <div className={className}>
      <h2 className="font-heading text-3xl font-semibold text-primary">Vision, mission & values</h2>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Vision</h3>
          <p className="mt-4 text-lg font-semibold text-primary">{content.vision}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-8 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Mission</h3>
          <p className="mt-4 text-lg font-semibold text-primary">{content.mission}</p>
        </div>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {content.values.map((v) => (
          <li key={v.title} className="rounded-lg border border-border bg-muted px-5 py-4 text-sm">
            <span className="font-semibold text-primary">{v.title}</span>
            <span className="text-foreground/70"> — </span>
            {v.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
