"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, GraduationCap, LockKeyhole, Mail, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InternationalPhoneField } from "@/components/ui/InternationalPhoneField";
import { signup } from "@/lib/auth-actions";

const INPUT = "w-full rounded-2xl border border-line bg-surface/70 px-4 py-3.5 text-base text-ink placeholder:text-ink-subtle transition-all hover:border-line-strong focus:border-cool focus:bg-surface";
const ICON_INPUT = `${INPUT} pl-11`;
const LABEL = "text-xs font-medium uppercase tracking-[0.12em] text-ink-muted";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, null);
  const noticeRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => { if (state?.notice) noticeRef.current?.focus(); }, [state?.notice]);
  // Keep all progress after an error. Only clear the secret that may be wrong.
  useEffect(() => { if (state?.error) setPassword(""); }, [state?.error]);

  if (state?.notice) return <div ref={noticeRef} role="status" tabIndex={-1} className="rounded-[1.75rem] border border-cool/30 bg-gradient-to-br from-cool/10 to-accent/5 p-8"><span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cool/30 bg-cool/10 text-cool"><CheckCircle2 size={22} /></span><h2 className="mt-5 text-2xl font-semibold tracking-tight text-ink">Check your inbox</h2><p className="mt-3 text-sm leading-6 text-ink-muted">{state.notice}</p></div>;

  return <form action={action} className="flex flex-col gap-5" noValidate>
    <div className="flex flex-col gap-2"><label htmlFor="name" className={LABEL}>Your name</label><div className="relative"><UserRound aria-hidden size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"/><input id="name" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ada Lovelace" className={ICON_INPUT}/></div></div>
    <fieldset className="flex flex-col gap-2"><legend className={LABEL}>I&rsquo;m a&hellip;</legend><div className="mt-2 grid grid-cols-2 gap-3">{["Student", "Company"].map((option) => <label key={option} className="group flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface/70 px-4 text-sm font-medium text-ink-muted transition-all hover:border-line-strong hover:bg-surface has-checked:border-cool/60 has-checked:bg-cool/10 has-checked:text-ink"><input type="radio" name="designation" value={option} required checked={designation === option} onChange={(event) => setDesignation(event.target.value)} className="sr-only"/>{option === "Student" ? <GraduationCap size={17} className="text-ink-subtle group-has-checked:text-cool"/> : <Building2 size={17} className="text-ink-subtle group-has-checked:text-cool"/>}{option}</label>)}</div></fieldset>
    <div className="flex flex-col gap-2"><label htmlFor="email" className={LABEL}>Email</label><div className="relative"><Mail aria-hidden size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"/><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={ICON_INPUT}/></div></div>
    <div className="flex flex-col gap-2"><label htmlFor="phone" className={`${LABEL} flex items-center gap-2`}>Mobile number <span className="font-normal normal-case tracking-normal text-ink-subtle">Optional</span></label><InternationalPhoneField id="phone" name="phone"/></div>
    <div className="flex flex-col gap-2"><label htmlFor="password" className={LABEL}>Password</label><div className="relative"><LockKeyhole aria-hidden size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"/><input id="password" name="password" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className={ICON_INPUT}/></div></div>
    <div className="flex flex-col gap-2"><label htmlFor="country" className={LABEL}>Country</label><div className="relative"><MapPin aria-hidden size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"/><input id="country" name="country" autoComplete="country-name" required value={country} onChange={(event) => setCountry(event.target.value)} placeholder="India" className={ICON_INPUT}/></div></div>
    <div className="flex flex-col gap-2"><label htmlFor="address" className={`${LABEL} flex items-center gap-2`}>Address <span className="font-normal normal-case tracking-normal text-ink-subtle">Optional</span></label><div className="relative"><MapPin aria-hidden size={17} className="pointer-events-none absolute left-4 top-4 text-ink-subtle"/><textarea id="address" name="address" rows={3} autoComplete="street-address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street, city, state" className={`${ICON_INPUT} resize-y`}/></div></div>
    <div aria-live="polite" className="empty:hidden">{state?.error && <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4"><p className="text-sm leading-relaxed text-red-100">{state.error}</p><p className="mt-1 text-xs text-red-100/70">Your details are saved here—review the highlighted issue and try again.</p></div>}</div>
    <Button type="submit" size="lg" disabled={pending} className="group mt-1 w-full shadow-lg shadow-black/20">{pending ? "Creating account…" : "Create account"}{!pending && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5"/>}</Button>
  </form>;
}