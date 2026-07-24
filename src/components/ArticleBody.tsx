import { Check, Info, TriangleAlert } from "lucide-react";
import type { Block } from "./blog-types";

/** Slug for an h2, so every section is deep-linkable. Google uses these for
 *  "jump to" links in results. */
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ArticleBody({ body }: { body: Block[] }) {
  return (
    <div className="flex flex-col text-pretty">
      {body.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={headingId(block.text)}
          className="mt-20 scroll-mt-28 border-t border-line pt-10 text-2xl leading-tight text-ink sm:text-3xl"
        >
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={headingId(block.text)}
          className="mt-12 scroll-mt-28 text-xl leading-snug text-ink sm:text-2xl"
        >
          {block.text}
        </h3>
      );

    case "p":
      return (
        <p className="mt-6 text-[1.0625rem] leading-[1.85] text-ink-muted">
          {block.text}
        </p>
      );

    case "ul":
      return (
        <ul className="mt-7 flex flex-col gap-3 rounded-2xl border border-line bg-surface-raised/60 p-5 sm:p-6">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-base leading-[1.75] text-ink-muted"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                <Check aria-hidden size={11} className="text-accent" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="mt-7 flex flex-col gap-4 rounded-2xl border border-line bg-surface-raised/60 p-5 sm:p-6">
          {block.items.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 text-base leading-[1.75] text-ink-muted"
            >
              <span
                aria-hidden
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-xs font-medium text-accent"
              >
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );

    case "code":
      return (
        // min-w-0 + max-w-full: without them a long code line propagates its
        // intrinsic width up through every ancestor and widens the page itself.
        // The code must scroll inside this box and nowhere else.
        <div className="mt-9 min-w-0 max-w-full overflow-hidden rounded-2xl border border-line bg-surface-overlay shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between border-b border-line bg-surface-raised px-4 py-3">
            <span className="text-xs uppercase tracking-[0.14em] text-ink-subtle">
              {block.lang}
            </span>
            <span aria-hidden className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent/70" />
              <span className="h-2 w-2 rounded-full bg-cool/70" />
              <span className="h-2 w-2 rounded-full bg-line-strong" />
            </span>
          </div>
          <pre className="max-w-full overflow-x-auto p-5">
            <code className="font-mono text-sm leading-relaxed text-ink">
              {block.code}
            </code>
          </pre>
        </div>
      );

    case "callout": {
      const warn = block.tone === "warn";
      const Icon = warn ? TriangleAlert : Info;
      return (
        <aside
          className={`mt-9 flex gap-4 rounded-2xl border p-5 sm:p-6 ${
            warn
              ? "border-accent/30 bg-accent/[0.07]"
              : "border-cool/25 bg-cool/[0.06]"
          }`}
        >
          <Icon
            size={18}
            className={`mt-0.5 shrink-0 ${warn ? "text-accent" : "text-cool"}`}
          />
          <p className="text-sm leading-relaxed text-ink-muted">{block.text}</p>
        </aside>
      );
    }

    case "quote":
      return (
        <blockquote className="relative mt-12 overflow-hidden rounded-2xl border border-line bg-surface-raised p-7 sm:p-8">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent to-cool"
          />
          <p className="font-display text-xl italic leading-relaxed text-ink sm:text-2xl">
            {block.text}
          </p>
        </blockquote>
      );
  }
}
