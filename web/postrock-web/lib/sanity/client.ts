import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export function sanityConfigured(): boolean {
  return Boolean(projectId?.trim());
}

function createReadClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === "production",
  });
}

let cached: ReturnType<typeof createReadClient> | null | undefined;

export function getSanityReadClient() {
  if (!sanityConfigured()) return null;
  if (!cached) cached = createReadClient();
  return cached;
}

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  const client = getSanityReadClient();
  if (!client) return null;
  try {
    return await client.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
}
