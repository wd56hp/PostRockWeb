/** Fallback locations when Sanity is unset or returns no `location` documents. Prefer `getLocations()` from `@/lib/sanity/loaders` on server routes. */

export type LocationEntry = {
  slug: string;
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: string;
  services: ("Agronomy" | "Energy" | "Grain" | "Feed")[];
  lat: number;
  lng: number;
  /** Optional rich body for `/locations/[slug]` — populated from Sanity `detailBody`. */
  detailBody?: string;
};

export const fallbackLocations: LocationEntry[] = [
  {
    slug: "hq-central-kansas",
    name: "HQ — Central Kansas",
    addressLine1: "",
    city: "",
    state: "KS",
    zip: "",
    phone: "",
    hours: "Mon–Fri 8:00–17:00",
    services: ["Grain", "Energy"],
    lat: 39.0473,
    lng: -98.1319,
  },
  {
    slug: "location-west",
    name: "West territory office",
    addressLine1: "",
    city: "",
    state: "KS",
    zip: "",
    phone: "",
    hours: "Mon–Fri 8:00–17:00",
    services: ["Agronomy", "Grain"],
    lat: 38.8792,
    lng: -99.3268,
  },
  {
    slug: "location-east",
    name: "East territory office",
    addressLine1: "",
    city: "",
    state: "KS",
    zip: "",
    phone: "",
    hours: "Mon–Sat 7:30–17:30",
    services: ["Grain", "Feed"],
    lat: 39.1135,
    lng: -97.7336,
  },
  {
    slug: "location-south",
    name: "South territory office",
    addressLine1: "",
    city: "",
    state: "KS",
    zip: "",
    phone: "",
    hours: "Mon–Fri 8:00–17:00",
    services: ["Energy", "Agronomy"],
    lat: 38.357,
    lng: -98.764,
  },
];

/** @deprecated Prefer async `getLocations()` — kept for scripts/tests expecting sync access to fallback data. */
export const locations = fallbackLocations;

export function getLocation(slug: string) {
  return fallbackLocations.find((l) => l.slug === slug);
}
