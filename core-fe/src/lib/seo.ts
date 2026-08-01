import type { Metadata } from "next";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://loct.dev";
  return url.replace(/\/+$/, "");
}

export function constructUrl(locale: string, path: string = ""): string {
  const siteUrl = getSiteUrl();
  const cleanPath = path.replace(/^\/+|\/+$/g, "");
  return cleanPath ? `${siteUrl}/${locale}/${cleanPath}` : `${siteUrl}/${locale}`;
}

export interface ConstructMetadataOptions {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
  openGraph?: Metadata["openGraph"];
}

export function constructMetadata({
  locale,
  path = "",
  title,
  description,
  openGraph,
}: ConstructMetadataOptions): Metadata {
  const canonicalUrl = constructUrl(locale, path);
  const enUrl = constructUrl("en", path);
  const viUrl = constructUrl("vi", path);

  const ogImages = openGraph?.images;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: enUrl,
        vi: viUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      url: canonicalUrl,
      ...(ogImages ? { images: ogImages } : {}),
      ...openGraph,
    },
  };
}
