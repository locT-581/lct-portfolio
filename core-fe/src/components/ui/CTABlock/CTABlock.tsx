import Link from "next/link";
import { useTranslations } from "next-intl";
import type { HTMLAttributes, ReactNode } from "react";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Props for the `<CTABlock>` component.
 */
export interface CTABlockProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Main call-to-action title / heading text.
   */
  title?: string;
  /**
   * Optional secondary body description text.
   */
  description?: string;
  /**
   * Action button text.
   */
  buttonText?: string;
  /**
   * Visual style variant of the CTA button.
   * @default "primary"
   */
  buttonVariant?: ButtonVariant;
  /**
   * Optional click handler for the action button.
   */
  onButtonClick?: () => void;
  /**
   * Optional target link URL for the action button. If provided, renders an anchor/Link wrapped button.
   */
  href?: string;
  /**
   * Custom child element override for the CTA action area.
   */
  children?: ReactNode;
  /**
   * Additional CSS class names to extend default styles.
   */
  className?: string;
}

/**
 * `<CTABlock>` component rendering a call-to-action banner.
 *
 * Adheres to design system specifications, uses design tokens (`bg-bg-base-1`, `border-stroke`, `text-text-primary`, `text-text-secondary`),
 * and reuses the `<Button>` component for action triggers.
 */
export function CTABlock({
  title,
  description,
  buttonText,
  buttonVariant = "primary",
  onButtonClick,
  href,
  children,
  className = "",
  ...props
}: CTABlockProps) {
  const t = useTranslations("cta");
  const displayTitle = title ?? t("title");
  const displayDescription = description ?? t("description");
  const displayButtonText = buttonText ?? t("buttonText");

  const renderAction = () => {
    if (children) {
      return children;
    }

    if (href) {
      return (
        <Link href={href} className="inline-block shrink-0">
          <Button variant={buttonVariant} className="h-10 px-5">
            {displayButtonText}
          </Button>
        </Link>
      );
    }

    return (
      <Button
        variant={buttonVariant}
        onClick={onButtonClick}
        className="shrink-0 h-10 px-5"
      >
        {displayButtonText}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between p-6 rounded-xl border border-stroke bg-bg-base-1 w-full",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-1.5 flex-1">
        {displayTitle && (
          <h3 className="text-h5 text-text-primary font-semibold tracking-tight">
            {displayTitle}
          </h3>
        )}
        {displayDescription && (
          <p className="text-body-m-regular text-text-secondary">
            {displayDescription}
          </p>
        )}
      </div>

      <div className="shrink-0">{renderAction()}</div>
    </div>
  );
}
