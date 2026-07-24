import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers3, Search, Sparkles } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ProjectExplorer, { type ExplorerProject } from "@/components/ProjectExplorer";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import { DOMAINS, TOTAL_PROJECTS } from "@/components/projects-data";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mini & Major Project Ideas for Final Year Students",
  description: `${TOTAL_PROJECTS} project briefs across Python full-stack, Java, AI, machine learning, deep learning, data engineering, mobile, cloud, security, test automation, IoT, robotics and VLSI chip design — scoped, built with you, deployed and defensible.`,
  keywords: [
    "final year project ideas",
    "mini project ideas",
    "major project ideas",
    "capstone project ideas",
    "machine learning project ideas",
    "python full stack project",
    "java project ideas for final year",
    "deep learning project ideas",
    "vlsi project ideas",
    "ece final year project",
    "eee final year project",
    "robotics project ideas",
    "mern stack project ideas",
  ],
  alternates: { canonical: url("/projects") },
  ...socialMetadata({
    title: "Mini & Major Project Ideas — Tenzok",
    description: `${TOTAL_PROJECTS} project briefs across ${DOMAINS.length} engineering domains — including robotics and VLSI chip design. Scoped, built with you, deployed, and defensible in a viva.`,
    path: "/projects",
  }),
};

const MINI = DOMAINS.reduce(
  (total, domain) => total + domain.projects.filter((project) => project.tier === "mini").length,
  0,
);
const MAJOR = TOTAL_PROJECTS - MINI;

const STATS = [
  { value: String(TOTAL_PROJECTS), label: "Detailed briefs" },
  { value: String(DOMAINS.length), label: "Engineering domains" },
  { value: `${MINI} / ${MAJOR}`, label: "Mini / major projects" },
];

const EXPLORER_PROJECTS: ExplorerProject[] = DOMAINS.flatMap((domain) =>
  domain.projects.map((project) => ({
    title: project.title,
    summary: project.summary,
    tier: project.tier,
    stack: project.stack,
    duration: project.duration,
    domainName: domain.name,
    domainSlug: domain.slug,
  })),
);

export default function ProjectsIndexPage() {
  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
          ]),
          itemListSchema(
            "Engineering project domains",
            DOMAINS.map((domain) => ({
              name: domain.name,
              path: `/projects/${domain.slug}`,
            })),
          ),
        ]}
      />
      <TenzokNav />

      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-24 h-[38rem] w-[38rem] rounded-full bg-cool/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
        />

        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)] lg:gap-14">
            <Reveal>
              <Eyebrow>Student project studio</Eyebrow>
              <h1 className="mt-6 max-w-3xl text-[clamp(2.6rem,1.9rem+3vw,4.75rem)] leading-[0.98] text-ink">
                Build a project you can{" "}
                <span className="bg-gradient-to-r from-accent to-cool bg-clip-text text-transparent">
                  explain, defend, and deploy.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">
                Pick a scoped brief, bring your department&rsquo;s problem statement, or
                start with an idea. We turn it into a real engineering plan and build it
                with you—never behind a black box.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <StartJourneyButton size="lg" label="Start your project" />
                <ButtonLink href="#explore-projects" variant="secondary" size="lg">
                  Explore all briefs
                  <ArrowRight size={16} />
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative max-w-md overflow-hidden rounded-3xl border border-line bg-surface-raised p-5 shadow-2xl shadow-black/25 sm:p-6 lg:ml-auto">
                <div
                  aria-hidden
                  className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cool/15 blur-3xl"
                />
                <div className="relative flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Sparkles size={19} className="text-accent" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Built for the viva</p>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      Scope, code, deployment, docs, explanation.
                    </p>
                  </div>
                </div>

                <dl className="relative mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="flex flex-col bg-surface-overlay p-3 sm:p-4">
                      <dt className="order-2 mt-1 text-xs leading-snug text-ink-subtle">
                        {stat.label}
                      </dt>
                      <dd className="order-1 text-xl font-medium tracking-tight text-ink sm:text-2xl">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section id="explore-projects">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Project explorer"
            title={
              <>
                Find the brief that fits{" "}
                <span className="gradient-text">your ambition.</span>
              </>
            }
            copy="Filter every existing brief by domain, project size, or technology. Each result links to the full scope and deliverables."
          />
          <Reveal delay={100}>
            <div className="flex items-center gap-3 rounded-full border border-line bg-surface-raised px-4 py-2.5 text-sm text-ink-muted">
              <Search size={15} className="text-cool" />
              {TOTAL_PROJECTS} briefs, one searchable catalogue
            </div>
          </Reveal>
        </div>

        <Reveal delay={120} className="mt-12">
          <ProjectExplorer
            projects={EXPLORER_PROJECTS}
            domains={DOMAINS.map((domain) => ({
              slug: domain.slug,
              name: domain.name,
            }))}
          />
        </Reveal>
      </Section>

      <Section bordered>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Browse by domain"
            title={
              <>
                Go deeper into an{" "}
                <span className="gradient-text">engineering track.</span>
              </>
            }
            copy="Every domain page explains where the work fits for students and companies, then separates focused mini projects from major capstones."
          />
          <Reveal delay={100}>
            <ButtonLink href="/services/student-projects" variant="secondary">
              How project support works
              <ArrowRight size={15} />
            </ButtonLink>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain, index) => {
            const Icon = domain.icon;
            const mini = domain.projects.filter((project) => project.tier === "mini").length;
            const major = domain.projects.length - mini;

            return (
              <Reveal key={domain.slug} delay={(index % 3) * 60} className="h-full">
                <Link
                  href={`/projects/${domain.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-overlay"
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cool to-transparent opacity-0 transition-opacity group-hover:opacity-70"
                  />
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface-overlay transition-colors group-hover:border-cool/30 group-hover:bg-cool/10">
                      <Icon
                        size={20}
                        className="text-ink-muted transition-colors group-hover:text-cool"
                      />
                    </span>
                    <ArrowUpRight
                      size={17}
                      className="text-ink-subtle transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                  </div>

                  <h2 className="mt-6 text-lg text-ink">{domain.name}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {domain.tagline}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {domain.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs text-ink-subtle">
                    <Layers3 size={13} />
                    {mini} mini · {major} major
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section bordered>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-surface-raised p-8 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <Eyebrow>Your own problem statement</Eyebrow>
              <h2 className="mt-6 text-3xl leading-tight text-ink sm:text-4xl">
                Don&rsquo;t see the exact project you need?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                Send the brief your department gave you. We&rsquo;ll tell you honestly
                what fits the timeline, what to cut, and what will make the work
                defensible.
              </p>
            </div>
            <ButtonLink href="/contact?service=student-projects" size="lg" className="relative mt-7 shrink-0 lg:mt-0">
              Request a custom project
              <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <CtaFooter />
    </main>
  );
}
