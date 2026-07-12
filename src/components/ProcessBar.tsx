"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { ServiceStep } from "./services-data";

const ADVANCE_MS = 4000;

const NODE_BASE =
  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300";
const NODE_DONE = "border-[#e8702a] bg-[#e8702a] text-white";
const NODE_CURRENT =
  "border-[#e8702a] bg-[#e8702a] text-white scale-110 shadow-lg shadow-[#e8702a]/40 node-pulse";
const NODE_UPCOMING =
  "border-white/25 bg-[#0a0a0a] text-white/60 hover:border-white/45 hover:text-white/85";

function nodeClass(index: number, active: number) {
  if (index < active) return `${NODE_BASE} ${NODE_DONE}`;
  if (index === active) return `${NODE_BASE} ${NODE_CURRENT}`;
  return `${NODE_BASE} ${NODE_UPCOMING}`;
}

/**
 * Animated client-journey stepper: horizontal with an auto-advancing
 * progress rail on desktop, a vertical timeline on mobile. Clicking a
 * node jumps to that step; hovering pauses the auto-advance.
 */
export default function ProcessBar({ steps }: { steps: ServiceStep[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % steps.length),
      ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, steps.length]);

  const step = steps[active];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* ------------------------- Desktop ------------------------- */}
      <div className="hidden md:block">
        <ol className="flex">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex flex-1 flex-col items-center gap-3 px-1">
              {/* Connector from the previous node's centre to this one. */}
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute top-[18px] h-[3px] rounded-full transition-colors duration-500 ${
                    i <= active
                      ? "bg-gradient-to-r from-[#e8702a]/70 to-[#e8702a]"
                      : "bg-white/10"
                  }`}
                  style={{ left: "calc(-50% + 26px)", right: "calc(50% + 26px)" }}
                />
              )}
              <button
                onClick={() => setActive(i)}
                aria-current={i === active ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${s.title}`}
                className={nodeClass(i, active)}
              >
                {i < active ? <Check size={16} /> : i + 1}
              </button>
              <span
                className={`max-w-[9rem] text-center text-xs leading-snug transition-colors duration-300 ${
                  i === active
                    ? "font-medium text-white"
                    : i < active
                      ? "text-white/70"
                      : "text-white/50"
                }`}
              >
                {s.title}
              </span>
            </li>
          ))}
        </ol>

        {/* Active step detail — remounts on change to replay the fade. */}
        <div
          key={active}
          className="hero-anim hero-fade mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#e8702a]">
              Step {active + 1} of {steps.length}
            </p>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/60">
              {step.duration}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-medium text-white sm:text-2xl">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{step.desc}</p>
        </div>
      </div>

      {/* ------------------------- Mobile -------------------------- */}
      <ol className="md:hidden">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={`absolute bottom-0 left-[19px] top-11 w-[2px] rounded-full transition-colors duration-500 ${
                  i < active ? "bg-[#e8702a]" : "bg-white/10"
                }`}
              />
            )}
            <button
              onClick={() => setActive(i)}
              aria-current={i === active ? "step" : undefined}
              aria-label={`Step ${i + 1}: ${s.title}`}
              className={nodeClass(i, active)}
            >
              {i < active ? <Check size={16} /> : i + 1}
            </button>
            <div className="flex-1 pt-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-base font-medium transition-colors duration-300 ${
                    i === active ? "text-white" : "text-white/85"
                  }`}
                >
                  {s.title}
                </h3>
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] text-white/60">
                  {s.duration}
                </span>
              </div>
              <p
                className={`mt-1.5 text-sm leading-relaxed transition-colors duration-300 ${
                  i === active ? "text-white/70" : "text-white/55"
                }`}
              >
                {s.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
