import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "@/sanity/env";

const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

/** Sanity image asset → HTTPS URL for `next/image`, or null if unset / Sanity not configured. */
export function sanityImageUrl(
  source: SanityImageSource | null | undefined,
  opts?: { width?: number; height?: number },
): string | null {
  if (!builder || !source) return null;
  let img = builder.image(source).auto("format").fit("max");
  if (opts?.width) img = img.width(opts.width);
  if (opts?.height) img = img.height(opts.height);
  return img.url() ?? null;
}
