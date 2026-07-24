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
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-44 sm:pb-20">
      <div aria-hidden className="page-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-12rem] h-[32rem] w-[32rem] rounded-full bg-accent/[0.14] blur-[110px]"
      />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-balance mt-6 max-w-5xl text-[clamp(2.6rem,1.9rem+3vw,4.75rem)] leading-[0.98] tracking-[-0.05em] text-ink">
          {title}
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-ink-muted">{copy}</p>
        {children ? <div className="mt-9">{children}</div> : null}
      </Container>
    </section>
  );
}
