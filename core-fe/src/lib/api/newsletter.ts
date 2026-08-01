import { HTTPError } from "ky";
import type { NewsletterSubscribePayload } from "@/types/cms";
import { client } from "./_client";

export async function subscribeNewsletter(
  payload: NewsletterSubscribePayload,
): Promise<{ success: boolean; message?: string }> {
  try {
    return await client
      .post("newsletter", { json: payload })
      .json<{ success: boolean; message?: string }>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to subscribe to newsletter",
        status: err.response.status,
      };
    }
    throw { error: err instanceof Error ? err.message : "Unknown error", status: 500 };
  }
}
