import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Section";

export default function PageHero({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  copy: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div aria-hidden className="page-grid pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative pb-10 sm:pb-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-balance mt-5 max-w-4xl text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] leading-[1.02] tracking-[-0.03em] text-ink">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted">{copy}</p>
        {children ? <div className="mt-7">{children}</div> : null}
      </Container>
    </section>
  );
}
