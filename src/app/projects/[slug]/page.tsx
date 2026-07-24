import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  GraduationCap,
  Layers3,
  Sparkles,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ProjectCard from "@/components/ProjectCard";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import { DOMAINS, getDomain } from "@/components/projects-data";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import SectionHeading from "@/components/sections/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { socialMetadata, url } from "@/lib/site";

export function generateStaticParams() {
  return DOMAINS.map((domain) => ({ slug: domain.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const domain = getDomain(slug);
  if (!domain) return {};

  const mini = domain.projects.filter((project) => project.tier === "mini").length;
  const major = domain.projects.length - mini;

  return {
    title: `${domain.name} Projects — Mini & Major`,
    description: `${domain.projects.length} ${domain.name} project briefs for students and teams — ${mini} mini projects and ${major} major capstones. ${domain.tagline}`,
    keywords: [
      `${domain.name} projects`,
      `${domain.name} final year project`,
      `${domain.name} mini project`,
      `${domain.name} major project`,
      ...domain.stack.slice(0, 4).map((tech) => `${tech} project`),
    ],
    alternates: { canonical: url(`/projects/${slug}`) },
    ...socialMetadata({
      title: `${domain.name} Projects — Tenzok`,
      description: domain.tagline,
      path: `/projects/${slug}`,
    }),
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const domain = getDomain(slug);
  if (!domain) notFound();

  const mini = domain.projects.filter((project) => project.tier === "mini");
  const major = domain.projects.filter((project) => project.tier === "major");
  const others = DOMAINS.filter((item) => item.slug !== domain.slug);
  const Icon = domain.icon;

  return (
    <main id="main" tabIndex={-1} className="overflow-hidden bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: domain.name, path: `/projects/${domain.slug}` },
          ]),
          itemListSchema(
            `${domain.name} project briefs`,
            domain.projects.map((project) => ({
              name: project.title,
              path: `/projects/${domain.slug}`,
            })),
          ),
        ]}
      />
      <TenzokNav />

      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-cool/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-24 h-[38rem] w-[38rem] rounded-full bg-accent/10 blur-3xl"
        />

        <Container className="relative">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-subtle transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} />
            All student projects
          </Link>

          <div className="mt-9 grid items-end gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:gap-16">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cool/30 bg-cool/10 shadow-lg shadow-black/20">
                  <Icon size={24} className="text-cool" />
                </span>
                <div>
                  <Eyebrow>{domain.projects.length} scoped briefs</Eyebrow>
                  <p className="mt-2 text-sm text-ink-subtle">
                    {mini.length} mini · {major.length} major
                  </p>
                </div>
              </div>

              <h1 className="mt-7 max-w-4xl text-[clamp(2.75rem,1.8rem+3vw,5rem)] leading-[0.98] text-ink">
                {domain.name}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted">
                {domain.intro}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {domain.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs text-ink-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <StartJourneyButton size="lg" label="Start a project" />
                <ButtonLink href="/contact" variant="secondary" size="lg">
                  Discuss a custom brief
                  <ArrowRight size={16} />
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <aside className="relative overflow-hidden rounded-3xl border border-line bg-surface-raised p-7 shadow-2xl shadow-black/25">
                <div
                  aria-hidden
                  className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
                />
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Sparkles size={18} className="text-accent" />
                  </span>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                    The standard
                  </p>
                  <h2 className="mt-3 text-2xl leading-tight text-ink">
                    Build the system. Understand every trade-off.
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    Every brief ends with working software, documented decisions, and
                    evidence you can present—not a folder of code you cannot explain.
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section bordered>
        <SectionHeading
          eyebrow="Two audiences, one engineering standard"
          title={
            <>
              Academic depth meets{" "}
              <span className="gradient-text">production discipline.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <article className="relative h-full overflow-hidden rounded-3xl border border-cool/25 bg-cool/[0.06] p-7 sm:p-8">
              <GraduationCap size={22} className="text-cool" />
              <h2 className="mt-6 text-xl font-medium text-ink">For students</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Pick a brief below, or bring the problem statement your department
                handed you. We architect it with you, review every commit, deploy it to
                a real URL, and rehearse the viva until no question surprises you.
              </p>
              <ButtonLink
                href="/services/student-projects"
                variant="secondary"
                className="mt-7"
              >
                See student support
                <ArrowRight size={15} />
              </ButtonLink>
            </article>
          </Reveal>
          <Reveal delay={80} className="h-full">
            <article className="relative h-full overflow-hidden rounded-3xl border border-accent/25 bg-accent/[0.06] p-7 sm:p-8">
              <Building2 size={22} className="text-accent" />
              <h2 className="mt-6 text-xl font-medium text-ink">For companies</h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                {domain.forCompanies}
              </p>
              <ButtonLink
                href="/contact?service=company-services"
                variant="secondary"
                className="mt-7"
              >
                Discuss a company build
                <ArrowRight size={15} />
              </ButtonLink>
            </article>
          </Reveal>
        </div>
      </Section>

      <ProjectTier
        id="mini"
        eyebrow="Mini projects"
        title="Focused scope. Real engineering."
        copy="Three to four weeks. Narrow enough to finish, deep enough that you learn the decision that actually matters."
        projects={mini}
      />

      <ProjectTier
        id="major"
        eyebrow="Major projects"
        title="Capstones you can defend."
        copy="Ten to twelve weeks. Architecture, trade-offs, failure modes, deployment, and evidence—the project that carries an interview."
        projects={major}
        bordered
      />

      <Section bordered>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Explore more</Eyebrow>
            <h2 className="mt-6 text-3xl leading-tight text-ink sm:text-4xl">
              Other engineering domains
            </h2>
          </div>
          <ButtonLink href="/projects#explore-projects" variant="secondary">
            Search every brief
            <ArrowRight size={15} />
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other) => {
            const OtherIcon = other.icon;
            return (
              <Link
                key={other.slug}
                href={`/projects/${other.slug}`}
                className="group flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-line bg-surface-raised px-5 transition-[border-color,background-color] hover:border-line-strong hover:bg-surface-overlay"
              >
                <span className="flex min-w-0 items-center gap-3 text-sm font-medium text-ink-muted transition-colors group-hover:text-ink">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                    <OtherIcon size={16} className="text-ink-subtle" />
                  </span>
                  <span className="truncate">{other.name}</span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-ink-subtle transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </Link>
            );
          })}
        </div>
      </Section>

      <CtaFooter />
    </main>
  );
}

function ProjectTier({
  id,
  eyebrow,
  title,
  copy,
  projects,
  bordered = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  projects: React.ComponentProps<typeof ProjectCard>["project"][];
  bordered?: boolean;
}) {
  if (projects.length === 0) return null;

  return (
    <Section id={id} bordered={bordered}>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-2xl text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            {copy}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-sm text-ink-muted">
            <Layers3 size={15} className={id === "major" ? "text-accent" : "text-cool"} />
            {projects.length} {projects.length === 1 ? "brief" : "briefs"}
          </div>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((project, index) => (
          <Reveal key={project.title} delay={(index % 2) * 70} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
