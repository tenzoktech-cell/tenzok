import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import TenzokNav from "@/components/TenzokNav";
import { Container, Eyebrow } from "@/components/ui/Section";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";
import { url } from "@/lib/site";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Tenzok account.",
  alternates: { canonical: url("/login") },
  robots: { index: false },
};

export default async function LoginPage() {
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
          className="pointer-events-none absolute left-[-12rem] top-24 -z-10 h-[30rem] w-[30rem] rounded-full bg-cool/10 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-12rem] right-[-8rem] -z-10 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-[140px]"
        />

        <Container className="max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.75fr)] lg:gap-20">
            <div className="max-w-2xl">
              <Eyebrow>Client workspace</Eyebrow>
              <h1 className="mt-7 text-[clamp(3rem,2rem+4vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-ink">
                Welcome back.
                <span className="mt-2 block bg-gradient-to-r from-cool via-ink to-accent bg-clip-text text-transparent">
                  Let&rsquo;s keep building.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
                Return to your projects, profile, and conversations with the
                Tenzok team from one focused workspace.
              </p>

              <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
                {[
                  "Manage active projects",
                  "Continue team conversations",
                  "Keep your profile current",
                  "Track every next step",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface-raised/50 px-4 py-3 text-sm text-ink-muted backdrop-blur"
                  >
                    <CheckCircle2 size={16} className="shrink-0 text-cool" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-px rounded-[2rem] bg-gradient-to-br from-cool/50 via-line to-accent/40 blur-[1px]"
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface-raised/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
                <div className="flex items-center justify-between gap-4 border-b border-line pb-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-cool">
                      Secure access
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                      Log in to Tenzok
                    </h2>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cool/30 bg-cool/10 text-cool">
                    <ShieldCheck size={21} />
                  </span>
                </div>

                <div className="mt-7">
                  <LoginForm />
                </div>

                <p className="mt-7 border-t border-line pt-6 text-sm text-ink-muted">
                  New to Tenzok?{" "}
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-1 font-medium text-ink transition-colors hover:text-cool"
                  >
                    Create an account
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
