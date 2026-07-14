"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/components/services-data";
import { Button } from "@/components/ui/Button";
import { submitEnquiry } from "./actions";
import { INITIAL_CONTACT_STATE } from "./form-state";

const ROLES = [
  "Student",
  "Final-year / capstone team",
  "Startup founder",
  "Company / enterprise",
  "Other",
];

const INPUT =
  "w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-subtle transition-colors hover:border-line-strong focus:border-accent";

export default function ContactForm({ defaultService }: { defaultService?: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiry, INITIAL_CONTACT_STATE);
  const mountedAt = useRef(0);
  const successRef = useRef<HTMLDivElement>(null);

  // Recorded on mount and attached at submit time, so the server can reject
  // instant (bot) submissions. Not rendered — a Date.now() in the markup would
  // differ between server and client and break hydration.
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  const submit = (formData: FormData) => {
    formData.set("started_at", String(mountedAt.current));
    formAction(formData);
  };

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-8"
      >
        <CheckCircle2 size={24} className="text-accent" />
        <h2 className="mt-4 text-xl text-ink">Message sent</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={submit} className="flex flex-col gap-6" noValidate>

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Do not fill this in</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Your name" name="name" error={state.errors?.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          placeholder="Ada Lovelace"
          className={INPUT}
        />
      </Field>

      <Field label="Email" name="email" error={state.errors?.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={INPUT}
        />
      </Field>

      <Field label="I'm a…" name="role" optional>
        <select id="role" name="role" className={`${INPUT} cursor-pointer`} defaultValue="">
          <option value="">Select one</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </Field>

      <Field label="What are you building?" name="message" error={state.errors?.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="A sentence or two is plenty. Your problem statement, your product, or just where you're stuck."
          className={`${INPUT} resize-y`}
        />
      </Field>

      <Field label="Which service?" name="service_choice" optional>
        <select
          id="service_choice"
          name="service"
          defaultValue={defaultService ?? ""}
          className={`${INPUT} cursor-pointer`}
        >
          <option value="">Not sure yet</option>
          {SERVICES.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </Field>

      <div aria-live="polite" className="min-h-0">
        {state.status === "error" && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm text-ink">{state.message}</p>
            {state.fallback && (
              <a
                href={`mailto:${SITE.email}`}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent underline underline-offset-4"
              >
                <Mail size={14} />
                {SITE.email}
              </a>
            )}
          </div>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-ink-subtle">Optional</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
