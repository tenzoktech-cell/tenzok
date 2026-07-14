import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DOMAINS, TOTAL_PROJECTS } from "../projects-data";
import { Section } from "../ui/Section";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/** The expertise grid. It answers a company's "have you built in my domain?"
 *  and a student's "is my project here?" with the same component.
 *  Both counts derive from the data, so the heading can never contradict the
 *  grid beneath it when a domain is added. */
export default function ProjectDomains() {
  return (
    <Section id="domains" bordered>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="What we build"
          title={
            <>
              {DOMAINS.length} domains.{" "}
              <span className="font-display italic text-accent">
                {TOTAL_PROJECTS} briefs.
              </span>{" "}
              One standard.
            </>
          }
          copy="From a three-week mini project to a twelve-week capstone to a company build — the same discipline runs through all of it: scoped in writing, reviewed line by line, deployed, and documented."
        />
        <Reveal delay={120}>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-line-strong bg-surface-raised px-5 text-sm font-medium text-ink transition-colors hover:bg-surface-overlay"
          >
            Browse every project
            <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOMAINS.map((domain, i) => {
          const Icon = domain.icon;
          const mini = domain.projects.filter((p) => p.tier === "mini").length;
          const major = domain.projects.filter((p) => p.tier === "major").length;
          return (
            <Reveal key={domain.slug} delay={(i % 3) * 80} className="h-full">
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

                <h3 className="mt-6 text-lg text-ink">{domain.name}</h3>
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
  );
}
