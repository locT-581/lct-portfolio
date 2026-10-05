import type { NextRequest } from "next/server";
import { handleResumeRequest } from "../handler";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  return handleResumeRequest(request, slug);
}
