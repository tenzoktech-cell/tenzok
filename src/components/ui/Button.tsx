import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-strong",
  secondary:
    "border border-line-strong bg-surface-raised text-ink hover:bg-surface-overlay",
  ghost: "text-ink-muted hover:text-ink",
};

// min-h-11 keeps every control at a 44px tap target.
const SIZES: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-12 px-7 text-sm sm:text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
}

interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

/** A link that looks like a button. Use for navigation. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
