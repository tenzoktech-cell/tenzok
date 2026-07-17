"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { login } from "@/lib/auth-actions";

// text-base (16px) is deliberate: iOS Safari zooms the page when a focused
// input has a font-size below 16px.
const INPUT =
  "w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-base text-ink placeholder:text-ink-subtle transition-colors hover:border-line-strong focus:border-accent";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
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

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Password
        </label>
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

      <div aria-live="polite">
        {state?.error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
            <p className="text-sm text-ink">{state.error}</p>
          </div>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
