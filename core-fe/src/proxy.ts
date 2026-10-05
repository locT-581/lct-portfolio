import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  // Strip port if present (e.g. fullstack.localhost:3000 -> fullstack.localhost)
  const hostname = host.split(":")[0];

  // Match root domain (production loct.site or dev localhost)
  const rootDomains = ["loct.site", "localhost"];
  const matchedDomain = rootDomains.find(
    (d) => hostname === d || hostname.endsWith(`.${d}`),
  );

  if (matchedDomain && hostname !== matchedDomain) {
    // Extract subdomain: e.g. "fullstack.loct.site" -> "fullstack"
    const subdomain = hostname
      .replace(`.${matchedDomain}`, "")
      .trim()
      .toLowerCase();

    // Ignore www
    if (subdomain && subdomain !== "www") {
      // Subdomain detected (e.g. "fullstack", "architect", "cv")
      // If subdomain is "cv", map to primary /resume
      const targetSlug = subdomain === "cv" ? "" : subdomain;
      return NextResponse.rewrite(
        new URL(`/resume/${targetSlug}`, request.url),
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(vi|en)/:path*",
    "/((?!api|resume|_next|_vercel|.*\\..*).*)",
  ],
};
