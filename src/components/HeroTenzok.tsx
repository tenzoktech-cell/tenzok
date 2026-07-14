import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import StartJourneyButton from "./StartJourneyModal";
import TenzokNav from "./TenzokNav";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Section";
import { DOMAINS, TOTAL_PROJECTS } from "./projects-data";

const PROOF = [
  `${TOTAL_PROJECTS} project briefs`,
  `${DOMAINS.length} engineering domains`,
  "Deployed, documented, defensible",
];

/**
 * The hero is a normal flow column inside a full-height section: the page
 * scrolls, the hero doesn't grow. Nothing here is absolutely positioned, so
 * the blocks cannot collide at any width.
 */
export default function HeroTenzok() {
  return (
    <>
      <TenzokNav />

      <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pt-28 pb-20">
        <HeroBackdrop />

        <Container className="relative">
          <div className="flex max-w-3xl flex-col items-start">
            <p
              className="fade-up font-display text-base italic text-ink-muted"
              style={{ animationDelay: "0.05s" }}
            >
              Obsession. Purpose. Excellence.
            </p>

            <h1
              className="fade-up mt-6 text-[clamp(2.25rem,1.5rem+3.2vw,4.5rem)] leading-[1.05] text-ink"
              style={{ animationDelay: "0.15s" }}
            >
              We turn projects into careers.
            </h1>

            <p
              className="fade-up mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
              style={{ animationDelay: "0.25s" }}
            >
              Tenzok is an engineering studio that builds real systems — with
              students, and for companies. Full-stack, AI and machine learning, data,
              cloud, robotics, VLSI and power electronics. Scoped in writing, built in
              the open, handed over with nothing hidden.
            </p>

            <div
              className="fade-up mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "0.35s" }}
            >
              <StartJourneyButton size="lg" />
              <ButtonLink href="/projects" variant="secondary" size="lg">
                Browse {TOTAL_PROJECTS} project briefs
                <ArrowRight size={16} />
              </ButtonLink>
            </div>

            <ul
              className="fade-up mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-subtle"
              style={{ animationDelay: "0.45s" }}
            >
              {PROOF.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Two buyers, two doors. Everything else on the site forks from here. */}
          <div
            className="fade-up mt-16 grid gap-4 sm:grid-cols-2 lg:max-w-4xl"
            style={{ animationDelay: "0.55s" }}
          >
            <AudienceCard
              href="/projects"
              icon={GraduationCap}
              title="I'm a student"
              copy="Mini and major projects, built with you and defended by you — plus mentorship that ends in a job, not a certificate."
            />
            <AudienceCard
              href="/services/company-services"
              icon={Building2}
              title="I'm a company"
              copy="Senior delivery without the agency drag. NDA first, a named lead, weekly demos, and full handover of source and docs."
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function AudienceCard({
  href,
  icon: Icon,
  title,
  copy,
}: {
  href: string;
  icon: typeof GraduationCap;
  title: string;
  copy: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-line bg-surface-raised/70 p-5 backdrop-blur-sm transition-colors hover:border-line-strong hover:bg-surface-overlay"
    >
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-overlay">
        <Icon size={18} className="text-ink-muted transition-colors group-hover:text-accent" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-base font-medium text-ink">
          {title}
          <ArrowRight
            size={15}
            className="text-ink-subtle transition-transform group-hover:translate-x-1"
          />
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{copy}</span>
      </span>
    </a>
  );
}

/**
 * CSS-only backdrop. Replaces two hot-linked AI images from a third-party CDN
 * (~270KB, invisible to the preload scanner, and not ours to depend on).
 */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Engineering grid */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff0f 1px, transparent 1px), linear-gradient(to bottom, #ffffff0f 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%)",
        }}
      />
      {/* Warm key light, upper left — where the headline sits */}
      <div
        className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 22%, transparent) 0%, transparent 65%)",
        }}
      />
      {/* Cool fill, lower right — keeps the frame from reading as one flat orange wash */}
      <div
        className="absolute -bottom-52 -right-32 h-[620px] w-[620px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-cool) 18%, transparent) 0%, transparent 65%)",
        }}
      />
      {/* Vignette back to the page surface, so sections below join seamlessly */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-surface" />
    </div>
  );
}
