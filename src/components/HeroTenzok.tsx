import {
  ArrowRight,
  CheckCircle2,
  Layers3,
} from "lucide-react";
import StartJourneyButton from "./StartJourneyModal";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Section";

export default function HeroTenzok() {
  return (
    <>

      <section className="relative overflow-hidden pt-28 pb-12 sm:pt-32 sm:pb-16">
        <HeroBackdrop />

        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
            <div className="max-w-3xl">
              <p
                className="fade-up inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted"
                style={{ animationDelay: "0.05s" }}
              >
                <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
                Product engineering studio
              </p>

              <h1
                className="font-hero text-balance fade-up mt-5 text-[clamp(2.25rem,1.7rem+2.2vw,3.5rem)] font-normal leading-[0.98] tracking-[-0.035em] text-ink"
                style={{ animationDelay: "0.14s" }}
              >
                Build software.
                <br />
                Launch ideas.
                <br />
                <span className="gradient-text">Ship with confidence.</span>
              </h1>

              <p
                className="fade-up mt-5 max-w-xl text-base leading-7 text-ink-muted"
                style={{ animationDelay: "0.22s" }}
              >
                Tenzok designs and engineers websites, web apps, mobile products,
                AI solutions, and production-minded student projects—from first scope
                to launch and complete handover.
              </p>

              <div
                className="fade-up mt-6 flex flex-col gap-3 sm:flex-row"
                style={{ animationDelay: "0.3s" }}
              >
                <StartJourneyButton label="Start Your Project" size="lg" />
                <ButtonLink href="/services" variant="secondary" size="lg">
                  Explore services
                  <ArrowRight size={16} />
                </ButtonLink>
              </div>
            </div>

            <div
              className="fade-up relative mx-auto w-full max-w-lg lg:mx-0"
              style={{ animationDelay: "0.28s" }}
            >
              <ProductVisual />
            </div>
          </div>

        </Container>
      </section>
    </>
  );
}

function ProductVisual() {
  return (
    <div className="relative border border-ink bg-surface-raised">
      <div className="flex items-center justify-between border-b border-ink px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
          Delivery system
        </span>
        <span className="font-mono text-[11px] text-ink-subtle">No. 01</span>
      </div>

      <div className="px-5 py-5">
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-cool">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cool" />
          Build in progress
        </span>
        <h2 className="mt-3 max-w-sm text-xl leading-[1.15] text-ink sm:text-2xl">
          From product brief to a system ready to scale.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
          Strategy, interface, engineering, QA, deployment, and knowledge transfer
          in one visible workflow.
        </p>
      </div>

      <ol className="grid border-t border-ink sm:grid-cols-3">
        {[
          { step: "01", title: "Scope", copy: "Goals aligned", active: true },
          { step: "02", title: "Build", copy: "Weekly demos", active: true },
          { step: "03", title: "Launch", copy: "Full handover", active: false },
        ].map((item) => (
          <li
            key={item.step}
            className="border-b border-line p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-ink-subtle">{item.step}</span>
              {item.active ? (
                <CheckCircle2 size={14} className="text-accent" />
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border border-line-strong" />
              )}
            </div>
            <p className="mt-4 font-display text-lg text-ink">{item.title}</p>
            <p className="mt-0.5 text-xs text-ink-subtle">{item.copy}</p>
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-3 border-t border-ink bg-ink px-5 py-4 text-surface">
        <Layers3 size={18} className="shrink-0 text-accent" />
        <div>
          <p className="text-sm font-medium">Transparent by default</p>
          <p className="mt-0.5 text-xs text-surface/60">
            Source, decisions, and progress stay visible
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="page-grid absolute inset-x-0 top-0 h-[40rem] opacity-60" />
    </div>
  );
}
