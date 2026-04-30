import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServiceCard } from "@/components/ServiceCard";
import { getServicesOverviewCopy } from "@/lib/sanity/loaders";
import type { DivisionKey } from "@/lib/services-meta";
import { DIVISION_KEYS_ORDERED, divisionRouting } from "@/lib/services-meta";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description: "Grain, feed and supply, marketing, agronomy, and energy divisions serving agricultural producers.",
  path: "/services",
});

export default async function ServicesOverviewPage() {
  const overview = await getServicesOverviewCopy();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Services overview</p>
      <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">Five divisions — one operating mindset</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
        Overview blurbs publish from Sanity (`servicesOverviewCopy`) — fallback copy ships when the CMS is unset.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {DIVISION_KEYS_ORDERED.map((key: DivisionKey) => (
          <ServiceCard
            key={key}
            title={divisionRouting[key].title}
            description={overview[key]}
            href={`/services/${key}`}
          />
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-border bg-muted p-8">
        <h2 className="font-heading text-2xl font-semibold text-primary">Need routing?</h2>
        <p className="mt-3 text-foreground/85">
          Start at{" "}
          <Link href="/contact" className="font-semibold text-secondary underline">
            contact
          </Link>{" "}
          — choose the topic that matches your request so we can respond quickly.
        </p>
      </div>
    </div>
  );
}
