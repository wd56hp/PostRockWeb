import type { StructureResolver } from "sanity/structure";

const HIDDEN_FROM_DEFAULT_LIST = new Set(["service", "divisionCopy"]);

/** Desk: explicit “Service divisions” list plus default document types (minus duplicates). */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Service divisions")
        .id("service-divisions")
        .child(
          S.documentTypeList("service")
            .title("Service divisions")
            .defaultOrdering([{ field: "divisionKey", direction: "asc" }]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId?.();
        return typeof id === "string" && !HIDDEN_FROM_DEFAULT_LIST.has(id);
      }),
      S.divider(),
      S.listItem()
        .title("Legacy: Division copy (fallback)")
        .id("legacy-division-copy")
        .child(S.documentTypeList("divisionCopy").title("Division copy")),
    ]);
