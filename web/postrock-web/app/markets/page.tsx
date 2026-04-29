import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getMarketsPageCopy } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Markets",
  description: "Cash bids, spreads, fuel prices, and external market widgets — integrations pending.",
  path: "/markets",
});

function EmbedRegion({ title, code }: { title: string; code: string }) {
  const c = code.trim();
  const looksLikeHtmlFragment = c.includes("<") && !c.startsWith("<!--");
  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-primary">{title}</h2>
      {looksLikeHtmlFragment ? (
        <div className="markets-embed mt-4 text-sm leading-relaxed [&_iframe]:max-w-full" dangerouslySetInnerHTML={{ __html: c }} />
      ) : (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-background p-4 text-xs text-foreground/80">{c}</pre>
      )}
    </div>
  );
}

export default async function MarketsPage() {
  const copy = await getMarketsPageCopy();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Markets</p>
      <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">Market data workspace</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
        Paste vendor-approved embed snippets into Sanity (`marketsPageCopy`) — HTML renders below; plain comments stay in a monospace block.
      </p>

      <section className="mt-12 space-y-10 rounded-xl border border-border bg-muted p-8">
        <EmbedRegion title="Embed region A (DTN / Barchart / Bushel)" code={copy.dtnEmbedCode} />
        <EmbedRegion title="Fuel price widget" code={copy.fuelPriceEmbedCode} />
      </section>
    </div>
  );
}
