import { Info, TriangleAlert } from "lucide-react";
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
    <div className="flex flex-col">
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
          className="mt-16 scroll-mt-28 text-2xl leading-snug text-ink sm:text-3xl"
        >
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3
          id={headingId(block.text)}
          className="mt-10 scroll-mt-28 text-lg text-ink sm:text-xl"
        >
          {block.text}
        </h3>
      );

    case "p":
      return (
        <p className="mt-6 text-base leading-[1.75] text-ink-muted">{block.text}</p>
      );

    case "ul":
      return (
        <ul className="mt-6 flex flex-col gap-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-base leading-[1.7] text-ink-muted"
            >
              <span aria-hidden className="mt-3 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="mt-6 flex flex-col gap-3">
          {block.items.map((item, i) => (
            <li
              key={item}
              className="flex items-start gap-3 text-base leading-[1.7] text-ink-muted"
            >
              <span
                aria-hidden
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-line text-xs text-ink-subtle"
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
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface-raised">
          <div className="border-b border-line px-4 py-2">
            <span className="text-xs uppercase tracking-[0.14em] text-ink-subtle">
              {block.lang}
            </span>
          </div>
          {/* Wide code scrolls inside its own box — the page body must never
              scroll horizontally. */}
          <pre className="overflow-x-auto p-4">
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
          className={`mt-8 flex gap-4 rounded-2xl border p-5 ${
            warn ? "border-accent/30 bg-accent/[0.06]" : "border-line bg-surface-raised"
          }`}
        >
          <Icon
            size={18}
            className={`mt-0.5 shrink-0 ${warn ? "text-accent" : "text-ink-subtle"}`}
          />
          <p className="text-sm leading-relaxed text-ink-muted">{block.text}</p>
        </aside>
      );
    }

    case "quote":
      return (
        <blockquote className="mt-10 border-l-2 border-accent pl-6">
          <p className="font-display text-xl italic leading-relaxed text-ink sm:text-2xl">
            {block.text}
          </p>
        </blockquote>
      );
  }
}
