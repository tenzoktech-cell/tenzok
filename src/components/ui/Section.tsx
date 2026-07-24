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
  className?: string;
  children: ReactNode;
}

/** Shared vertical rhythm for public sections. */
export function Section({
  id,
  bordered = false,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 overflow-hidden py-24 md:py-32 ${
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
      className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-cool ${className}`.trim()}
    >
      <span aria-hidden className="h-px w-7 bg-gradient-to-r from-cool to-accent" />
      {children}
    </p>
  );
}
