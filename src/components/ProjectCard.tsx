import { Check, Clock3, Layers3 } from "lucide-react";
import { TIER_LABEL, type ProjectBrief } from "./projects-data";

export function projectAnchor(title: string) {
  return `brief-${title
    .toLocaleLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")}`;
}

/** One project brief. Used on the domain pages and the projects index. */
export default function ProjectCard({ project }: { project: ProjectBrief }) {
  const isMajor = project.tier === "major";
  return (
    <article
      id={projectAnchor(project.title)}
      className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-line bg-surface-raised p-6 shadow-xl shadow-black/10 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-overlay sm:p-7"
    >
      <div
        aria-hidden
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
          isMajor ? "via-accent" : "via-cool"
        } to-transparent opacity-70`}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
            isMajor
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-cool/30 bg-cool/10 text-cool"
          }`}
        >
          {TIER_LABEL[project.tier]}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
          <Clock3 size={13} />
          {project.duration}
        </span>
      </div>

      <h3 className="mt-6 text-xl leading-snug text-ink">{project.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-line bg-surface px-2 py-1 text-xs text-ink-subtle"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-7 flex-1 rounded-2xl border border-line bg-surface/60 p-5">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
          <Layers3 size={13} />
          You walk away with
        </p>
        <ul className="mt-4 flex flex-col gap-3">
          {project.deliverables.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line bg-surface-overlay">
                <Check size={11} className="text-accent" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
