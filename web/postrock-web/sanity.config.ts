import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { deskStructure } from "./sanity/deskStructure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  title: "Post Rock Ag",
  schema: {
    types: schemaTypes,
  },
  plugins: [structureTool({ structure: deskStructure })],
});
