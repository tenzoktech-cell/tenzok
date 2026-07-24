import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";
export type ButtonSize = "md" | "lg";

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#3566dc] via-[#5746d9] to-[#7134c9] text-white shadow-[0_12px_36px_rgba(87,70,217,0.28)] hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(87,70,217,0.38)]",
  secondary:
    "border border-line-strong bg-white/[0.045] text-ink backdrop-blur-sm hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08]",
  // The nav's "Book a Call": solid light on dark. Distinct from the accent, so
  // it never competes with the single primary CTA in the view below it.
  inverse: "bg-ink text-surface shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-white",
  ghost: "text-ink-muted hover:bg-white/[0.05] hover:text-ink",
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
