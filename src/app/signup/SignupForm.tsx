"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signup } from "@/lib/auth-actions";

// text-base (16px) is deliberate: iOS Safari zooms the page when a focused
// input has a font-size below 16px.
const INPUT =
  "w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-base text-ink placeholder:text-ink-subtle transition-colors hover:border-line-strong focus:border-accent";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, null);

  if (state?.notice) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-8">
        <CheckCircle2 size={24} className="text-accent" />
        <h2 className="mt-4 text-xl text-ink">Check your inbox</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{state.notice}</p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-ink">
          Your name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          placeholder="Ada Lovelace"
          className={INPUT}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-ink">I&rsquo;m a&hellip;</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {["Student", "Company"].map((option) => (
            <label
              key={option}
              className="flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface-raised px-4 text-sm font-medium text-ink-muted transition-colors hover:border-line-strong has-checked:border-accent has-checked:bg-accent/10 has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-white"
            >
              <input
                type="radio"
                name="designation"
                value={option}
                required
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

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
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="At least 6 characters"
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="country" className="text-sm font-medium text-ink">
          Country
        </label>
        <input
          id="country"
          name="country"
          autoComplete="country-name"
          required
          placeholder="India"
          className={INPUT}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="text-sm font-medium text-ink">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          autoComplete="street-address"
          required
          placeholder="Street, city, state"
          className={`${INPUT} resize-y`}
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
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
