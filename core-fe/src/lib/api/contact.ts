import { HTTPError } from "ky";
import type { ContactFormPayload } from "@/types/cms";
import { client } from "./_client";

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<{ success: boolean; message?: string }> {
  try {
    return await client
      .post("contact", { json: payload })
      .json<{ success: boolean; message?: string }>();
  } catch (err) {
    if (err instanceof HTTPError) {
      const errorText = await err.response.text().catch(() => err.message);
      throw {
        error: errorText || "Failed to submit contact form",
        status: err.response.status,
      };
    }
    throw {
      error: err instanceof Error ? err.message : "Unknown error",
      status: 500,
    };
  }
}

export const sendContactForm = submitContactForm;
