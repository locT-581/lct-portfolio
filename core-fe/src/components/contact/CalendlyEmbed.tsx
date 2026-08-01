"use client";

import { useTranslations } from "next-intl";

export interface CalendlyEmbedProps {
  url?: string;
  className?: string;
}

export function CalendlyEmbed({ url, className = "" }: CalendlyEmbedProps) {
  const t = useTranslations("contact");

  if (!url || url.trim() === "") {
    return null;
  }

  return (
    <div
      className={`w-full bg-bg-base-2 border border-stroke rounded-xl p-6 flex flex-col gap-4 ${className}`}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-[20px] font-semibold text-text-primary leading-snug">
          {t("calendlyTitle")}
        </h2>
        <p className="text-body-m text-text-secondary leading-relaxed">
          {t("calendlyDescription")}
        </p>
      </div>

      <div className="w-full overflow-hidden rounded-lg min-h-150 bg-bg-base-1">
        <iframe
          src={url}
          title={t("calendlyTitle")}
          className="w-full h-162.5 border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
