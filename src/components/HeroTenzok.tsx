import {
  ArrowRight,
  Braces,
  CheckCircle2,
  Cloud,
  Cpu,
  Layers3,
  Smartphone,
  Sparkles,
} from "lucide-react";
import StartJourneyButton from "./StartJourneyModal";
import TenzokNav from "./TenzokNav";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Section";

const CAPABILITIES = [
  { icon: Braces, label: "Web apps" },
  { icon: Smartphone, label: "Mobile" },
  { icon: Cpu, label: "AI systems" },
  { icon: Cloud, label: "Cloud" },
];

export default function HeroTenzok() {
  return (
    <>
      <TenzokNav />

      <section className="relative overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-20 lg:pt-30">
        <HeroBackdrop />

        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
            <div className="max-w-3xl">
              <p
                className="fade-up inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-cool"
                style={{ animationDelay: "0.05s" }}
              >
                <Sparkles size={14} />
                Product engineering studio
              </p>

              <h1
                className="font-hero text-balance fade-up mt-6 text-[clamp(2.6rem,1.9rem+3vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink"
                style={{ animationDelay: "0.14s" }}
              >
                Build software.
                <br />
                Launch ideas.
                <br />
                <span className="gradient-text">Ship with confidence.</span>
              </h1>

              <p
                className="fade-up mt-5 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base sm:leading-7"
                style={{ animationDelay: "0.22s" }}
              >
                Tenzok designs and engineers websites, web apps, mobile products,
                AI solutions, and production-minded student projects—from first scope
                to launch and complete handover.
              </p>

              <div
                className="fade-up mt-7 flex flex-col gap-3 sm:flex-row"
                style={{ animationDelay: "0.3s" }}
              >
                <StartJourneyButton label="Start Your Project" size="lg" />
                <ButtonLink href="/services" variant="secondary" size="lg">
                  Explore services
                  <ArrowRight size={16} />
                </ButtonLink>
              </div>

              <div
                className="fade-up mt-6 flex flex-wrap gap-2"
                style={{ animationDelay: "0.38s" }}
                aria-label="Core capabilities"
              >
                {CAPABILITIES.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.035] px-3 py-2 text-xs text-ink-muted"
                  >
                    <Icon size={13} className="text-cool" />
                    {label}
                  </span>
                ))}
              </div>

              <p
                className="fade-up mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-subtle"
                style={{ animationDelay: "0.44s" }}
              >
                Obsession <span className="px-2 text-accent">·</span> Purpose{" "}
                <span className="px-2 text-cool">·</span> Excellence
              </p>
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
    <div className="gradient-border premium-card relative overflow-hidden rounded-[1.75rem] p-2.5 sm:p-3">
      <div className="rounded-[1.3rem] border border-white/10 bg-[#0b0d14]/95 p-5 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b7a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#55d6a7]" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            Delivery system
          </span>
        </div>

        <div className="py-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-cool/10 px-3 py-1.5 text-xs font-medium text-cool">
            <span className="h-1.5 w-1.5 rounded-full bg-cool" />
            Build in progress
          </span>
          <h2 className="mt-4 max-w-sm text-xl leading-tight text-ink sm:text-2xl">
            From product brief to a system ready to scale.
          </h2>
          <p className="mt-3 max-w-md text-xs leading-5 text-ink-muted sm:text-sm">
            Strategy, interface, engineering, QA, deployment, and knowledge transfer
            in one visible workflow.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { step: "01", title: "Scope", copy: "Goals aligned", active: true },
            { step: "02", title: "Build", copy: "Weekly demos", active: true },
            { step: "03", title: "Launch", copy: "Full handover", active: false },
          ].map((item) => (
            <div
              key={item.step}
              className={`rounded-2xl border p-3 ${
                item.active
                  ? "border-accent/30 bg-accent/[0.08]"
                  : "border-line bg-white/[0.025]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-subtle">{item.step}</span>
                {item.active && <CheckCircle2 size={14} className="text-cool" />}
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-xs text-ink-subtle">{item.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-white/[0.025] p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cool/25 to-accent/25">
              <Layers3 size={18} className="text-ink" />
            </span>
            <div>
              <p className="text-sm font-medium text-ink">Transparent by default</p>
              <p className="mt-0.5 text-xs text-ink-subtle">
                Source, decisions, and progress stay visible
              </p>
            </div>
          </div>
          <span className="hidden h-2 w-2 rounded-full bg-[#55d6a7] shadow-[0_0_18px_#55d6a7] sm:block" />
        </div>
      </div>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="page-grid absolute inset-x-0 top-0 h-[52rem] opacity-70" />
      <div className="absolute -left-40 top-10 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute -right-52 top-24 h-[38rem] w-[38rem] rounded-full bg-cool/10 blur-[140px]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-surface" />
    </div>
  );
}
