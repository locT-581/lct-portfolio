import { type NextRequest, NextResponse } from "next/server";

export interface LinkMetadata {
  title: string;
  description: string;
  image: string | null;
  siteName: string;
  hostname: string;
  url: string;
}

const memoryCache = new Map<
  string,
  { data: LinkMetadata; timestamp: number }
>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ");
}

function extractMeta(html: string, targetUrl: string): LinkMetadata {
  const getMetaContent = (propNames: string[]) => {
    for (const name of propNames) {
      // name="xxx" content="yyy"
      const regex1 = new RegExp(
        `<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']*)["']`,
        "i",
      );
      const match1 = html.match(regex1);
      if (match1?.[1]) return decodeHtmlEntities(match1[1]);

      // content="yyy" name="xxx"
      const regex2 = new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${name}["']`,
        "i",
      );
      const match2 = html.match(regex2);
      if (match2?.[1]) return decodeHtmlEntities(match2[1]);
    }
    return null;
  };

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title =
    getMetaContent(["og:title", "twitter:title"]) ||
    (titleMatch?.[1] ? decodeHtmlEntities(titleMatch[1]) : "") ||
    "";

  const description =
    getMetaContent(["og:description", "description", "twitter:description"]) ||
    "";

  let image =
    getMetaContent(["og:image", "twitter:image", "image", "thumbnail"]) || "";

  const siteName = getMetaContent(["og:site_name", "application-name"]) || "";

  const parsedUrl = new URL(targetUrl);
  const hostname = parsedUrl.hostname.replace(/^www\./, "");

  if (image && !image.startsWith("http")) {
    try {
      image = new URL(image, targetUrl).toString();
    } catch {
      image = "";
    }
  }

  return {
    title: title.trim() || hostname,
    description: description.trim(),
    image: image.trim() || null,
    siteName: siteName.trim() || hostname,
    hostname,
    url: targetUrl,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 },
    );
  }

  let validUrl: URL;
  try {
    validUrl = new URL(targetUrl);
    if (!["http:", "https:"].includes(validUrl.protocol)) {
      return NextResponse.json(
        { error: "Invalid URL protocol. Only http/https supported." },
        { status: 400 },
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  const cached = memoryCache.get(targetUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Twitterbot/1.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
      },
      signal: controller.signal,
      next: { revalidate: 86400 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const hostname = validUrl.hostname.replace(/^www\./, "");
      const fallbackData: LinkMetadata = {
        title: hostname,
        description: "",
        image: null,
        siteName: hostname,
        hostname,
        url: targetUrl,
      };
      return NextResponse.json(fallbackData);
    }

    const html = await response.text();
    const metadata = extractMeta(html, targetUrl);

    memoryCache.set(targetUrl, { data: metadata, timestamp: Date.now() });

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch {
    // Return gracefully with fallback metadata based on hostname
    const hostname = validUrl.hostname.replace(/^www\./, "");
    const fallbackData: LinkMetadata = {
      title: hostname,
      description: "",
      image: null,
      siteName: hostname,
      hostname,
      url: targetUrl,
    };
    return NextResponse.json(fallbackData);
  }
}
