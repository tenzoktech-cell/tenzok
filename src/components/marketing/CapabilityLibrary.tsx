import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import {
  DOMAINS,
  TIER_LABEL,
  type ProjectBrief,
  type ProjectDomain,
} from "@/components/projects-data";

const REPRESENTATIVE_DOMAINS = [
  "js-full-stack",
  "mobile",
  "ai-agents",
  "data-engineering",
  "cloud-devops",
  "robotics-drones",
] as const;

const REPRESENTATIVE_BRIEFS = REPRESENTATIVE_DOMAINS.flatMap((slug) => {
  const domain = DOMAINS.find((item) => item.slug === slug);
  if (!domain) return [];
  const brief = domain.projects.find((project) => project.tier === "major");
  return brief ? [{ domain, brief }] : [];
});

export function CapabilityGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DOMAINS.map((domain) => {
        const Icon = domain.icon;
        return (
          <Link
            key={domain.slug}
            href={`/projects/${domain.slug}`}
            className="premium-card premium-card-hover group flex h-full flex-col rounded-3xl p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface-overlay">
                <Icon
                  aria-hidden
                  size={20}
                  className="text-ink-muted transition-colors group-hover:text-accent"
                />
              </span>
              <span className="rounded-md border border-line px-2.5 py-1 text-xs text-ink-subtle">
                {domain.projects.length} briefs
              </span>
            </div>
            <h3 className="mt-6 text-lg text-ink">{domain.name}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
              {domain.forCompanies}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {domain.stack.slice(0, 4).map((technology) => (
                <span
                  key={technology}
                  className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle"
                >
                  {technology}
                </span>
              ))}
            </div>
            <span className="mt-6 inline-flex items-center gap-2 border-t border-line pt-5 text-sm font-medium text-accent">
              Explore the domain
              <ArrowUpRight
                aria-hidden
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function RepresentativeBriefs() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {REPRESENTATIVE_BRIEFS.map(({ domain, brief }) => (
        <BriefCard key={`${domain.slug}-${brief.title}`} domain={domain} brief={brief} />
      ))}
    </div>
  );
}

function BriefCard({
  domain,
  brief,
}: {
  domain: ProjectDomain;
  brief: ProjectBrief;
}) {
  return (
    <article className="premium-card premium-card-hover flex h-full flex-col rounded-3xl p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-md bg-accent/15 px-2.5 py-1 font-medium text-accent">
          Build brief
        </span>
        <span className="rounded-md border border-line px-2.5 py-1 text-ink-subtle">
          {TIER_LABEL[brief.tier]}
        </span>
        <span className="inline-flex items-center gap-1.5 text-ink-subtle">
          <Clock aria-hidden size={12} />
          {brief.duration}
        </span>
      </div>
      <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
        {domain.name}
      </p>
      <h3 className="mt-2 text-xl leading-snug text-ink">{brief.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
        {brief.summary}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {brief.stack.map((technology) => (
          <span
            key={technology}
            className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle"
          >
            {technology}
          </span>
        ))}
      </div>
      <Link
        href={`/projects/${domain.slug}`}
        className="mt-6 inline-flex min-h-11 items-center gap-2 border-t border-line pt-5 text-sm font-medium text-accent"
      >
        See the full brief
        <ArrowUpRight aria-hidden size={15} />
      </Link>
    </article>
  );
}
