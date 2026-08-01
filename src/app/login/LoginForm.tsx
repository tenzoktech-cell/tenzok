"use client";

import { useActionState, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { login } from "@/lib/auth-actions";

// text-base (16px) prevents iOS Safari from zooming when a field receives focus.
const INPUT = "w-full rounded-2xl border border-line bg-surface/70 py-3.5 pl-11 pr-12 text-base text-ink placeholder:text-ink-subtle transition-all hover:border-line-strong focus:border-cool focus:bg-surface focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-cool)_12%,transparent)]";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Retain the email for a quick correction, but never retain a failed password.
  useEffect(() => {
    if (state?.error) setPassword("");
  }, [state?.error]);

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Email</label>
        <div className="relative">
          <Mail aria-hidden size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={INPUT} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">Password</label>
        <div className="relative">
          <LockKeyhole aria-hidden size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className={INPUT} />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-ink-subtle transition-colors hover:bg-surface-overlay hover:text-ink">
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      <div aria-live="polite" className="empty:hidden">
        {state?.error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4"><p className="text-sm leading-relaxed text-red-100">{state.error}</p><p className="mt-1 text-xs text-red-100/70">Your email is still here—check the password and try again.</p></div>}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="group mt-1 w-full shadow-lg shadow-black/20">
        {pending ? "Logging in…" : "Log in"}
        {!pending && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
      </Button>
    </form>
  );
}