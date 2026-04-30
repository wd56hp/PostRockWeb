import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicesDivisionTemplate } from "@/components/ServicesDivisionTemplate";
import { getDivisionMerged } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Marketing Services",
  description: "Grain and ingredient marketing, bids, and logistics coordination — placeholder division details.",
  path: "/services/marketing",
});

export default async function MarketingPage() {
  const merged = await getDivisionMerged("marketing");
  return <ServicesDivisionTemplate merged={merged} />;
}
