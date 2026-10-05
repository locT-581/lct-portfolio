import type { NextRequest } from "next/server";
import { handleResumeRequest } from "./handler";

export async function GET(request: NextRequest) {
  return handleResumeRequest(request);
}
