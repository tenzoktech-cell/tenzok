import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import { DOMAINS, TOTAL_PROJECTS } from "@/components/projects-data";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Mini and major project briefs across Python full-stack, Java, AI, machine learning, deep learning, data engineering, mobile, cloud, cybersecurity and IoT — scoped, built, deployed and defensible.",
};

const MINI = DOMAINS.reduce(
  (n, d) => n + d.projects.filter((p) => p.tier === "mini").length,
  0,
);
const MAJOR = TOTAL_PROJECTS - MINI;

const STATS = [
  { value: String(TOTAL_PROJECTS), label: "Project briefs, scoped and ready to build" },
  { value: String(DOMAINS.length), label: "Engineering domains, from full-stack to IoT" },
  { value: `${MINI} / ${MAJOR}`, label: "Mini projects and major capstones" },
];

export default function ProjectsIndexPage() {
  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <TenzokNav />

      <section className="pt-36 pb-8 sm:pt-44">
        <Container>
          <Reveal>
            <Eyebrow>Projects</Eyebrow>
            <h1 className="mt-6 max-w-3xl text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] text-ink">
              Every project we build,{" "}
              <span className="font-display italic text-accent">in the open.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              A mini project is a semester. A major project is a capstone you defend. A
              company build is the same work with a contract on it. These are the briefs
              we scope — pick one, bring your own, or ask us to shape a problem statement
              you have been handed.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <StartJourneyButton size="lg" label="Start a project" />
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Send us your problem statement
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <dl className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2 bg-surface-raised p-6">
                  <dd className="text-4xl font-medium tracking-tight text-ink">
                    {stat.value}
                  </dd>
                  <dt className="text-sm text-ink-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain, i) => {
            const Icon = domain.icon;
            const mini = domain.projects.filter((p) => p.tier === "mini").length;
            const major = domain.projects.length - mini;
            return (
              <Reveal key={domain.slug} delay={(i % 3) * 70} className="h-full">
                <Link
                  href={`/projects/${domain.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-line-strong hover:bg-surface-overlay"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                      <Icon
                        size={20}
                        className="text-ink-muted transition-colors group-hover:text-accent"
                      />
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-ink-subtle transition-colors group-hover:text-accent"
                    />
                  </div>

                  <h2 className="mt-6 text-lg text-ink">{domain.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {domain.tagline}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {domain.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 border-t border-line pt-4 text-xs text-ink-subtle">
                    {mini} mini · {major} major
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}
