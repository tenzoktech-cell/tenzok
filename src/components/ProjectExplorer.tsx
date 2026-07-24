"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  FolderKanban,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { projectAnchor } from "./ProjectCard";
import type { Tier } from "./projects-data";

export interface ExplorerProject {
  title: string;
  summary: string;
  tier: Tier;
  stack: string[];
  duration: string;
  domainName: string;
  domainSlug: string;
}

interface ProjectExplorerProps {
  projects: ExplorerProject[];
  domains: { slug: string; name: string }[];
}

const TIER_OPTIONS: { value: "all" | Tier; label: string }[] = [
  { value: "all", label: "All briefs" },
  { value: "mini", label: "Mini projects" },
  { value: "major", label: "Major projects" },
];

export default function ProjectExplorer({ projects, domains }: ProjectExplorerProps) {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [tier, setTier] = useState<"all" | Tier>("all");
  const [technology, setTechnology] = useState("all");

  const technologies = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.stack))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [projects],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();

    return projects.filter((project) => {
      const matchesQuery =
        needle.length === 0 ||
        [
          project.title,
          project.summary,
          project.domainName,
          project.duration,
          ...project.stack,
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(needle);

      return (
        matchesQuery &&
        (domain === "all" || project.domainSlug === domain) &&
        (tier === "all" || project.tier === tier) &&
        (technology === "all" || project.stack.includes(technology))
      );
    });
  }, [domain, projects, query, technology, tier]);

  const hasFilters =
    query.trim().length > 0 || domain !== "all" || tier !== "all" || technology !== "all";

  function resetFilters() {
    setQuery("");
    setDomain("all");
    setTier("all");
    setTechnology("all");
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-raised p-5 shadow-2xl shadow-black/20 sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cool/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-1/4 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="relative">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                <SlidersHorizontal size={16} className="text-accent" />
                Find the right brief
              </p>
              <p className="mt-1 text-sm text-ink-subtle">
                Search by outcome, domain, project size, or technology.
              </p>
            </div>
            <p className="text-sm text-ink-muted" aria-live="polite" aria-atomic="true">
              <span className="font-medium text-ink">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "brief" : "briefs"} found
            </p>
          </div>

          <form
            role="search"
            aria-label="Filter project briefs"
            className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_1fr_1fr]"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="relative block">
              <span className="sr-only">Search project briefs</span>
              <Search
                aria-hidden
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search AI, Flutter, deployment..."
                className="min-h-12 w-full rounded-xl border border-line bg-surface-overlay pl-11 pr-4 text-base text-ink outline-none placeholder:text-ink-subtle transition-colors hover:border-line-strong focus:border-accent"
              />
            </label>

            <label>
              <span className="sr-only">Filter by domain</span>
              <select
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                className="min-h-12 w-full cursor-pointer rounded-xl border border-line bg-surface-overlay px-4 text-base text-ink outline-none transition-colors hover:border-line-strong focus:border-accent"
              >
                <option value="all">Every domain</option>
                {domains.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="sr-only">Filter by technology</span>
              <select
                value={technology}
                onChange={(event) => setTechnology(event.target.value)}
                className="min-h-12 w-full cursor-pointer rounded-xl border border-line bg-surface-overlay px-4 text-base text-ink outline-none transition-colors hover:border-line-strong focus:border-accent"
              >
                <option value="all">Every technology</option>
                {technologies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </form>

          <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Filter by project size">
              {TIER_OPTIONS.map((option) => {
                const active = tier === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTier(option.value)}
                    className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${
                      active
                        ? "border-accent bg-accent-strong text-accent-ink"
                        : "border-line bg-surface-overlay text-ink-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-full px-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <RotateCcw size={14} />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => {
            const major = project.tier === "major";
            return (
              <article
                key={`${project.domainSlug}-${project.title}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface-raised p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-overlay"
              >
                <div
                  aria-hidden
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                    major ? "via-accent" : "via-cool"
                  } to-transparent opacity-70`}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                      major
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-cool/30 bg-cool/10 text-cool"
                    }`}
                  >
                    {major ? "Major project" : "Mini project"}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
                    <Clock3 size={13} />
                    {project.duration}
                  </span>
                </div>

                <p className="mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
                  <FolderKanban size={13} />
                  {project.domainName}
                </p>
                <h3 className="mt-3 text-lg leading-snug text-ink">{project.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {project.summary}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink-subtle"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 5 && (
                    <span className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle">
                      +{project.stack.length - 5}
                    </span>
                  )}
                </div>

                <Link
                  href={`/projects/${project.domainSlug}#${projectAnchor(project.title)}`}
                  className="mt-6 inline-flex min-h-11 items-center justify-between border-t border-line pt-4 text-sm font-medium text-ink transition-colors hover:text-accent"
                >
                  View full brief
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface-raised px-6 py-16 text-center">
          <FolderKanban size={24} className="mx-auto text-ink-subtle" />
          <h3 className="mt-4 text-lg text-ink">No brief matches those filters</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
            Try a broader technology or clear the filters. You can also send us your own
            problem statement for a custom scope.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line-strong bg-surface-overlay px-5 text-sm font-medium text-ink transition-colors hover:border-accent"
          >
            <RotateCcw size={14} />
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
