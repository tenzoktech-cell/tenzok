"use client";

import { useState } from "react";
import { Check, Clock3 } from "lucide-react";
import type { ServiceStep } from "./services-data";

// h-11/w-11 = 44px. The connector offsets below are derived from this size —
// change one and you must change the others.
const NODE_BASE =
  "relative z-10 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm font-medium shadow-lg shadow-black/20 transition-[border-color,background-color,color,transform]";
const NODE_DONE = "border-accent bg-accent-strong text-accent-ink";
const NODE_CURRENT =
  "scale-110 border-accent bg-gradient-to-br from-[#3566dc] to-[#7134c9] text-white";
const NODE_UPCOMING =
  "border-line-strong bg-surface-overlay text-ink-subtle hover:border-accent hover:text-ink";

function nodeClass(index: number, active: number) {
  if (index < active) return `${NODE_BASE} ${NODE_DONE}`;
  if (index === active) return `${NODE_BASE} ${NODE_CURRENT}`;
  return `${NODE_BASE} ${NODE_UPCOMING}`;
}

/**
 * Click-through journey stepper. Deliberately has no auto-advance: a timed
 * carousel that moves while you are reading is a WCAG 2.2.2 failure, and
 * nothing about a six-step process needs a timer.
 */
export default function ProcessBar({ steps }: { steps: ServiceStep[] }) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-raised p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-cool/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />

      {/* ------------------------- Desktop ------------------------- */}
      <div className="relative hidden md:block">
        <ol className="flex">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex flex-1 flex-col items-center gap-3 px-1">
              {i > 0 && (
                <span
                  aria-hidden
                  // top = node centre (22px) − half the 2px line
                  className={`absolute top-[21px] h-0.5 rounded-full transition-colors duration-300 ${
                    i <= active
                      ? "bg-gradient-to-r from-accent to-cool"
                      : "bg-line"
                  }`}
                  style={{ left: "calc(-50% + 28px)", right: "calc(50% + 28px)" }}
                />
              )}
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${s.title}`}
                className={nodeClass(i, active)}
              >
                {i < active ? <Check size={16} /> : i + 1}
              </button>
              <span
                className={`max-w-[9rem] text-center text-xs leading-snug ${
                  i === active ? "font-medium text-ink" : "text-ink-subtle"
                }`}
              >
                {s.title}
              </span>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-line bg-surface-overlay/80 p-7 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle">
              Step {active + 1} of {steps.length}
            </p>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs text-ink-muted">
              <Clock3 size={12} />
              {step.duration}
            </span>
          </div>
          <h3 className="mt-5 text-xl text-ink">{step.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{step.desc}</p>
        </div>
      </div>

      {/* ------------------------- Mobile -------------------------- */}
      <ol className="relative md:hidden">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                // left = node centre (22px) − half the 2px line; top = node height
                className={`absolute bottom-0 left-[21px] top-11 w-0.5 rounded-full ${
                  i < active ? "bg-gradient-to-b from-accent to-cool" : "bg-line"
                }`}
              />
            )}
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${s.title}`}
              className={nodeClass(i, active)}
            >
              {i < active ? <Check size={16} /> : i + 1}
            </button>
            <div className="flex-1 pt-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-medium text-ink">{s.title}</h3>
                <span className="flex items-center gap-1 rounded-full border border-line bg-surface-overlay px-2 py-0.5 text-xs text-ink-subtle">
                  <Clock3 size={11} />
                  {s.duration}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
