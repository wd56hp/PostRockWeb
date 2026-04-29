import type { LocationEntry } from "@/lib/data/locations";

export function LocationsJsonLd({ locations }: { locations: LocationEntry[] }) {
  const graph = locations.map((loc) => ({
    "@type": "LocalBusiness",
    name: loc.name,
    telephone: loc.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.addressLine1,
      addressLocality: loc.city,
      addressRegion: loc.state,
      postalCode: loc.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      description: loc.hours,
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://postrockag.com"}/locations/${loc.slug}`,
  }));

  const data = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
