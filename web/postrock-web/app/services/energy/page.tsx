import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicesDivisionTemplate } from "@/components/ServicesDivisionTemplate";
import { getDivisionMerged } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Energy Services",
  description: "Fuel products and scheduling built for agricultural operations — placeholder division details.",
  path: "/services/energy",
});

export default async function EnergyPage() {
  const merged = await getDivisionMerged("energy");
  return <ServicesDivisionTemplate merged={merged} />;
}
