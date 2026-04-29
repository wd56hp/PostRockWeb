import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { ServicesDivisionTemplate } from "@/components/ServicesDivisionTemplate";
import { getDivisionMerged } from "@/lib/sanity/loaders";

export const metadata: Metadata = buildMetadata({
  title: "Grain Services",
  description: "Origination, logistics, and grain marketing — placeholder division details.",
  path: "/services/grain",
});

export default async function GrainPage() {
  const merged = await getDivisionMerged("grain");
  return <ServicesDivisionTemplate merged={merged} />;
}
