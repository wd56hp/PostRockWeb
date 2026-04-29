import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicesDivisionTemplate } from "@/components/ServicesDivisionTemplate";
import { getDivisionMerged } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Feed Services",
  description: "Ingredient sourcing and coordination for livestock producers — placeholder division details.",
  path: "/services/feed",
});

export default async function FeedPage() {
  const merged = await getDivisionMerged("feed");
  return <ServicesDivisionTemplate merged={merged} />;
}
