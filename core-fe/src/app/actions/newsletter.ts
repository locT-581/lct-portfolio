"use server";

import { revalidateTag } from "next/cache";
import { subscribeNewsletter } from "@/lib/api/newsletter";
import { CACHE_TAG_NEWSLETTER } from "@/lib/constants/revalidation";
import type { NewsletterSubscribePayload } from "@/types/cms";

export async function subscribeNewsletterAction(
  payload: NewsletterSubscribePayload,
): Promise<{ success: boolean; message?: string }> {
  const result = await subscribeNewsletter(payload);
  if (result.success) {
    revalidateTag(CACHE_TAG_NEWSLETTER, "max");
  }
  return result;
}
