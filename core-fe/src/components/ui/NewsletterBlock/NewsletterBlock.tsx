"use client";

import { useTranslations } from "next-intl";
import { type FormEvent, type HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Props for the `<NewsletterBlock>` component.
 */
export interface NewsletterBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /**
   * Section heading title.
   */
  title?: string;
  /**
   * Description or helper text explaining the newsletter value.
   */
  description?: string;
  /**
   * Placeholder text for the email input.
   */
  placeholder?: string;
  /**
   * Button submit label.
   */
  buttonText?: string;
  /**
   * Optional async submit callback for CMS or API integration.
   */
  onSubmit?: (email: string) => Promise<void>;
  /**
   * Additional CSS class names to extend default styles.
   */
  className?: string;
}

/**
 * `<NewsletterBlock>` component rendering a newsletter subscription card with input & CTA.
 *
 * Adheres to design system specifications, uses design tokens (`bg-bg-base-1`, `border-stroke`, `text-text-primary`, `text-text-secondary`),
 * reuses `<Button>`, and handles async submit state (loading, success, error).
 */
export function NewsletterBlock({
  title,
  description,
  placeholder,
  buttonText,
  onSubmit,
  className = "",
  ...props
}: NewsletterBlockProps) {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const displayTitle = title ?? t("title");
  const displayDescription = description ?? t("description");
  const displayPlaceholder = placeholder ?? t("placeholder");
  const displayButtonText = buttonText ?? t("buttonText");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMessage(t("invalidEmailError"));
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Fallback simulation if no onSubmit provided
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setStatus("success");
      setEmail("");
    } catch (_error) {
      setStatus("error");
      setErrorMessage(t("genericError"));
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-6 rounded-xl border border-stroke bg-bg-base-1 w-full max-w-2xl",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-body-m-medium text-text-primary font-semibold">
          {displayTitle}
        </h3>
        {displayDescription && (
          <p className="text-body-m-regular text-text-secondary">
            {displayDescription}
          </p>
        )}
      </div>

      {status === "success" ? (
        <output className="block p-3 rounded-lg bg-bg-base-2 text-text-primary text-body-s-medium border border-stroke text-center">
          {t("successMessage")}
        </output>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2.5 items-center w-full"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={displayPlaceholder}
            disabled={status === "loading"}
            required
            aria-label="Email address"
            className="flex-1 px-3 py-2 rounded-lg border border-stroke bg-bg-base-1 text-text-primary text-body-m-regular placeholder:text-text-secondary focus:outline-2 focus:outline-brand-orange disabled:opacity-50"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={status === "loading"}
            className="shrink-0 h-10 px-5"
          >
            {status === "loading" ? t("subscribing") : displayButtonText}
          </Button>
        </form>
      )}

      {status === "error" && errorMessage && (
        <p role="alert" className="text-body-s-regular text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
