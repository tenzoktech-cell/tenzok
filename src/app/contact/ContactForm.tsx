"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail } from "lucide-react";
import { SITE } from "@/lib/site";
import { getService, SERVICES } from "@/components/services-data";
import { Button } from "@/components/ui/Button";
import { MIN_FILL_MS, validateEnquiry, type FieldErrors } from "./validate";

/**
 * Submits straight from the browser to Web3Forms.
 *
 * This is not a shortcut — it is the only thing that works. Web3Forms sits behind
 * Cloudflare bot protection, which serves a "Just a moment..." challenge to any
 * server-side client (verified: Node fetch gets a 403 challenge page regardless of
 * headers, while the same request from a browser returns 200). So a Next.js server
 * action physically cannot deliver, on localhost or on Vercel.
 *
 * The access key is public by design — Web3Forms' own documented snippet puts it in
 * a hidden input in the page HTML. It authorises "send mail to the address this key
 * is registered to" and nothing else. If it ever gets abused, rotate it in the
 * Web3Forms dashboard and turn on their spam protection.
 */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const ROLES = [
  "Student",
  "Final-year / capstone team",
  "Startup founder",
  "Company / enterprise",
  "Other",
];

// text-base (16px) is deliberate and must not be reduced: iOS Safari zooms the
// entire page in when a focused input has a font-size below 16px, and the user
// then has to pinch back out after every single field.
const INPUT =
  "min-h-12 w-full rounded-xl border border-line bg-surface-overlay px-4 py-3 text-base text-ink outline-none placeholder:text-ink-subtle transition-[border-color,background-color,box-shadow] hover:border-line-strong focus:border-accent focus:bg-surface";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const defaultService = serviceSlug ? getService(serviceSlug)?.name : undefined;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const mountedAt = useRef(0);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    // Honeypot: hidden from people, irresistible to bots. Answer as if it worked.
    if (get("botcheck")) {
      setStatus("success");
      setMessage("Thanks — we'll be in touch.");
      return;
    }

    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus("error");
      setErrors({});
      setMessage("That was submitted a little too fast. Please try again.");
      return;
    }

    const fields = {
      name: get("name"),
      email: get("email"),
      role: get("role"),
      message: get("message"),
      service: get("service"),
    };

    const found = validateEnquiry(fields);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStatus("error");
      setMessage("Please fix the fields below.");
      return;
    }

    setErrors({});
    setStatus("sending");

    if (!ACCESS_KEY) {
      // Never pretend a lead was captured.
      setStatus("error");
      setMessage(
        "Our form isn't connected to an inbox yet, so this message was NOT sent. Please email us directly — we reply to every message.",
      );
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Tenzok enquiry — ${fields.service || "General"} — ${fields.name}`,
          from_name: fields.name,
          replyto: fields.email,
          message: [
            `Name:    ${fields.name}`,
            `Email:   ${fields.email}`,
            `I am a:  ${fields.role || "Not specified"}`,
            `Service: ${fields.service || "Not specified"}`,
            "",
            fields.message,
          ].join("\n"),
        }),
      });

      if (!res.ok) throw new Error(`Web3Forms responded ${res.status}`);

      setStatus("success");
      setMessage(
        `Thanks ${fields.name} — that's with us. We reply to every enquiry, usually within a working day.`,
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage(
        "Something went wrong sending that, so it was NOT delivered. Please email us directly instead.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="relative overflow-hidden rounded-3xl border border-accent/30 bg-accent/[0.07] p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cool/15 blur-3xl"
        />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
          <CheckCircle2 size={23} className="text-accent" />
        </span>
        <h2 className="relative mt-5 text-2xl text-ink">Message sent</h2>
        <p className="relative mt-3 text-base leading-relaxed text-ink-muted">{message}</p>
        <Link
          href="/"
          className="relative mt-7 inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface-overlay px-5 text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          Back to Tenzok
        </Link>
      </div>
    );
  }

  const failed = status === "error";
  // A delivery failure needs the mailto escape hatch; a validation error does not.
  const deliveryFailed = failed && Object.keys(errors).length === 0;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      {/* Honeypot. Web3Forms treats a filled "botcheck" as spam too. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="botcheck">Do not fill this in</label>
        <input id="botcheck" name="botcheck" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Your name" name="name" error={errors.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          placeholder="Ada Lovelace"
          className={INPUT}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
      </Field>

      <Field label="Email" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={INPUT}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
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

      <Field label="What are you building?" name="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="A sentence or two is plenty. Your problem statement, your product, or just where you're stuck."
          className={`${INPUT} resize-y`}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>

      <Field label="Which service?" name="service" optional>
        <select
          id="service"
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

      <div aria-live="polite">
        {failed && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm text-ink">{message}</p>
            {deliveryFailed && (
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

      <Button
        type="submit"
        size="lg"
        disabled={status === "sending"}
        className="w-full"
      >
        {status === "sending" ? "Sending…" : "Send enquiry"}
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
    <div className="flex flex-col gap-2.5">
      <label htmlFor={name} className="flex items-center gap-2 text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-ink-subtle">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
