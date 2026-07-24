"use client";

import { useActionState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { login } from "@/lib/auth-actions";

// text-base (16px) is deliberate: iOS Safari zooms the page when a focused
// input has a font-size below 16px.
const INPUT =
  "w-full rounded-2xl border border-line bg-surface/70 py-3.5 pl-11 pr-4 text-base text-ink placeholder:text-ink-subtle transition-all hover:border-line-strong focus:border-cool focus:bg-surface focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-cool)_12%,transparent)]";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
          Email
        </label>
        <div className="relative">
          <Mail
            aria-hidden
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={INPUT}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
          Password
        </label>
        <div className="relative">
          <LockKeyhole
            aria-hidden
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Your password"
            className={INPUT}
          />
        </div>
      </div>

      <div aria-live="polite">
        {state?.error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
            <p className="text-sm leading-relaxed text-red-100">{state.error}</p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="group mt-1 w-full shadow-lg shadow-black/20"
      >
        {pending ? "Logging in…" : "Log in"}
        {!pending && (
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        )}
      </Button>
    </form>
  );
}
