export type DivisionKey = "agronomy" | "energy" | "grain" | "feed";

/** Routing-only metadata per division — marketing copy comes from Sanity via `getDivisionMerged()`. */
export const divisionRouting: Record<DivisionKey, { title: string; topicQuery: string }> = {
  agronomy: { title: "Agronomy", topicQuery: "agronomy" },
  energy: { title: "Energy", topicQuery: "energy" },
  grain: { title: "Grain", topicQuery: "grain" },
  feed: { title: "Feed", topicQuery: "feed" },
};
