import type { ReactNode } from "react";

/** The one container. Every section uses it, including the footer. */
export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 ${className}`.trim()}>
      {children}
    </div>
  );
}

interface SectionProps {
  id?: string;
  bordered?: boolean;
  /** Tighter vertical rhythm for inner pages. */
  compact?: boolean;
  className?: string;
  children: ReactNode;
}

/** Shared vertical rhythm for public sections. */
export function Section({
  id,
  bordered = false,
  compact = true,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`deferred-section relative scroll-mt-24 overflow-hidden ${compact ? "py-14 md:py-20" : "py-24 md:py-32"} ${
        bordered ? "border-t border-line" : ""
      } ${className}`.trim()}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Compact product-studio label used above section headings. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted ${className}`.trim()}
    >
      <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
      {children}
    </p>
  );
}
