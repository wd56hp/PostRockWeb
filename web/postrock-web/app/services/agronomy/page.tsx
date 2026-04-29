import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicesDivisionTemplate } from "@/components/ServicesDivisionTemplate";
import { getDivisionMerged } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Agronomy Services",
  description: "Crop nutrition, protection, seed recommendations, and field execution — placeholder division details.",
  path: "/services/agronomy",
});

export default async function AgronomyPage() {
  const merged = await getDivisionMerged("agronomy");
  return <ServicesDivisionTemplate merged={merged} />;
}
