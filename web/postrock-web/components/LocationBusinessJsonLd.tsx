import type { LocationEntry } from "@/lib/data/locations";
import { siteConfig } from "@/lib/site-config";

export function LocationBusinessJsonLd({ location }: { location: LocationEntry }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: location.name,
    telephone: location.phone,
    url: `${siteConfig.url}/locations/${location.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.addressLine1,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      description: location.hours,
    },
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
