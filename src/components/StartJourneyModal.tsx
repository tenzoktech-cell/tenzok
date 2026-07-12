"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, Mail, X } from "lucide-react";
import { SERVICES } from "./services-data";

interface StartJourneyButtonProps {
  className?: string;
  label?: string;
  /** Slug of the service to preselect, e.g. on a service page. */
  defaultService?: string;
}

/**
 * "Start Your Journey" CTA: opens a modal where the visitor picks the
 * service that fits them, then continues by email (subject prefilled)
 * or explores that service's page.
 */
export default function StartJourneyButton({
  className,
  label = "Start Your Journey",
  defaultService,
}: StartJourneyButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      {/* Portal to <body>: ancestors keep a transform after their entrance
          animations, which would otherwise trap this fixed overlay. */}
      {open &&
        createPortal(
          <JourneyModal defaultService={defaultService} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  );
}

function JourneyModal({
  defaultService,
  onClose,
}: {
  defaultService?: string;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(
    () => SERVICES.find((s) => s.slug === defaultService)?.slug ?? SERVICES[0].slug,
  );
  const service = SERVICES.find((s) => s.slug === selected) ?? SERVICES[0];

  // Close on Escape; lock page scroll while open.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const mailHref = `mailto:hello@tenzok.com?subject=${encodeURIComponent(
    `Start my journey — ${service.name}`,
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Start your journey"
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
    >
      <div
        className="modal-fade absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="modal-pop relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0c0c0c] p-6 shadow-2xl shadow-black/60 sm:rounded-3xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <p className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-[#e8702a]">
          <span className="h-px w-6 bg-[#e8702a]/60" aria-hidden />
          Start your journey
        </p>
        <h2
          className="mt-3 text-3xl leading-[1.05] text-white sm:text-4xl"
          style={{ letterSpacing: "-0.04em" }}
        >
          What are we building{" "}
          <span className="font-playfair italic text-[#e8702a]">together?</span>
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Pick what fits where you are today — we&rsquo;ll take it from there. No
          forms, no spam: it opens a plain email to our team.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const active = s.slug === selected;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => setSelected(s.slug)}
                aria-pressed={active}
                className={`flex items-center gap-4 rounded-2xl border p-3.5 text-left transition-all sm:p-4 ${
                  active
                    ? "border-[#e8702a] bg-[#e8702a]/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    active ? "border-[#e8702a]/40 bg-[#e8702a]/15" : "border-white/10 bg-white/5"
                  }`}
                >
                  <Icon size={18} className="text-[#e8702a]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-white">{s.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-white/50">
                    {s.audience}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`h-4 w-4 shrink-0 rounded-full border transition-all ${
                    active
                      ? "border-[#e8702a] bg-[#e8702a] ring-4 ring-[#e8702a]/20"
                      : "border-white/25"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={mailHref}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e8702a] px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95"
          >
            <Mail size={15} />
            Email us about {service.name}
          </a>
          <Link
            href={`/services/${service.slug}`}
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            Explore {service.name}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
