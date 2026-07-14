import { Clock } from "lucide-react";
import { TIER_LABEL, type ProjectBrief } from "./projects-data";

/** One project brief. Used on the domain pages and the projects index. */
export default function ProjectCard({ project }: { project: ProjectBrief }) {
  const isMajor = project.tier === "major";
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface-raised p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2 py-1 text-xs font-medium ${
            isMajor
              ? "bg-accent/15 text-accent"
              : "bg-cool/15 text-cool"
          }`}
        >
          {TIER_LABEL[project.tier]}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-ink-subtle">
          <Clock size={12} />
          {project.duration}
        </span>
      </div>

      <h3 className="mt-4 text-lg leading-snug text-ink">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.summary}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-line px-2 py-1 text-xs text-ink-subtle"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex-1 border-t border-line pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
          You walk away with
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {project.deliverables.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-muted"
            >
              <span
                aria-hidden
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-subtle"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
