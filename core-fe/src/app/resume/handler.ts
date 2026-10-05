import { type NextRequest, NextResponse } from "next/server";
import { getResumeBySlug } from "@/lib/api/resume";
import { getProfileIntro } from "@/lib/api/social";

export async function handleResumeRequest(request: NextRequest, slug?: string) {
  // 1. Look up target resume by slug (or get primary if slug is empty)
  let resume = await getResumeBySlug(slug);

  // 2. Fallback to profile.resumeUrl if no specific resume was found
  if (!resume || !resume.url) {
    const profile = await getProfileIntro({ locale: "en" }).catch(() => null);
    if (profile?.resumeUrl) {
      resume = {
        id: "profile-resume",
        slug: "default",
        title: "Resume",
        url: profile.resumeUrl,
        isPrimary: true,
        orderIndex: 0,
      };
    }
  }

  // 3. Not found
  if (!resume || !resume.url) {
    return new NextResponse("Resume not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const targetUrl = resume.url;

  // 4. Build absolute URL if relative
  const absoluteUrl =
    targetUrl.startsWith("http://") || targetUrl.startsWith("https://")
      ? targetUrl
      : new URL(targetUrl, request.url).toString();

  try {
    const upstreamRes = await fetch(absoluteUrl, {
      headers: {
        Accept: "application/pdf,*/*",
      },
      next: { revalidate: 3600 },
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return NextResponse.redirect(absoluteUrl, { status: 307 });
    }

    const upstreamContentType = upstreamRes.headers.get("content-type") || "";

    // If external site returns HTML (e.g. Google Drive preview page), redirect there
    if (
      upstreamContentType.includes("text/html") &&
      !absoluteUrl.endsWith(".pdf")
    ) {
      return NextResponse.redirect(absoluteUrl, { status: 307 });
    }

    const contentType = upstreamContentType.includes("pdf")
      ? "application/pdf"
      : upstreamContentType || "application/pdf";

    const filename = `${resume.slug || slug || "resume"}.pdf`;

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error(`[Resume Route] Stream error for ${absoluteUrl}:`, err);
    return NextResponse.redirect(absoluteUrl, { status: 307 });
  }
}
