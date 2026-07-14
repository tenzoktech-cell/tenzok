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
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`.trim()}>
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

/** One vertical rhythm for the whole site: py-24 md:py-32. No exceptions. */
export function Section({
  id,
  bordered = false,
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-24 md:py-32 ${
        bordered ? "border-t border-line" : ""
      } ${className}`.trim()}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Small uppercase label above a heading. Never accent-coloured — see the accent rule. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle ${className}`.trim()}
    >
      <span aria-hidden className="h-px w-6 bg-line-strong" />
      {children}
    </p>
  );
}
