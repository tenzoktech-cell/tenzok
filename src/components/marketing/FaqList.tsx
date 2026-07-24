import { Plus } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="premium-card overflow-hidden rounded-3xl">
      {items.map((item) => (
        <details
          key={item.q}
          className="group border-b border-line last:border-b-0"
        >
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-left text-base font-medium text-ink transition-colors hover:bg-surface-overlay sm:px-7 [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus
              aria-hidden
              size={18}
              className="shrink-0 text-ink-subtle transition-transform duration-200 group-open:rotate-45 group-open:text-accent"
            />
          </summary>
          <p className="max-w-3xl px-5 pb-6 text-sm leading-relaxed text-ink-muted sm:px-7 sm:text-base">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
