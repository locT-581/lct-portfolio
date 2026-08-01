import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Variant options for the Button component.
 * - `primary`: Main call-to-action with brand orange background.
 * - `secondary`: Alternative action with neutral background and subtle border.
 * - `ghost`: Low-emphasis action with transparent background.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Props for the Button component.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Button content.
   */
  children?: ReactNode;
  /**
   * Additional CSS class names to extend or override default styles.
   */
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-orange text-text-btn-primary hover:opacity-90",
  secondary:
    "bg-bg-base-2 text-text-primary border border-stroke hover:bg-bg-base-3",
  ghost: "bg-transparent text-text-primary hover:bg-bg-base-2",
};

import { cn } from "@/lib/utils";

/**
 * `<Button>` component adhering to the design system tokens.
 *
 * Supports `primary`, `secondary`, and `ghost` variants with full token-driven styling
 * and standard `<button>` HTML attributes.
 */
export function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center text-btn rounded transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange disabled:pointer-events-none disabled:opacity-50";

  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
