"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { SERVICES } from "./services-data";
import { Button, ButtonLink, type ButtonSize, type ButtonVariant } from "./ui/Button";

interface StartJourneyButtonProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Slug of the service to preselect, e.g. on a service page. */
  defaultService?: string;
}

/**
 * "Start Your Journey" CTA: opens a picker so the visitor tells us who they are,
 * then hands them to the contact form with that service preselected.
 */
export default function StartJourneyButton({
  label = "Start your journey",
  variant = "primary",
  size = "md",
  className,
  defaultService,
}: StartJourneyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {open && (
        <JourneyDialog defaultService={defaultService} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function JourneyDialog({
  defaultService,
  onClose,
}: {
  defaultService?: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(
    () => SERVICES.find((s) => s.slug === defaultService)?.slug ?? SERVICES[0].slug,
  );
  const service = SERVICES.find((s) => s.slug === selected) ?? SERVICES[0];

  // showModal() gives us the focus trap, Escape, background inertness and
  // top-layer stacking for free — no hand-rolled state, no body-overflow hack.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Clicks land on the dialog element itself only when they hit the backdrop.
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-label="Start your journey"
      className="modal-pop m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-line bg-surface-overlay p-0 text-ink backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-surface-raised hover:text-ink"
        >
          <X size={18} />
        </button>

        <h2 className="max-w-xs text-2xl leading-tight text-ink sm:text-3xl">
          What are we building together?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Pick what fits where you are today. We&rsquo;ll take you to a short form —
          three fields, and a real person replies.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            const active = s.slug === selected;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => setSelected(s.slug)}
                aria-pressed={active}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? "border-accent bg-accent/10"
                    : "border-line bg-surface-raised hover:border-line-strong hover:bg-surface-overlay"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    active ? "border-accent/40 bg-accent/15" : "border-line bg-surface-overlay"
                  }`}
                >
                  <Icon size={18} className={active ? "text-accent" : "text-ink-muted"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">{s.name}</span>
                  <span className="mt-0.5 block truncate text-xs text-ink-subtle">
                    {s.audience}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`h-4 w-4 shrink-0 rounded-full border ${
                    active ? "border-accent bg-accent" : "border-line-strong"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={`/contact?service=${service.slug}`}
            onClick={() => ref.current?.close()}
            className="flex-1"
          >
            Continue
            <ArrowRight size={15} />
          </ButtonLink>
          <Link
            href={`/services/${service.slug}`}
            onClick={() => ref.current?.close()}
            className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-surface-raised px-5 text-sm font-medium text-ink transition-colors hover:bg-surface-overlay"
          >
            Read about {service.name}
          </Link>
        </div>
      </div>
    </dialog>
  );
}
