import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Building2, GraduationCap } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import ProjectCard from "@/components/ProjectCard";
import StartJourneyButton from "@/components/StartJourneyModal";
import TenzokNav from "@/components/TenzokNav";
import { DOMAINS, getDomain } from "@/components/projects-data";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/sections/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section } from "@/components/ui/Section";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo";
import { url } from "@/lib/site";

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

  const mini = domain.projects.filter((p) => p.tier === "mini").length;
  const major = domain.projects.length - mini;

  return {
    title: `${domain.name} Projects — Mini & Major`,
    // Written for the search result, not for us: names the tiers and the stack,
    // because that is what the query actually contains.
    description: `${domain.projects.length} ${domain.name} project briefs for students and teams — ${mini} mini projects and ${major} major capstones. ${domain.tagline}`,
    keywords: [
      `${domain.name} projects`,
      `${domain.name} final year project`,
      `${domain.name} mini project`,
      `${domain.name} major project`,
      ...domain.stack.slice(0, 4).map((tech) => `${tech} project`),
    ],
    alternates: { canonical: url(`/projects/${slug}`) },
    openGraph: {
      title: `${domain.name} Projects — Tenzok`,
      description: domain.tagline,
      url: url(`/projects/${slug}`),
    },
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

  const mini = domain.projects.filter((p) => p.tier === "mini");
  const major = domain.projects.filter((p) => p.tier === "major");
  const others = DOMAINS.filter((d) => d.slug !== domain.slug);
  const Icon = domain.icon;

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <JsonLd
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: domain.name, path: `/projects/${domain.slug}` },
          ]),
          itemListSchema(
            `${domain.name} project briefs`,
            domain.projects.map((p) => ({
              name: p.title,
              path: `/projects/${domain.slug}`,
            })),
          ),
        ]}
      />
      <TenzokNav />

      <section className="pt-36 pb-8 sm:pt-44">
        <Container>
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-ink-subtle transition-colors hover:text-ink"
            >
              <ArrowLeft size={14} />
              All projects
            </Link>

            <div className="mt-8 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface-raised">
                <Icon size={24} className="text-accent" />
              </span>
              <Eyebrow>{domain.projects.length} briefs</Eyebrow>
            </div>

            <h1 className="mt-6 max-w-3xl text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.08] text-ink">
              {domain.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {domain.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {domain.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-line bg-surface-raised px-2.5 py-1.5 text-xs text-ink-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <StartJourneyButton size="lg" label="Start a project" />
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Discuss a custom brief
              </ButtonLink>
            </div>
          </Reveal>

          {/* The same domain, read by two different buyers. */}
          <Reveal delay={120}>
            <div className="mt-16 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface-raised p-6">
                <div className="flex items-center gap-3">
                  <GraduationCap size={18} className="text-cool" />
                  <h2 className="text-base font-medium text-ink">For students</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Pick a brief below, or bring the problem statement your department
                  handed you. We architect it with you, review every commit, deploy it to
                  a real URL, and rehearse the viva until no question surprises you.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface-raised p-6">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-accent" />
                  <h2 className="text-base font-medium text-ink">For companies</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {domain.forCompanies}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <ProjectTier
        id="mini"
        eyebrow="Mini projects"
        title="Small scope. Real engineering."
        copy="Three to four weeks. Narrow enough to finish, deep enough that you learn the thing that actually matters."
        projects={mini}
      />

      <ProjectTier
        id="major"
        eyebrow="Major projects"
        title="Capstones you can defend."
        copy="Ten to twelve weeks. The architecture, the trade-offs, and the failure modes — the project that carries your whole interview."
        projects={major}
        bordered
      />

      <Section bordered>
        <Eyebrow>Other domains</Eyebrow>
        <div className="mt-8 flex flex-wrap gap-2">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/projects/${other.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-raised px-4 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
            >
              {other.name}
              <ArrowUpRight size={14} />
            </Link>
          ))}
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
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-2xl text-3xl leading-[1.15] text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">{copy}</p>
      </Reveal>

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 80} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
