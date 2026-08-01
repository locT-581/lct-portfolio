"use server";

import { revalidateTag } from "next/cache";
import { sendContactForm } from "@/lib/api/contact";
import { CACHE_TAG_CONTACT } from "@/lib/constants/revalidation";
import type { ContactFormPayload } from "@/types/cms";

export async function submitContactFormAction(
  payload: ContactFormPayload,
): Promise<{ success: boolean; message?: string }> {
  const result = await sendContactForm(payload);
  if (result.success) {
    revalidateTag(CACHE_TAG_CONTACT, "max");
  }
  return result;
}
