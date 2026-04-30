import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { LocationCard } from "@/components/LocationCard";
import { LocationsMap } from "@/components/LocationsMap";
import { LocationsJsonLd } from "@/components/LocationsJsonLd";
import { getLocations } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Locations",
  description: "Post Rock Ag locations — addresses, hours, and services offered at each facility.",
  path: "/locations",
});

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
      <LocationsJsonLd locations={locations} />
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">Locations</p>
      <h1 className="font-heading mt-3 text-4xl font-bold text-primary lg:text-5xl">Where we operate</h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-foreground/85">
       
      </p>

      <div className="mt-10">
        <LocationsMap title="All locations" />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {locations.map((loc) => (
          <LocationCard key={loc.slug} location={loc} />
        ))}
      </div>
    </div>
  );
}
