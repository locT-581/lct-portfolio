"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { submitContactFormAction } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ContactFormProps {
  locale: string;
  className?: string;
}

type TranslationKey =
  | "invalidFieldsError"
  | "rateLimitError"
  | "genericError"
  | "invalidEmailError"
  | "requiredFieldError";

export function ContactForm({ locale, className = "" }: ContactFormProps) {
  const t = useTranslations("contact");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    submitContactFormAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className={cn("flex flex-col gap-4 w-full max-w-[480px]", className)}
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot field for bot protection (AC #5, #6, #7) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Inline Feedback Alerts (AC #12, #14, #15) */}
      {state?.success && (
        <output className="block p-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-body-m font-medium dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
          {t("successMessage")}
        </output>
      )}

      {state?.error && !state.success && (
        <div
          role="alert"
          className="p-4 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-body-m font-medium dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
        >
          {t(state.error as TranslationKey)}
        </div>
      )}

      {/* Name Field */}
      <div className="flex flex-col gap-2.5 w-full">
        <label
          htmlFor="name"
          className="text-body-m-medium text-text-primary font-medium"
        >
          {t("nameLabel")} <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder={t("namePlaceholder")}
          className={cn(
            "w-full px-3 py-2 rounded-[10px] border border-stroke bg-bg-base-1 text-text-primary placeholder:text-text-secondary text-body-m transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange",
            state?.fieldErrors?.name &&
              "border-rose-500 focus-visible:outline-rose-500",
          )}
        />
        {state?.fieldErrors?.name && (
          <span className="text-caption text-rose-500">
            {t(state.fieldErrors.name as TranslationKey)}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-2.5 w-full">
        <label
          htmlFor="email"
          className="text-body-m-medium text-text-primary font-medium"
        >
          {t("emailLabel")} <span className="text-rose-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder={t("emailPlaceholder")}
          className={cn(
            "w-full px-3 py-2 rounded-[10px] border border-stroke bg-bg-base-1 text-text-primary placeholder:text-text-secondary text-body-m transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange",
            state?.fieldErrors?.email &&
              "border-rose-500 focus-visible:outline-rose-500",
          )}
        />
        {state?.fieldErrors?.email && (
          <span className="text-caption text-rose-500">
            {t(state.fieldErrors.email as TranslationKey)}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className="flex flex-col gap-2.5 w-full">
        <label
          htmlFor="message"
          className="text-body-m-medium text-text-primary font-medium"
        >
          {t("messageLabel")} <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={t("messagePlaceholder")}
          className={cn(
            "w-full px-3 py-2 min-h-[120px] rounded-[10px] border border-stroke bg-bg-base-1 text-text-primary placeholder:text-text-secondary text-body-m transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange resize-y",
            state?.fieldErrors?.message &&
              "border-rose-500 focus-visible:outline-rose-500",
          )}
        />
        {state?.fieldErrors?.message && (
          <span className="text-caption text-rose-500">
            {t(state.fieldErrors.message as TranslationKey)}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          className="w-full sm:w-auto min-w-[140px]"
        >
          {isPending ? t("submitting") : t("submitButton")}
        </Button>
      </div>
    </form>
  );
}
