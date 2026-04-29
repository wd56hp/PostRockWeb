import type { Metadata } from "next";
import { brandImages } from "@/lib/brand-assets";
import { siteConfig } from "@/lib/site-config";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
};

export function buildMetadata({
  title,
  description,
  path = "",
  ogImage = brandImages.postRockLogoSquare,
}: MetaInput): Metadata {
  const canonical = `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
