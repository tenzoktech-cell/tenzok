import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import TenzokNav from "@/components/TenzokNav";
import { Container, Eyebrow } from "@/components/ui/Section";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import { url } from "@/lib/site";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your Tenzok account.",
  alternates: { canonical: url("/signup") },
  robots: { index: false },
};

export default async function SignupPage() {
  if (isSupabaseConfigured) {
    const supabase = createClient(await cookies());
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/");
  }

  return (
    <main id="main" tabIndex={-1} className="bg-surface">
      <TenzokNav />

      <section className="relative isolate min-h-screen overflow-hidden pb-20 pt-28 sm:pt-36 lg:flex lg:items-center lg:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-10rem] top-16 -z-10 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[130px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-10rem] right-[-10rem] -z-10 h-[36rem] w-[36rem] rounded-full bg-cool/10 blur-[150px]"
        />

        <Container className="max-w-7xl">
          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(28rem,0.9fr)] lg:gap-20">
            <div className="max-w-xl lg:sticky lg:top-36">
              <Eyebrow>Join the workspace</Eyebrow>
              <h1 className="mt-7 text-[clamp(3rem,2.2rem+3.4vw,5.8rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-ink">
                Ideas move faster
                <span className="mt-2 block bg-gradient-to-r from-cool via-ink to-accent bg-clip-text text-transparent">
                  with the right team.
                </span>
              </h1>
              <p className="mt-7 text-base leading-7 text-ink-muted sm:text-lg">
                Create your Tenzok account to organise your work, share context,
                and stay close to the people helping you ship.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  ["A workspace built around delivery", "Keep project context and progress in one place."],
                  ["Direct access to your team", "Continue conversations without losing momentum."],
                  ["A profile that grows with you", "Keep your goals, skills, and organisation details current."],
                ].map(([title, copy]) => (
                  <div key={title} className="flex gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cool/30 bg-cool/10 text-cool">
                      <CheckCircle2 size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-ink-muted">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-cool/45 via-line to-accent/45 blur-[1px]"
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface-raised/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
                <div className="flex items-center justify-between gap-4 border-b border-line pb-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-cool">
                      Get started
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                      Create your account
                    </h2>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                    <Sparkles size={20} />
                  </span>
                </div>

                <div className="mt-7">
                  <SignupForm />
                </div>

                <p className="mt-7 border-t border-line pt-6 text-sm text-ink-muted">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 font-medium text-ink transition-colors hover:text-cool"
                  >
                    Log in
                    <ArrowUpRight size={14} />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
