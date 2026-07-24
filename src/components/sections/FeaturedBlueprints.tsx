import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { DOMAINS } from "../projects-data";
import { ButtonLink } from "../ui/Button";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const PICKS = [
  { domain: "js-full-stack", index: 2 },
  { domain: "ai-agents", index: 0 },
  { domain: "mobile", index: 3 },
  { domain: "cloud-devops", index: 2 },
];

const FEATURED = PICKS.flatMap((pick) => {
  const domain = DOMAINS.find((item) => item.slug === pick.domain);
  const project = domain?.projects[pick.index];
  return domain && project ? [{ domain, project }] : [];
});

export default function FeaturedBlueprints() {
  return (
    <Section id="portfolio" bordered>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Featured build blueprints"
          title={
            <>
              Serious ideas, scoped like{" "}
              <span className="gradient-text">real products.</span>
            </>
          }
          copy="These are transparent engineering briefs from our build library—not claims of client work. Each one includes a realistic stack, scope, timeline, and finished deliverables."
        />
        <Reveal delay={100}>
          <ButtonLink href="/portfolio" variant="secondary">
            Explore the build library
            <ArrowRight size={15} />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        {FEATURED.map(({ domain, project }, index) => {
          const Icon = domain.icon;
          return (
            <Reveal key={project.title} delay={(index % 2) * 70} className="h-full">
              <Link
                href={`/projects/${domain.slug}`}
                className="premium-card premium-card-hover group relative flex h-full min-h-[21rem] flex-col overflow-hidden rounded-3xl p-7 sm:p-8"
              >
                <div
                  aria-hidden
                  className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-cool/12 to-accent/12 blur-3xl"
                />
                <div className="relative flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <Icon size={21} className="text-cool" />
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ink-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>

                <div className="relative mt-auto pt-16">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-subtle">
                    <span className="rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-medium text-accent">
                      {project.tier === "major" ? "Major capstone" : "Mini project"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 size={12} />
                      {project.duration}
                    </span>
                  </div>
                  <h3 className="mt-4 max-w-lg text-2xl leading-tight text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
                    {project.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
