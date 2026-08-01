"use server";

import { headers } from "next/headers";
import { submitContactForm } from "@/lib/api/contact";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export interface ContactFormState {
  success: boolean;
  message?: string;
  error?: string;
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactFormAction(
  _prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const message = (formData.get("message") as string)?.trim() ?? "";
  const locale = (formData.get("locale") as string)?.trim() || "en";
  const honeypot =
    (formData.get("website") as string) ||
    (formData.get("hp_field") as string) ||
    "";

  // Honeypot Protection (AC #5, #6, #7):
  // If honeypot is populated, silently return success without calling API or saving data.
  if (honeypot.trim().length > 0) {
    return {
      success: true,
      message: "successMessage",
    };
  }

  // Field validation (AC #8, #9, #14)
  const fieldErrors: ContactFormState["fieldErrors"] = {};

  if (!name || name.length < 2) {
    fieldErrors.name = "requiredFieldError";
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    fieldErrors.email = "invalidEmailError";
  }

  if (!message || message.length < 5) {
    fieldErrors.message = "requiredFieldError";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      error: "invalidFieldsError",
      fieldErrors,
    };
  }

  // Rate Limiting (AC #10)
  try {
    const headersList = await headers();
    const ip = getClientIp(headersList);
    const rateLimit = checkRateLimit(ip, 5, 600000);

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "rateLimitError",
      };
    }
  } catch (_e) {
    // If headers() is unavailable in static/test environment, continue gracefully
  }

  // Submit via Em-dash API client adapter (AC #11)
  try {
    const res = await submitContactForm({
      name,
      email,
      message,
      locale,
    });

    return {
      success: true,
      message: res.message || "successMessage",
    };
  } catch (err: unknown) {
    const errorMessage =
      typeof err === "object" && err !== null && "error" in err
        ? String((err as { error: string }).error)
        : "genericError";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
