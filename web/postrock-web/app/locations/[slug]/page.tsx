import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { LOCATION_DETAIL_FALLBACK, getLocationBySlug, getLocations } from "@/lib/sanity/loaders";
import { LocationBusinessJsonLd } from "@/components/LocationBusinessJsonLd";
import { LocationCard } from "@/components/LocationCard";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const locs = await getLocations();
  return locs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = await getLocationBySlug(slug);
  if (!loc) return {};
  return buildMetadata({
    title: loc.name,
    description: `Hours, phone, and services — ${loc.city}, ${loc.state}.`,
    path: `/locations/${slug}`,
  });
}

export default async function LocationDetailPage({ params }: Props) {
  const { slug } = await params;
  const loc = await getLocationBySlug(slug);
  if (!loc) notFound();

  const detail = loc.detailBody?.trim() ? loc.detailBody : LOCATION_DETAIL_FALLBACK;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8 lg:py-20">
      <LocationBusinessJsonLd location={loc} />
      <nav aria-label="Breadcrumb" className="text-sm text-foreground/70">
        <Link href="/locations" className="hover:text-primary hover:underline">
          Locations
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{loc.name}</span>
      </nav>

      <div className="mt-8">
        <LocationCard location={loc} />
      </div>

      <section className="mt-12 rounded-xl border border-dashed border-border bg-muted p-8">
        <h2 className="font-heading text-xl font-semibold text-primary">On-site details</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/85">{detail}</p>
      </section>

      <div className="mt-10 flex gap-4">
        <Button asChild>
          <Link href={`/contact?topic=General`}>Contact this location</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/locations">All locations</Link>
        </Button>
      </div>
    </div>
  );
}
