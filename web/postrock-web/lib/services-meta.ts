export type DivisionKey = "grain" | "feed" | "marketing" | "agronomy" | "energy";

/** Canonical order for service cards and navigation. */
export const DIVISION_KEYS_ORDERED: DivisionKey[] = ["grain", "feed", "marketing", "agronomy", "energy"];

/** Routing-only metadata per division — marketing copy comes from Sanity via `getDivisionMerged()`. */
export const divisionRouting: Record<DivisionKey, { title: string; topicQuery: string }> = {
  grain: { title: "Grain", topicQuery: "grain" },
  feed: { title: "Feed and Supply", topicQuery: "feed" },
  marketing: { title: "Marketing", topicQuery: "marketing" },
  agronomy: { title: "Agronomy", topicQuery: "agronomy" },
  energy: { title: "Energy", topicQuery: "energy" },
};
